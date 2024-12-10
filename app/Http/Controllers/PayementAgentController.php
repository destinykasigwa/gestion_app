<?php

namespace App\Http\Controllers;

use App\Mail\TestMail;
use App\Models\Agents;
use App\Models\Comptes;
use App\Models\SMSBanking;
use App\Models\Transactions;
use Illuminate\Http\Request;
use App\Models\PayementAgent;
use App\Models\TauxJournalier;
use Illuminate\Support\Facades\DB;
use App\Models\CompteurTransaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

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
            if (isset($key->NumCompte)  and isset($key->Montant)) {

                $checkMoisExist = PayementAgent::where("DatePay", "=", $date)->where("NumCompte", "=", $key->NumCompte)->first();
                if ($checkMoisExist) {
                    return response()->json(["success" => 0, "msg" => "Tentative de faire un payement en doublons veuillez verifier qu'un payement correspondant à la même date n'a pas été éffectué."]);
                }
                //VERIFIE LA DEVISE
                $Devise = Comptes::where("NumCompte", "=", $key->NumCompte)->first();
                $nomAgent = Comptes::where("NumCompte", "=", $key->NumCompte)->first()->NomCompte;
                if ($Devise->CodeMonnaie == 2) {

                    CompteurTransaction::create([
                        'fakevalue' => "0000",
                    ]);
                    $numOperation = [];
                    $numOperation = CompteurTransaction::latest()->first();
                    $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;
                    PayementAgent::create([
                        "refOperation" => $NumTransaction,
                        "NumCompte" => $key->NumCompte,
                        "NomAgent" => $nomAgent,
                        "Montant" => $key->Montant,
                        "Devise" => "CDF",
                        "DatePay" => $date,
                        "AnneePay" => date("Y"),
                        // "MoisPay",
                    ]);
                    //CREDITE LE COMPTES DES MEMBRES
                    $compteChargePersonCDF = "6500000000202";
                    $compCotisation = "3300001575202";

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

                    //DEBITE LE COMPTE DES AGENS DU MONTANT DE COTISATION

                    // Transactions::create([
                    //     "NumTransaction" => $NumTransaction,
                    //     "DateTransaction" => $date,
                    //     "DateSaisie" => $date,
                    //     "Taux" => 1,
                    //     "TypeTransaction" => "D",
                    //     "CodeMonnaie" => 2,
                    //     "CodeAgence" => "20",
                    //     "NumDossier" => "DOS00" . $numOperation->id,
                    //     "NumDemande" => "V00" . $numOperation->id,
                    //     "NumCompte" =>  $key->NumCompte,
                    //     "NumComptecp" => $compCotisation,
                    //     "Debit"  => ($key->Montant * 5) / 100,
                    //     "Debit$"  => (($key->Montant * 5) / 100) / $tauxDuJour,
                    //     "Debitfc" => ($key->Montant * 5) / 100,
                    //     "NomUtilisateur" => Auth::user()->name,
                    //     "Libelle" => "PRISE DE LA COTISATION SUR VOTRE SALAIRE BENEVOLE",
                    // ]);


                    // //CREDITE LE COMPTE COTISATION

                    // Transactions::create([
                    //     "NumTransaction" => $NumTransaction,
                    //     "DateTransaction" => $date,
                    //     "DateSaisie" => $date,
                    //     "Taux" => 1,
                    //     "TypeTransaction" => "C",
                    //     "CodeMonnaie" => 2,
                    //     "CodeAgence" => "20",
                    //     "NumDossier" => "DOS00" . $numOperation->id,
                    //     "NumDemande" => "V00" . $numOperation->id,
                    //     "NumCompte" => $compCotisation,
                    //     "NumComptecp" => $key->NumCompte,
                    //     "Credit"  => ($key->Montant * 5) / 100,
                    //     "Credit$"  => (($key->Montant * 5) / 100) / $tauxDuJour,
                    //     "Creditfc" => ($key->Montant * 5) / 100,
                    //     "NomUtilisateur" => Auth::user()->name,
                    //     "Libelle" => "PRISE DE LA COTISATION SUR LE COMPTE " . $key->NumCompte,
                    // ]);



                    //DEBITE  LE COMPTES DES CHARGE DU PERSONNEL
                    $compteChargePersonCDF = "6500000000202";
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

                    //CREDITE LE COMPTE PERSONNEL CDF
                    $comptePersonnelCDF = "42000000202";
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
                        "NumCompte" => $comptePersonnelCDF,
                        "NumComptecp" => $compteChargePersonCDF,
                        "Credit"  => $key->Montant,
                        "Credit$"  => $key->Montant / $tauxDuJour,
                        "Creditfc" => $key->Montant,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "PAIEMENT DE VOTRE SALAIRE BENEVOLE",
                    ]);
                } else if ($Devise->CodeMonnaie == 1) {
                    CompteurTransaction::create([
                        'fakevalue' => "0000",
                    ]);
                    $numOperation = [];
                    $numOperation = CompteurTransaction::latest()->first();
                    $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;
                    PayementAgent::create([
                        "refOperation" => $NumTransaction,
                        "NumCompte" => $key->NumCompte,
                        "NomAgent" => $nomAgent,
                        "Montant" => $key->Montant,
                        "Devise" => "USD",
                        "DatePay" => $date,
                        "AnneePay" => date("Y"),
                        // "MoisPay",
                    ]);
                    //CREDITE LE COMPTES DES MEMBRES
                    $compteChargePersonCDF = "6500000000201";
                    $compCotisation = "3300001575201";
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


                    // //DEBITE LE COMPTE DES AGENS DU MONTANT DE COTISATION

                    // Transactions::create([
                    //     "NumTransaction" => $NumTransaction,
                    //     "DateTransaction" => $date,
                    //     "DateSaisie" => $date,
                    //     "Taux" => 1,
                    //     "TypeTransaction" => "D",
                    //     "CodeMonnaie" => 1,
                    //     "CodeAgence" => "20",
                    //     "NumDossier" => "DOS00" . $numOperation->id,
                    //     "NumDemande" => "V00" . $numOperation->id,
                    //     "NumCompte" =>  $key->NumCompte,
                    //     "NumComptecp" => $compCotisation,
                    //     "Debit"  => ($key->Montant * 5) / 100,
                    //     "Debit$"  => ($key->Montant * 5) / 100,
                    //     "Debitfc" => (($key->Montant * 5) / 100) * $tauxDuJour,
                    //     "NomUtilisateur" => Auth::user()->name,
                    //     "Libelle" => "PRISE DE LA COTISATION SUR VOTRE SALAIRE BENEVOLE",
                    // ]);


                    // //CREDITE LE COMPTE COTISATION

                    // Transactions::create([
                    //     "NumTransaction" => $NumTransaction,
                    //     "DateTransaction" => $date,
                    //     "DateSaisie" => $date,
                    //     "Taux" => 1,
                    //     "TypeTransaction" => "C",
                    //     "CodeMonnaie" => 1,
                    //     "CodeAgence" => "20",
                    //     "NumDossier" => "DOS00" . $numOperation->id,
                    //     "NumDemande" => "V00" . $numOperation->id,
                    //     "NumCompte" => $compCotisation,
                    //     "NumComptecp" => $key->NumCompte,
                    //     "Credit"  => ($key->Montant * 5) / 100,
                    //     "Credit$"  => ($key->Montant * 5) / 100,
                    //     "Creditfc" => (($key->Montant * 5) / 100) * $tauxDuJour,
                    //     "NomUtilisateur" => Auth::user()->name,
                    //     "Libelle" => "PRISE DE LA COTISATION SUR LE COMPTE " . $key->NumCompte,
                    // ]);




                    //ON DEBITE LE COMPTE DE CHARGE DU PESONNEL

                    //DEBITE LE COMPTES DES CHARGE DU PERSONNEL
                    $compteChargePersonCDF = "6500000000201";
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

                    //CREDITE LE COMPTE PERSONNEL USD
                    $comptePersonnelUSD = "42000000201";
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
                        "NumCompte" => $comptePersonnelUSD,
                        "NumComptecp" => $compteChargePersonCDF,
                        "Credit"  => $key->Montant,
                        "Credit$"  => $key->Montant,
                        "Creditfc" => $key->Montant * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "PAIEMENT DE VOTRE SALAIRE BENEVOLE",
                    ]);
                }
            } else {
                return response()->json(["success" => 0, "msg" => "veuillez renseigner le montant ou le numéro de compte"]);
            }

            //SEND EMAIL


            //RECUPERE LES INFORMATIONS DE LA PERSONNE QUI VENAIT D'EFFECTUER UN MOUVEMENT
            $getMembreInfo = SMSBanking::where("NumAbrege", "=", $Devise->NumAdherant)->first();
            $user = Auth::user();
            if ($getMembreInfo) {

                if ($getMembreInfo->Email != null and $getMembreInfo->ActivatedEmail == 1) {


                    if ($Devise->CodeMonnaie == 2) {
                        $getMembreInfo2 = Comptes::where("NumAdherant", "=", $Devise->NumAdherant)->where("CodeMonnaie", "=", 2)->first();
                        //RECUPERE LE SOLDE DU MEMBRE EN FC 
                        $compteCDF = $getMembreInfo2->NumCompte;
                        $soldeMembreCDF = Transactions::select(
                            DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeMembreCDF"),
                        )->where("NumCompte", '=', $compteCDF)
                            ->groupBy("NumCompte")
                            ->first();

                        $monthnumber = date("m");
                        $data = $getMembreInfo2->sexe == "M" ? " Bonjour Monsieur " : ($getMembreInfo2->sexe == "F" ? " Bonjour Madame " : " Bonjour ") .
                            $getMembreInfo2->NomCompte . " Votre compte CDF " . $compteCDF . " est crédité de " . $key->Montant . " CDF  votre salaire BENEVOLE de IHD après la prise de cotisation pour le mois de " . date("F", mktime(0, 0, 0, $monthnumber, 1, date("Y"))) . " votre nouveau solde est de " . $soldeMembreCDF->soldeMembreCDF . " CDF Vous êtes priés à partager votre rapport pour en bénéficier.";
                        Mail::to($getMembreInfo->Email)->send(new TestMail($user, $data));
                        // return view('emails.test');
                    } else if ($Devise->CodeMonnaie == 1) {
                        $getMembreInfo2 = Comptes::where("NumAdherant", "=", $Devise->NumAdherant)->where("CodeMonnaie", "=", 1)->first();
                        $NumCompteUSD = $getMembreInfo2->NumCompte;
                        //RECUPERE LE SOLDE DU MEMBRE EN USD
                        $soldeMembreUSD = Transactions::select(
                            DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
                        )->where("NumCompte", '=', $NumCompteUSD)
                            ->groupBy("NumCompte")
                            ->first();
                        $monthnumber = date("m");
                        $data = $getMembreInfo2->sexe == "M" ? "Bonjour Monsieur" : ($getMembreInfo2->sexe == "F" ? " Bonjour Madame " : " Bonjour ") .
                            $getMembreInfo2->NomCompte . " Votre compte USD " . $NumCompteUSD . " est crédité de " . $key->Montant . " USD  votre salaire BENEVOLE de APEDH  après la prise de cotisation pour le mois de " . date("F", mktime(0, 0, 0, $monthnumber, 1, date("Y"))) . " votre nouveau solde est de " . $soldeMembreUSD->soldeMembreUSD . " USD Vous êtes priés à partager votre rapport pour en bénéficier.";
                        Mail::to($getMembreInfo->Email)->send(new TestMail($user, $data));
                        // return view('emails.test');
                    }
                }
            }
        }

        return response()->json(["success" => 1, "msg" => "Opération réussie!"]);
    }

    //PERMET DE RECUPERER LES PAIMENT CONCERNANT LES AGENT

    public function getAgentPayement(Request $request)
    {
        if (isset($request->MoisAAfficher) and isset($request->DeviseAAfficher) and isset($request->AnneeAAfficher)) {
            //CHECK IF DATA EXIST IN DB
            $checkDataExist = PayementAgent::where("Devise", "=", $request->DeviseAAfficher)->where("MoisPay", "=", $request->MoisAAfficher)->where("AnneePay", $request->AnneeAAfficher)->first();
            if ($checkDataExist) {
                $data =  PayementAgent::where("Devise", "=", $request->DeviseAAfficher)->where("MoisPay", "=", $request->MoisAAfficher)->where("AnneePay", $request->AnneeAAfficher)->get();
            } else {
                return response()->json(["success" =>   0, "msg" =>  "Aucune donnée trouvée"]);
            }


            return response()->json(["success" =>   1, "dataPayement" => $data]);
        } else {
            return response()->json(["success" =>   0, "msg" =>  "Veuillez renseigner la devise et le mois"]);
        }
    }

    //PERMET D'ENREGISTRER UN NOUVEAU AGENT
    public function addNewAgent(Request $request)
    {
        if (isset($request->NumCompteNewAgent) and isset($request->NomNewAgent)) {
            $checkIfRowExist = Comptes::where("NumCompte", "=", $request->NumCompteNewAgent)->first();
            if ($checkIfRowExist) {
                if ($checkIfRowExist->CodeMonnaie == 1) {
                    Agents::create([
                        "NumcompteUSD" => $request->NumCompteNewAgent,
                        "NomAgent" => $checkIfRowExist->NomCompte,
                        "Devise" => "USD"
                    ]);
                    return response()->json(["success" =>   1, "msg" =>  "Vous avez ajouté c'est membre comme agent avec un compte en USD"]);
                } else if ($checkIfRowExist->CodeMonnaie == 2) {
                    Agents::create([
                        "NumCompte" => $request->NumCompteNewAgent,
                        "NomAgent" => $checkIfRowExist->NomCompte,
                        "Devise" => "CDF"
                    ]);
                    return response()->json(["success" =>   1, "msg" =>  "Vous avez ajouté c'est membre comme agent avec un compte en CDF"]);
                }
            } else {
                return response()->json(["success" =>   0, "msg" =>  "Un membre associé à ce numéro de compte n'existe pas"]);
            }
        } else {
            return response()->json(["success" =>   0, "msg" =>  "Veuillez renseigner le numéro de compte et le nom"]);
        }
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
                //UPDATE TRANSACTIONS TABLE
                Transactions::where("Libelle", "=", "PAIEMENT DE VOTRE SALAIRE BENEVOLE")->update([
                    "Libelle" => "PAIEMENT DE VOTRE SALAIRE BENEVOLE MOIS DE " . $request->MoisAPayer,
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
