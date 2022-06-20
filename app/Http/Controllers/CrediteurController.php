<?php

namespace App\Http\Controllers;

use App\Models\Comptes;
use App\Models\Transactions;
use Illuminate\Http\Request;
use App\Models\TauxJournalier;
use Illuminate\Support\Facades\DB;
use App\Models\CompteurTransaction;
use Illuminate\Support\Facades\Auth;

class CrediteurController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }


    //RECUPERE UN NUMERO DE COMPTE RECHERCHE
    public function getAccount($compte)
    {
        $data = Comptes::where("NumCompte", "=", $compte)->first();
        if ($data) {
            if ($data->CodeMonnaie == 2) {
                //RECUPERE LE SOLDE DU MEMBRE EN FC EN CDF
                $soldeCDF = Transactions::select(
                    // DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
                    DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeCDF"),
                )->where("NumCompte", '=', $data->NumCompte)
                    ->groupBy("NumCompte")
                    ->first();
                return response()->json(["success" => 1, "data" => $data, "solde" => $soldeCDF->soldeCDF]);
            } else if ($data->CodeMonnaie == 1) {
                //RECUPERE LE SOLDE DU MEMBRE EN USD
                $soldeUSD = Transactions::select(
                    // DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
                    DB::raw("SUM(Credit$)-SUM(Debit$) as soldeUSD"),
                )->where("NumCompte", '=', $data->NumCompte)
                    ->groupBy("NumCompte")
                    ->first();

                return response()->json(["success" => 1, "data" => $data, "solde" => $soldeUSD->soldeUSD]);
            }
        } else {

            return response()->json(["success" => 0, "msg" => "Ce compte ne semble pas existé."]);
        }
    }
    //PERMET DE SAUVEGARDER UN CREDIT SUR COMPTE
    public function saveDataCredit(Request  $request)
    {
        $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;

        //RECUPERE LE TAUX JOURNALIER
        $tauxDuJour = TauxJournalier::orderBy('id', 'desc')->first()->TauxEnFc;
        if (isset($request->NumCompte) and isset($request->montantCredit)) {
            CompteurTransaction::create([
                'fakevalue' => "0000",
            ]);
            $numOperation = [];
            $numOperation = CompteurTransaction::latest()->first();
            $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;
            if ($request->CodeMonnaie == 2) {
                //CREDITE LE COMPTE
                Transactions::create([
                    "NumTransaction" => $NumTransaction,
                    "DateTransaction" => $date,
                    "DateSaisie" => $date,
                    "Taux" => 1,
                    "TypeTransaction" => "C",
                    "CodeMonnaie" => 2,
                    "CodeAgence" => "20",
                    "NumDossier" => "DOS00" . $numOperation->id,
                    "NumDemande" => "V00" . $numOperation->id,
                    "NumCompte" => $request->NumCompte,
                    "NumComptecp" => "00" . $numOperation->id,
                    "Operant" => $request->Operant,
                    "Credit"  => $request->montantCredit,
                    "Credit$"  => $request->montantCredit / $tauxDuJour,
                    "Creditfc" => $request->montantCredit,
                    "NomUtilisateur" => Auth::user()->name,
                    "Libelle" => $request->Libelle,
                ]);
                return response()->json(["success" => 1, "msg" => "Opération bien enregistrée merci."]);
            } else if ($request->CodeMonnaie == 1) {
                //CREDITE LE COMPTE
                Transactions::create([
                    "NumTransaction" => $NumTransaction,
                    "DateTransaction" => $date,
                    "DateSaisie" => $date,
                    "Taux" => 1,
                    "TypeTransaction" => "C",
                    "CodeMonnaie" => 1,
                    "CodeAgence" => "20",
                    "NumDossier" => "DOS00" . $numOperation->id,
                    "NumDemande" => "V00" . $numOperation->id,
                    "NumCompte" => $request->NumCompte,
                    "NumComptecp" => "00" . $numOperation->id,
                    "Operant" => $request->Operant,
                    "Credit"  => $request->montantCredit,
                    "Credit$"  => $request->montantCredit,
                    "Creditfc" => $request->montantCredit * $tauxDuJour,
                    "NomUtilisateur" => Auth::user()->name,
                    "Libelle" => $request->Libelle,
                ]);
                return response()->json(["success" => 1, "msg" => "Opération bien enregistrée merci."]);
            }
        } else {
            return response()->json(["success" => 0, "msg" => "Veuillez renseigner le numéro de compte ou le montant."]);
        }
    }




    public function getCrediteurPage()
    {
        return view("crediteur");
    }
}
