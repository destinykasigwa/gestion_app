<?php

namespace App\Http\Controllers;

use App\Models\Transactions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RepertoireCaisseController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }


    public function getRepertoire(Request $request)
    {

        //POUR LE CDF
        $dateDebut = $request->dateToSearch1;
        $dateFin = $request->dateToSearch2;
        if (isset($request->userName) and isset($dateDebut) and isset($dateFin)) {
            $codeAgence = $request->AgenceName == "GOMA" ? 20 : null;
            $data = Transactions::where("transactions.NomUtilisateur", "=", $request->userName)
                ->where("transactions.CodeAgence", "=", $codeAgence)
                ->where("comptes.CodeMonnaie", "=", 2)
                ->where("comptes.RefGroupe", "=", 330)
                ->whereBetween('transactions.DateTransaction', [$dateDebut, $dateFin])
                ->join("comptes", 'transactions.NumCompte', '=', 'comptes.NumCompte')
                ->get([
                    'transactions.Creditfc as CreditFC',
                    'transactions.Debitfc as debitFC',
                    'transactions.NumTransaction as NumTrans',
                    'comptes.NomCompte as NomCompt',
                    'transactions.NumCompte as NumCompt',
                    'transactions.Operant as Initiateur',
                ]);


            //RECUPERE LE SOMME DE DEPOT ET DE RETRAIT
            //RECUPERE LE TOTAUX CDF
            $dataTotCDF = Transactions::select(
                DB::raw("SUM(transactions.Creditfc) as  totCredit"),
                DB::raw("SUM(transactions.Debitfc) as totDebit"),
            )->where("transactions.NomUtilisateur", '=', $request->userName)
                ->where("transactions.CodeAgence", "=", $codeAgence)
                ->where("comptes.CodeMonnaie", "=", 2)
                ->where("comptes.RefGroupe", "=", 330)
                ->whereBetween('transactions.DateTransaction', [$dateDebut, $dateFin])
                ->join("comptes", 'transactions.NumCompte', '=', 'comptes.NumCompte')
                ->groupBy("transactions.NomUtilisateur")
                ->get();




            //POUR LE USD
            $dateDebut = $request->dateToSearch1;
            $dateFin = $request->dateToSearch2;
            $codeAgence = $request->AgenceName == "GOMA" ? 20 : null;
            $dataUSD = Transactions::where("transactions.NomUtilisateur", "=", $request->userName)
                ->where("transactions.CodeAgence", "=", $codeAgence)
                ->where("comptes.CodeMonnaie", "=", 1)
                ->where("comptes.RefGroupe", "=", 330)
                ->whereBetween('transactions.DateTransaction', [$dateDebut, $dateFin])
                ->join("comptes", 'transactions.NumCompte', '=', 'comptes.NumCompte')
                ->get([
                    'transactions.Credit$ as CreditUSD',
                    'transactions.Debit$ as debitUSD',
                    'transactions.NumTransaction as NumTrans',
                    'comptes.NomCompte as NomCompt',
                    'transactions.NumCompte as NumCompt',
                    'transactions.Operant as Initiateur',
                ]);


            //RECUPERE LE SOMME DE DEPOT ET DE RETRAIT
            //RECUPERE LE TOTAUX CDF
            $dataTotUSD = Transactions::select(
                DB::raw("SUM(transactions.Credit$) as  totCreditUSD"),
                DB::raw("SUM(transactions.Debit$) as totDebitUSD"),
            )->where("transactions.NomUtilisateur", '=', $request->userName)
                ->where("transactions.CodeAgence", "=", $codeAgence)
                ->where("comptes.CodeMonnaie", "=", 1)
                ->where("comptes.RefGroupe", "=", 330)
                ->whereBetween('transactions.DateTransaction', [$dateDebut, $dateFin])
                ->join("comptes", 'transactions.NumCompte', '=', 'comptes.NumCompte')
                ->groupBy("transactions.NomUtilisateur")
                ->get();



            return response()->json(["success" => 1, "data" => $data, "totCDF" => $dataTotCDF, "dataUSD" => $dataUSD, "totUSD" => $dataTotUSD]);
        } else {
            return response()->json(["success" => 0, "msg" => "Ooooops something went wrong."]);
        }
    }

    //GET MAIN PAGE OR INDEX PAGE OF REPERTOIRE    
    public function getRepertoirePage()
    {

        return view('repertoirecaisse');
    }
}
