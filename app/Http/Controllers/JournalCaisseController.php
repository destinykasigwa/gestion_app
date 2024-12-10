<?php

namespace App\Http\Controllers;

use App\Models\Transactions;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class JournalCaisseController extends Controller
{
    public function __construct()
    {
        $this->middleware("auth");
    }
    public function getJournal(Request $request)
    {

        //POUR LE CDF
        $dateDebut = $request->dateToSearch1;
        $dateFin = $request->dateToSearch2;
        if (isset($request->userName) and isset($dateDebut) and isset($dateFin)) {
            $codeAgence = $request->AgenceName == "GOMA" ? 20 : null;
            $data = Transactions::where("transactions.NomUtilisateur", "=", $request->userName)
                ->where("transactions.CodeAgence", "=", $codeAgence)
                ->where("comptes.CodeMonnaie", "=", 2)
                // ->where("comptes.RefSousGroupe", "!=", 7120)
                ->where("comptes.RefSousGroupe", "!=", 3210)
                // ->where("comptes.RefTypeCompte", "=", 5)
                // ->orWhere("comptes.RefTypeCompte", "=", 7)
                ->whereBetween('transactions.DateTransaction', [$dateDebut, $dateFin])
                ->join("comptes", 'transactions.NumCompte', '=', 'comptes.NumCompte')
                // ->orderBy("transactions.NumTransaction")
                ->get([
                    'transactions.Creditfc as CreditFC',
                    'transactions.Debitfc as debitFC',
                    'transactions.NumTransaction as NumTrans',
                    'comptes.NomCompte as NomCompt',
                    'transactions.NumCompte as NumCompt',
                    'transactions.Operant as Initiateur',
                    'transactions.DateTransaction as DateTransactio',
                    'transactions.Libelle as Description',
                ]);


            //RECUPERE LE SOMME DE DEPOT ET DE RETRAIT
            //RECUPERE LE TOTAUX CDF
            $dataTotCDF = Transactions::select(
                DB::raw("SUM(transactions.Creditfc) as  totCredit"),
                DB::raw("SUM(transactions.Debitfc) as totDebit"),
            )->where("transactions.NomUtilisateur", '=', $request->userName)
                ->where("transactions.CodeAgence", "=", $codeAgence)
                ->where("comptes.CodeMonnaie", "=", 2)
                ->where("comptes.RefSousGroupe", "!=", 3210)
                // ->where("comptes.RefSousGroupe", "!=", 7120)
                // ->orWhere("comptes.RefTypeCompte", "=", 7)
                // ->orWhere("comptes.RefTypeCompte", "=", 3)
                ->whereBetween('transactions.DateTransaction', [$dateDebut, $dateFin])
                ->join("comptes", 'transactions.NumCompte', '=', 'comptes.NumCompte')
                ->groupBy("transactions.NomUtilisateur")
                ->first();




            //POUR LE USD
            $dateDebut = $request->dateToSearch1;
            $dateFin = $request->dateToSearch2;
            $codeAgence = $request->AgenceName == "GOMA" ? 20 : null;
            $dataUSD = Transactions::where("transactions.NomUtilisateur", "=", $request->userName)
                ->where("transactions.CodeAgence", "=", $codeAgence)
                ->where("comptes.CodeMonnaie", "=", 1)
                // ->where("comptes.RefSousGroupe", "!=", 7120)
                ->where("comptes.RefSousGroupe", "!=", 3210)
                // ->where("comptes.RefTypeCompte", "=", 5)
                // ->orWhere("comptes.RefTypeCompte", "=", 7)
                ->whereBetween('transactions.DateTransaction', [$dateDebut, $dateFin])
                ->join("comptes", 'transactions.NumCompte', '=', 'comptes.NumCompte')
                // ->orderBy("transactions.NumTransaction")
                ->get([
                    'transactions.Credit$ as CreditUSD',
                    'transactions.Debit$ as debitUSD',
                    'transactions.NumTransaction as NumTrans',
                    'comptes.NomCompte as NomCompt',
                    'transactions.NumCompte as NumCompt',
                    'transactions.Operant as Initiateur',
                    'transactions.DateTransaction as 	DateTransactio',
                    'transactions.Libelle as Description',
                ]);


            //RECUPERE LE SOMME DE DEPOT ET DE RETRAIT
            //RECUPERE LE TOTAUX USD
            $dataTotUSD = Transactions::select(
                DB::raw("SUM(transactions.Credit$) as  totCreditUSD"),
                DB::raw("SUM(transactions.Debit$) as totDebitUSD"),
            )->where("transactions.NomUtilisateur", '=', $request->userName)
                ->where("transactions.CodeAgence", "=", $codeAgence)
                ->where("comptes.CodeMonnaie", "=", 1)
                ->where("comptes.RefSousGroupe", "!=", 3210)
                // ->where("comptes.RefSousGroupe", "!=", 7120)
                // ->where("comptes.RefTypeCompte", "=", 5)
                // ->orWhere("comptes.RefTypeCompte", "=", 7)
                // ->orWhere("comptes.RefTypeCompte", "=", 3)
                ->whereBetween('transactions.DateTransaction', [$dateDebut, $dateFin])
                ->join("comptes", 'transactions.NumCompte', '=', 'comptes.NumCompte')
                ->groupBy("transactions.NomUtilisateur")
                ->first();



            return response()->json(["success" => 1, "data" => $data, "totCDF" => $dataTotCDF, "dataUSD" => $dataUSD, "totUSD" => $dataTotUSD]);
        } else {
            return response()->json(["success" => 0, "msg" => "Ooooops something went wrong."]);
        }
    }

    //PERMET D'OBTENIR LES UTILISATEURS


    public function getUsers()
    {
        $data = User::All();

        return response()->json(["success" => 1, "data" => $data]);
    }




    public function getJournaCaissePage()
    {
        return view("journal");
    }
}
