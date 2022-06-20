<?php

namespace App\Http\Controllers;

use App\Models\Comptes;
use App\Models\Tableautfr;
use App\Models\Transactions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TFRController extends Controller
{
    public function __construct()
    {
        $this->middleware("auth");
    }

    //RECUPERE LES DONNEES A AFFICHER SUR LE TFR

    public function getTFRData(Request $request)
    {
        // $data = Comptes::where("RefTypeCompte", "=", 7)
        //     ->leftJoin("transactions", "comptes.NumCompte", "=", "transactions.NumCompte")
        //     ->get();
        if (isset($request->devise)  and isset($request->dateToSearch2)) {
            // $firstdate = date('Y') . '-01-01';
            $time1 = strtotime($request->dateToSearch1);
            $time2 = strtotime($request->dateToSearch2);
            $newdate1 = date("Y-m-d", strtotime("-1 month", $time1));
            $newdate2 = date("Y-m-d", strtotime("-1 month", $time2));
            //VERIFIE SI L'INTERVALLE ENTREE PAR L'UTILISATEUR EXISTE
            $checkIfExist = Transactions::whereBetween('transactions.DateTransaction', [$request->dateToSearch1, $request->dateToSearch2])
                ->orWhereBetween('transactions.DateTransaction', [$newdate1, $newdate2])->first();
            if (!$checkIfExist) {
                return response()->json(["success" => 0, "msg" => "L'interval de la date choisit n'a pas été retrouvé réesayer une autre date merci."]);
            }
            if ($request->devise == "USD") {
                $data1 = Transactions::select(
                    DB::raw("SUM(transactions.Creditfc) as solde"),
                )->where("comptes.RefCadre", '=', 71)
                    ->where("transactions.CodeMonnaie", '=', 1)
                    ->whereBetween('transactions.DateTransaction', [$request->dateToSearch1, $request->dateToSearch2])
                    ->join("comptes", "transactions.NumCompte", "=", "comptes.NumCompte")
                    ->groupBy("transactions.NumCompte")
                    ->first();


                $data1_ = Transactions::select(
                    DB::raw("SUM(transactions.Creditfc) as solde"),
                )->where("comptes.RefCadre", '=', 71)
                    ->where("transactions.CodeMonnaie", '=', 1)
                    ->whereBetween('transactions.DateTransaction', [$newdate1, $newdate2])
                    ->join("comptes", "transactions.NumCompte", "=", "comptes.NumCompte")
                    ->groupBy("transactions.NumCompte")
                    ->first();


                $data2 = Transactions::select(
                    DB::raw("SUM(transactions.Creditfc) as solde"),
                )->where("comptes.RefCadre", '=', 74)
                    ->where("transactions.CodeMonnaie", '=', 1)
                    ->whereBetween('transactions.DateTransaction', [$request->dateToSearch1, $request->dateToSearch2])
                    ->join("comptes", "transactions.NumCompte", "=", "comptes.NumCompte")
                    ->groupBy("transactions.NumCompte")
                    ->first();


                $data2_ = Transactions::select(
                    DB::raw("SUM(transactions.Creditfc) as solde"),
                )->where("comptes.RefCadre", '=', 74)
                    ->where("transactions.CodeMonnaie", '=', 1)
                    ->whereBetween('transactions.DateTransaction', [$newdate1, $newdate2])
                    ->join("comptes", "transactions.NumCompte", "=", "comptes.NumCompte")
                    ->groupBy("transactions.NumCompte")
                    ->first();


                // //N
                // $data74 = Transactions::select(
                //     DB::raw("SUM(transactions.Credit$) as solde"),
                // )->where("comptes.RefCadre", '=', 74)
                //     ->where("transactions.CodeMonnaie", '=', 1)
                //     ->whereBetween('transactions.DateTransaction', [$request->dateToSearch1, $request->dateToSearch2])
                //     ->join("comptes", "transactions.NumCompte", "=", "comptes.NumCompte")
                //     ->groupBy("transactions.NumCompte")
                //     ->first();
                // //N-1

                // $data74_ = Transactions::select(
                //     DB::raw("SUM(transactions.Credit$) as solde"),
                // )->where("comptes.RefCadre", '=', 74)
                //     ->where("transactions.CodeMonnaie", '=', 1)
                //     ->whereBetween('transactions.DateTransaction', [$newdate1, $newdate2])
                //     ->join("comptes", "transactions.NumCompte", "=", "comptes.NumCompte")
                //     ->groupBy("transactions.NumCompte")
                //     ->first();

                $soldeDeCompte = DB::select('SELECT SUM(transactions.Credit$) As SommeProduit FROM transactions 
                LEFT JOIN comptes ON transactions.NumCompte=comptes.NumCompte WHERE comptes.RefTypeCompte=7 AND transactions.DateTransaction 
                BETWEEN "' . $request->dateToSearch1 . '" AND "' . $request->dateToSearch2 . '"   AND comptes.CodeMonnaie=1
                UNION SELECT SUM(transactions.Credit$) As SommeDepense FROM transactions 
                LEFT JOIN comptes ON transactions.NumCompte=comptes.NumCompte WHERE comptes.RefTypeCompte=6 
                AND transactions.DateTransaction BETWEEN "' . $request->dateToSearch1 . '" AND "' . $request->dateToSearch2 . '"  AND comptes.CodeMonnaie=1');



                $soldeDeCompte_ = DB::select('SELECT SUM(transactions.Credit$) As SommeProduit FROM transactions 
               LEFT JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
               WHERE comptes.RefTypeCompte=7  BETWEEN "' . $newdate1 . '" AND "' . $newdate2 . '" AND comptes.CodeMonnaie=1
               UNION SELECT SUM(transactions.Credit$) As SommeDepense FROM transactions 
               LEFT JOIN comptes ON transactions.NumCompte=comptes.NumCompte WHERE comptes.RefTypeCompte=6 
               AND transactions.DateTransaction BETWEEN "' . $newdate1 . '" AND "' . $newdate2 . '" AND comptes.CodeMonnaie=1');




                return response()->json(["success" => 1, "soldeCompte" => $soldeDeCompte, "soldeCompte_" => $soldeDeCompte_, "data1" => $data1, "data1_" => $data1_, "data2" => $data2, "data2_" => $data2_]);
            } else if ($request->devise == "CDF") {
                // $data = Tableautfr::All();
                $data1 = Transactions::select(
                    DB::raw("SUM(transactions.Creditfc) as solde"),
                )->where("comptes.RefCadre", '=', 71)
                    ->where("transactions.CodeMonnaie", '=', 2)
                    ->whereBetween('transactions.DateTransaction', [$request->dateToSearch1, $request->dateToSearch2])
                    ->join("comptes", "transactions.NumCompte", "=", "comptes.NumCompte")
                    ->groupBy("transactions.NumCompte")
                    ->first();


                $data1_ = Transactions::select(
                    DB::raw("SUM(transactions.Creditfc) as solde"),
                )->where("comptes.RefCadre", '=', 71)
                    ->where("transactions.CodeMonnaie", '=', 2)
                    ->whereBetween('transactions.DateTransaction', [$newdate1, $newdate2])
                    ->join("comptes", "transactions.NumCompte", "=", "comptes.NumCompte")
                    ->groupBy("transactions.NumCompte")
                    ->first();


                $data2 = Transactions::select(
                    DB::raw("SUM(transactions.Creditfc) as solde"),
                )->where("comptes.RefCadre", '=', 74)
                    ->where("transactions.CodeMonnaie", '=', 2)
                    ->whereBetween('transactions.DateTransaction', [$request->dateToSearch1, $request->dateToSearch2])
                    ->join("comptes", "transactions.NumCompte", "=", "comptes.NumCompte")
                    ->groupBy("transactions.NumCompte")
                    ->first();


                $data2_ = Transactions::select(
                    DB::raw("SUM(transactions.Creditfc) as solde"),
                )->where("comptes.RefCadre", '=', 74)
                    ->where("transactions.CodeMonnaie", '=', 2)
                    ->whereBetween('transactions.DateTransaction', [$newdate1, $newdate2])
                    ->join("comptes", "transactions.NumCompte", "=", "comptes.NumCompte")
                    ->groupBy("transactions.NumCompte")
                    ->first();


                $soldeDeCompte = DB::select('SELECT SUM(transactions.Creditfc) As SommeProduit FROM transactions 
                LEFT JOIN comptes ON transactions.NumCompte=comptes.NumCompte WHERE comptes.RefTypeCompte=7 
                AND transactions.DateTransaction BETWEEN "' . $request->dateToSearch1 . '" AND "' . $request->dateToSearch2 . '"   AND comptes.CodeMonnaie=2
                UNION SELECT SUM(transactions.Creditfc) As SommeDepense FROM transactions 
                LEFT JOIN comptes ON transactions.NumCompte=comptes.NumCompte WHERE comptes.RefTypeCompte=6 
                AND transactions.DateTransaction BETWEEN "' . $request->dateToSearch1 . '" AND "' . $request->dateToSearch2 . '" AND comptes.CodeMonnaie=2');



                $soldeDeCompte_ = DB::select('SELECT SUM(transactions.Creditfc) As SommeProduit FROM transactions 
                LEFT JOIN comptes ON transactions.NumCompte=comptes.NumCompte WHERE comptes.RefTypeCompte=7 
                AND transactions.DateTransaction BETWEEN "' . $newdate1 . '" AND "' . $newdate2 . '"
                AND comptes.CodeMonnaie=2
                UNION SELECT SUM(transactions.Creditfc) As SommeDepense FROM transactions 
                LEFT JOIN comptes ON transactions.NumCompte=comptes.NumCompte WHERE comptes.RefTypeCompte=6 
                AND transactions.DateTransaction BETWEEN "' . $newdate1 . '" AND "' . $newdate2 . '" AND comptes.CodeMonnaie=2');
                // //N-1

                // $data71_ = Transactions::select(
                //     DB::raw("SUM(transactions.Creditfc) as solde"),
                // )->where("comptes.RefCadre", '=', 71)
                //     ->where("transactions.CodeMonnaie", '=', 2)
                //     ->whereBetween('transactions.DateTransaction', [$newdate1, $newdate2])
                //     ->join("comptes", "transactions.NumCompte", "=", "comptes.NumCompte")
                //     ->groupBy("transactions.NumCompte")
                //     ->first();

                // //N
                // $data74 = Transactions::select(
                //     DB::raw("SUM(transactions.Creditfc) as solde"),
                // )->where("comptes.RefCadre", '=', 74)
                //     ->where("transactions.CodeMonnaie", '=', 2)
                //     ->whereBetween('transactions.DateTransaction', [$request->dateToSearch1, $request->dateToSearch2])
                //     ->join("comptes", "transactions.NumCompte", "=", "comptes.NumCompte")
                //     ->groupBy("transactions.NumCompte")
                //     ->first();
                // //N-1
                // $data74_ = Transactions::select(
                //     DB::raw("SUM(transactions.Creditfc) as solde"),
                // )->where("comptes.RefCadre", '=', 74)
                //     ->where("transactions.CodeMonnaie", '=', 2)
                //     ->whereBetween('transactions.DateTransaction', [$newdate1, $newdate2])
                //     ->join("comptes", "transactions.NumCompte", "=", "comptes.NumCompte")
                //     ->groupBy("transactions.NumCompte")
                //     ->first();
                return response()->json(["success" => 1, "date_n" => $newdate2, "soldeCompte" => $soldeDeCompte, "soldeCompte_" => $soldeDeCompte_, "data1" => $data1, "data1_" => $data1_, "data2" => $data2, "data2_" => $data2_]);
            }
        } else {
            return response()->json(["success" => 0, "msg" => "Veuillez sélectionnez la devise et la date avant de continuer"]);
        }
    }

    //AFFICHE LA PAGE POUR LE TFR

    public function getTfrPage()
    {
        return view('tfr');
    }
}
