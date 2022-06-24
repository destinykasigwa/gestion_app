<?php

namespace App\Http\Controllers;

use App\Models\Agents;
use App\Models\Comptes;
use App\Models\Transactions;
use Illuminate\Http\Request;
use App\Models\PayementAgent;
use App\Models\TauxJournalier;
use App\Models\CompteurTransaction;
use Illuminate\Support\Facades\Auth;

class PayementAgentController extends Controller
{
    public function __construct()
    {
        $this->middleware("auth");
    }

    //GET AGENT
    public function getAgent()
    {
        $data = Agents::where("Actif", "=", 1)->get();
        return response()->json(["success" => 1, "data" => $data]);
    }

    //PERMET DE PAYER LES AGENS

    public function savePayementAgent(Request $request)

    {
        $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
        $tauxDuJour = TauxJournalier::orderBy('id', 'desc')->first()->TauxEnFc;

        $data = json_decode(file_get_contents("php://input"));
        for ($i = 0; $i < sizeof($data); $i++) {
            $response[] = $data[$i];
        }
        foreach ($response as $key) {
            if ($key->NumCompte != "" or $key->Montant > 0) {

                //VERIFIE LA DEVISE
                $Devise = Comptes::where("NumCompte", "=", $key->NumCompte)->first()->CodeMonnaie;
                if ($Devise == 2) {

                    CompteurTransaction::create([
                        'fakevalue' => "0000",
                    ]);
                    $numOperation = [];
                    $numOperation = CompteurTransaction::latest()->first();
                    $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;
                    PayementAgent::create([
                        "refOperation" => $NumTransaction,
                        "NumCompte" => $key->NumCompte,
                        "Montant" => $key->Montant,
                        "Devise" => "CDF",
                        "DatePay" => $date,
                        "AnneePay" => date("Y"),
                        // "MoisPay",
                    ]);
                    //CREDITE LE COMPTES DES MEMBRES
                    $compteChargePersonCDF = 6500000000202;
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
                        "NumCompte" =>  $key->NumCompte,
                        "NumComptecp" => $compteChargePersonCDF,
                        "Credit"  => $key->Montant,
                        "Credit$"  => $key->Montant / $tauxDuJour,
                        "Creditfc" => $key->Montant,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "PAIEMENT DE VOTRE SALAIRE BENEVOLE",
                    ]);
                    //ON DEBITE LE COMPTE DE CHARGE DU PESONNEL

                    //DEBITE  LE COMPTES DES CHARGE DU PERSONNEL
                    $compteChargePersonCDF = 6500000000202;
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "Taux" => 1,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteChargePersonCDF,
                        "NumComptecp" => $key->NumCompte,
                        "Debit"  => $key->Montant,
                        "Debit$"  => $key->Montant / $tauxDuJour,
                        "Debitfc" => $key->Montant,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "PAIEMENT DE VOTRE SALAIRE BENEVOLE",
                    ]);
                } else if ($Devise == 1) {
                    CompteurTransaction::create([
                        'fakevalue' => "0000",
                    ]);
                    $numOperation = [];
                    $numOperation = CompteurTransaction::latest()->first();
                    $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;
                    PayementAgent::create([
                        "refOperation" => $NumTransaction,
                        "NumCompte" => $key->NumCompte,
                        "Montant" => $key->Montant,
                        "Devise" => "USD",
                        "DatePay" => $date,
                        "AnneePay" => date("Y"),
                        // "MoisPay",
                    ]);
                    //CREDITE LE COMPTES DES MEMBRES
                    $compteChargePersonCDF = 6500000000201;
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
                        "NumCompte" =>  $key->NumCompte,
                        "NumComptecp" => $compteChargePersonCDF,
                        "Credit"  => $key->Montant,
                        "Credit$"  => $key->Montant,
                        "Creditfc" => $key->Montant * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "PAIEMENT DE VOTRE SALAIRE BENEVOLE",
                    ]);
                    //ON DEBITE LE COMPTE DE CHARGE DU PESONNEL

                    //DEBITE LE COMPTES DES CHARGE DU PERSONNEL
                    $compteChargePersonCDF = 6500000000201;
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "Taux" => 1,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteChargePersonCDF,
                        "NumComptecp" => $key->NumCompte,
                        "Debit"  => $key->Montant,
                        "Debit$"  => $key->Montant,
                        "Debitfc" => $key->Montant * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "PAIEMENT DE VOTRE SALAIRE BENEVOLE",
                    ]);
                }
            } else {
                return response()->json(["success" => 0, "msg" => "veuillez renseigner le montant ou le numéro de compte"]);
            }
        }

        return response()->json(["success" =>   1, "msg" =>  "Payement bien effectué"]);
    }

    public function updateDatePayementAgent(Request $request)
    {
        if (isset($request->MoisAPayer)) {
            $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
            $data = PayementAgent::where("DatePay", "=", $date)->first();
            if ($data) {
                PayementAgent::where("DatePay", "=", $date)->update([
                    "MoisPay" => $request->MoisAPayer,
                ]);
                return response()->json(["success" =>   1, "msg" =>  "Mise à jour réussi."]);
            } else {
                return response()->json(["success" =>   0, "msg" =>  "Oooops une erreur est survenue veuillez contacter votre administrateur système."]);
            }
        } else {
            return response()->json(["success" =>   0, "msg" =>  "Aucun mois sélectionné"]);
        }
    }

    public function getPayementAgentPage()
    {
        return view('payement-agent');
    }
}
