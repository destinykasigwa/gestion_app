<?php

namespace App\Http\Controllers;

use App\Models\AdhesionMembre;
use App\Models\Echeancier;
use App\Models\Portefeuille;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RapportCreditController extends Controller
{
    public function __construct()
    {
        $this->middleware("auth");
    }

    //RECUPERE LES INFORMATION DU RAPPORT DE CREDIT
    public function getRapportCredit()
    {
        //VERIFIE SI C UN UTILISATEUR OU BIEN SI C UN MEMBRE QUI CONSULTE LE RAPPRT
        if (Auth::user()->Role == 0) {
            $getNumAbrege = AdhesionMembre::where("UserID", "=", Auth::user()->id)->first();
            $data = Portefeuille::where("numAdherant", "=", $getNumAbrege->compteAbrege)
                ->orderBy('id', 'desc')->limit(25)->get();
            return response(["success" => 1, "data" => $data]);
        } else {
            $data = Portefeuille::query()->orderBy('id', 'desc')->limit(25)->get();
            return response(["success" => 1, "data" => $data]);
        }
    }

    //RECUPERE L'ECHEANCIER 

    public function getEcheancier(Request  $request)
    {
        //SI L'UTILISATEUR TANTE D'AFFICHER L'ECHEANCIER SANS FOUNIR UN NUMERO A RECHERCHER
        if (isset($request->NumCompteEpargne) or isset($request->NumCompteCredit)  or isset($request->NumDossier)) {

            //CHECK IF NUM DOSSIER EXIST IN DB
            $checkNumDossier = Echeancier::where("NumDossier", "=", $request->NumDossier)->first();
            if ($checkNumDossier) {
                $data = Portefeuille::where("portefeuilles.NumDossier", "=", $request->NumDossier)
                    // ->where("echeanciers.CapAmmorti", ">", 0)
                    ->orWhere("portefeuilles.NumCompteEpargne", "=", $request->NumCompteEpargne)
                    ->orWhere("portefeuilles.NumCompteCredit", "=", $request->NumCompteCredit)
                    ->join('echeanciers', 'echeanciers.NumDossier', '=', 'portefeuilles.NumDossier')
                    ->join('comptes', 'comptes.NumCompte', '=', 'portefeuilles.NumCompteEpargne')
                    // ->select('echeanciers.*')
                    ->get();

                //RECUPERE LA SOMME DES INTERET A PAYER
                $dataSommeInter = Echeancier::select(
                    DB::raw("SUM(echeanciers.Interet) as sommeInteret"),
                )->where("echeanciers.NumDossier", "=", $request->NumDossier)
                    ->orWhere("portefeuilles.NumCompteEpargne", "=", $request->NumCompteEpargne)
                    ->orWhere("portefeuilles.NumCompteCredit", "=", $request->NumCompteCredit)
                    ->join('portefeuilles', 'portefeuilles.NumDossier', '=', 'echeanciers.NumDossier')
                    ->first();

                return response()->json(["success" => 1, "data" => $data, "msg" => "Resultat trouvé", "sommeInteret" => $dataSommeInter]);
            } else {
                return response()->json(["success" => 0, "msg" => "Aucun écheancier n'est associé au numéro de dossier renseigné rassurez vous que vous avez entré un bon numéro de dossier ou que vous avez généré son écheancier merci."]);
            }
        } else {
            return response()->json(["success" => 0, "msg" => "Veuillez renseigner un numero de dossier, un compte epargne ou un numéro de compte crédit"]);
        }
    }
    //RECUPERE LE TABLEAU D'AMMORTISSEMENT

    public function getTableauAmmortissement(Request $request)
    {
        if (isset($request->NumCompteEpargne) or isset($request->NumCompteCredit)  or isset($request->NumDossier)) {
            $checkNumDossier = Echeancier::where("NumDossier", "=", $request->NumDossier)->first();
            if ($checkNumDossier) {
                $data = Portefeuille::where("portefeuilles.NumDossier", "=", $request->NumDossier)
                    ->where("echeanciers.CapAmmorti", ">", 0)
                    ->orWhere("portefeuilles.NumCompteEpargne", "=", $request->NumCompteEpargne)
                    ->orWhere("portefeuilles.NumCompteCredit", "=", $request->NumCompteCredit)
                    ->leftJoin('echeanciers', 'echeanciers.NumDossier', '=', 'portefeuilles.NumDossier')
                    ->leftJoin('remboursementcredits', 'remboursementcredits.RefEcheance', '=', 'echeanciers.ReferenceEch')
                    //   ->select('echeanciers.*')
                    ->get();

                //RECUPERE LA SOMME DES INTERET A PAYER
                $dataSommeInter = Echeancier::select(
                    DB::raw("SUM(echeanciers.Interet) as sommeInteret"),
                )->where("echeanciers.NumDossier", "=", $request->NumDossier)
                    ->orWhere("portefeuilles.NumCompteEpargne", "=", $request->NumCompteEpargne)
                    ->orWhere("portefeuilles.NumCompteCredit", "=", $request->NumCompteCredit)
                    ->join('portefeuilles', 'portefeuilles.NumDossier', '=', 'echeanciers.NumDossier')
                    ->first();

                return response()->json(["success" => 1, "data" => $data, "msg" => "Resultat trouvé", "sommeInteret" => $dataSommeInter]);
            } else {
                return response()->json(["success" => 0, "msg" => "Aucun écheancier n'est associé au numéro de dossier renseigné rassurez vous que vous avez entré un bon numéro de dossier ou que vous avez généré son écheancier merci."]);
            }
        } else {
            return response()->json(["success" => 0, "msg" => "Veuillez renseigner un numero de dossier, un compte epargne ou un numéro de compte crédit"]);
        }
    }

    public function getTableauBalanceAgee(Request $request)
    {
        if (isset($request->Monnaie)) {
            if ($request->Monnaie == "CDF") {
                $dataBalanceAgee = Portefeuille::where("portefeuilles.CodeMonnaie", "=", $request->Monnaie)
                    ->join("comptes", "portefeuilles.NumCompteEpargne", "=", "comptes.NumCompte")
                    ->orderBy("portefeuilles.NumDossier")->get();

                //RECUPERE L'ENCOURS GLOBAL DE CREDIT
                $comptePretAuMembreCDF = "3210000000202";
                $getSoldeEncoursCreditCDF = DB::select('SELECT SUM(transactions.Debitfc)-SUM(transactions.Creditfc) As SoldeEncoursCDF FROM  transactions
                 WHERE transactions.CodeMonnaie=2 AND transactions.NumCompte="' . $comptePretAuMembreCDF . '"')[0];

                // RECUPERE LA SOMME DE CAPITAL EN RETARD
                $compteRetardCDF = "390000000202";
                $getSoldeCapRetardCDF = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debit)  As TotRetard FROM  transactions
                WHERE transactions.CodeMonnaie=2 AND transactions.NumCompte="' . $compteRetardCDF . '"')[0];
                $PAR = ($getSoldeCapRetardCDF->TotRetard) / ($getSoldeEncoursCreditCDF->SoldeEncoursCDF + $getSoldeCapRetardCDF->TotRetard) * 100;


                return response()->json(["success" => 1, "data" => $dataBalanceAgee, "soldeEncourCDF" => $getSoldeEncoursCreditCDF, "totRetardCDF" => $PAR]);
            } else if ($request->Monnaie == "USD") {
                $dataBalanceAgee = Portefeuille::where("portefeuilles.CodeMonnaie", "=", $request->Monnaie)
                    ->join("comptes", "portefeuilles.NumCompteEpargne", "=", "comptes.NumCompte")
                    ->orderBy("portefeuilles.NumDossier")->get();

                //RECUPERE L'ENCOURS GLOBAL DE CREDIT
                $comptePretAuMembreUSD = "3210000000201";
                $getSoldeEncoursCreditUSD = DB::select('SELECT SUM(transactions.Debit$)-SUM(transactions.Credit$) As SoldeEncoursUSD FROM  transactions
                 WHERE transactions.CodeMonnaie=1 AND transactions.NumCompte="' . $comptePretAuMembreUSD . '"')[0];


                // RECUPERE LA SOMME DE CAPITAL EN RETARD USD
                $compteRetardUSD = "390000000201";
                $getSoldeCapRetardUSD = DB::select('SELECT SUM(transactions.Credit$)-SUM(transactions.Debit$)  As TotRetard FROM  transactions
               WHERE transactions.CodeMonnaie=1 AND transactions.NumCompte="' . $compteRetardUSD . '"')[0];
                $PAR = ($getSoldeCapRetardUSD->TotRetard) / ($getSoldeEncoursCreditUSD->SoldeEncoursUSD + $getSoldeCapRetardUSD->TotRetard) * 100;

                return response()->json(["success" => 1, "data" => $dataBalanceAgee, "soldeEncourUSD" => $getSoldeEncoursCreditUSD, "totRetardUSD" => $PAR]);
            }
        } else {

            return response()->json(["success" => 0, "msg" => "Veuillez renseigner la devise avant de continuer"]);
        }
    }


    //PERMET DE RECUPERER LE REMBOURSEMENT ATTENDU

    public function getRemboursAttendu(Request $request)
    {

        // $nombreSemaine = 1;
        $date1 = $request->dateToSearch1;
        $date2 = $request->dateToSearch2;
        if (isset($date1) and isset($date2)) {
            $data = DB::select('SELECT * FROM echeanciers LEFT JOIN portefeuilles ON echeanciers.NumDossier=portefeuilles.NumDossier WHERE echeanciers.DateTranch BETWEEN "' . $date1 . '" AND "' . $date2 . '" ORDER BY echeanciers.DateTranch');
            //RECUPERE LA SOMME
            if (count($data) != 0) {
                $dataSomme = DB::select('SELECT SUM(CapAmmorti) as sommeCapApayer,SUM(Interet) as sommeInteretApayer FROM echeanciers  WHERE echeanciers.DateTranch BETWEEN "' . $date1 . '" AND "' . $date2 . '"')[0];
                return response()->json(["success" => 1, "data" => $data, "dataSomme" => $dataSomme]);
            } else {
                return response()->json(["success" => 0, "msg" => "Pas des données trouvées"]);
            }
        } else {
            return response()->json(["success" => 0, "msg" => "Veuillez renseigner la date de début et la date de fin"]);
        }
    }

    public function getRemboursAttenduDefaultDate()
    {
        $nombreMois = 1;
        $NewDate1 = date('Y-m-d', strtotime("-" . $nombreMois . "week"));
        $NewDate2 = date("Y-m-d");
        return response(["defaultDate1" => $NewDate1, "defaultDate2" => $NewDate2]);
    }


    public function getRapportCreditPage()
    {
        return view('rapport-credit');
    }
}
