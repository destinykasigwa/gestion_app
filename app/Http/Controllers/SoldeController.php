<?php

namespace App\Http\Controllers;

use App\Models\Comptes;
use App\Models\Transactions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SoldeController extends Controller
{
    public function __construct()
    {
        $this->middleware("auth");
    }
    //RECUPERE LE RELEVE DU MEMBRE


    public function getReleveMembre(Request $request)
    {


        if ($request->devise == "CDF") {
            $date1 = $request->dateToSearch1;
            $date2 = $request->dateToSearch2;
            $dataCDF = Comptes::where("NumAdherant", "=", $request->refCompte)->where("CodeMonnaie", "=", 2)->first();
            if ($dataCDF ? $numCompte = $dataCDF->NumCompte : null) {



                //RECUPERE LE SOLDE DU MEMBRE EN FC EN CDF
                $soldeMembre = Transactions::select(
                    DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
                    DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeMembreCDF"),
                )->where("NumCompte", "=", $numCompte)
                    ->groupBy("NumCompte")
                    ->get();

                //PUIS RECULE LE RELEVE EN PRENANT COMPTE DE COMULE DE SOLDE
                $dataReleve = DB::select('SELECT transactions.RéfTransaction,transactions.NumTransaction,transactions.DateTransaction,transactions.Libelle,transactions.Debitfc,transactions.Creditfc,comptes.NomCompte,comptes.CodeMonnaie, @cumul := @cumul + transactions.Creditfc-transactions.Debitfc 
            AS solde FROM ( SELECT @cumul := 0 ) AS C, transactions 
            INNER JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
            WHERE transactions.NumCompte="' . $numCompte . '" AND transactions.DateTransaction BETWEEN "' . $date1 . '" AND "' . $date2 . '"  
            ORDER BY transactions.DateTransaction,transactions.RéfTransaction');

                //RECUPERE LE TOTAUX CDF
                $dataTot = Transactions::select(
                    DB::raw("SUM(Creditfc) as  totCredit"),
                    DB::raw("SUM(Debitfc) as totDebit"),
                )->where("NumCompte", '=', $numCompte)
                    ->groupBy("NumCompte")
                    ->get();


                return response()->json(["success" => 1, "dataReleve" => $dataReleve, "dataSolde" => $soldeMembre, "infoMembre" => $dataCDF, "totCDF" => $dataTot]);
            } else {
                return response()->json(["success" => 0, "msg" => "Ce numéro compte ne semble pas existé"]);
            }
        } else if ($request->devise == "USD") {

            $date1 = $request->dateToSearch1;
            $date2 = $request->dateToSearch2;
            $dataUSD = Comptes::where("NumAdherant", "=", $request->refCompte)->where("CodeMonnaie", "=", 1)->first();
            if ($dataUSD ?  $numCompte = $dataUSD->NumCompte : null) {
                //RECUPERE LE SOLDE DU MEMBRE EN USD

                $soldeMembreUSD = Transactions::select(
                    DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
                )->where("NumCompte", '=', $numCompte)
                    ->groupBy("NumCompte")
                    ->get();

                $dataReleve = DB::select('SELECT transactions.RéfTransaction,transactions.NumTransaction,transactions.DateTransaction,transactions.Libelle,transactions.Debit$,transactions.Credit$,comptes.NomCompte,comptes.CodeMonnaie, @cumul := @cumul + transactions.Credit$-transactions.Debit$ 
            AS solde 
            FROM ( SELECT @cumul := 0 ) 
            AS C, transactions INNER JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
            WHERE transactions.NumCompte="' . $numCompte . '" AND transactions.DateTransaction BETWEEN "' . $date1 . '" AND "' . $date2 . '" 
            ORDER BY transactions.DateTransaction,transactions.RéfTransaction
            ');
                //RECUPERE LE TOTAUX USD
                $dataTot = Transactions::select(
                    DB::raw("SUM(Credit$) as  totCredit"),
                    DB::raw("SUM(Debit$) as totDebit")
                )->where("NumCompte", '=', $numCompte)
                    ->groupBy("NumCompte")
                    ->get();

                return response()->json(["success" => 1, "dataReleve" => $dataReleve, "dataSolde" => $soldeMembreUSD, "infoMembre" => $dataUSD, "totUSD" => $dataTot]);
            } else {
                return response()->json(["success" => 0, "msg" => "Ce numéro compte ne semble pas existé"]);
            }
        }
    }











    public function getSoldePage()
    {
        return view('solde');
    }
}
