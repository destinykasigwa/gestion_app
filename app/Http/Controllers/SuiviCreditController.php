<?php

namespace App\Http\Controllers;

use App\Models\Comptes;
use App\Models\Garantie;
use App\Models\Echeancier;
use App\Models\Portefeuille;
use App\Models\Transactions;
use Illuminate\Http\Request;
use App\Models\TauxJournalier;
use Illuminate\Support\Facades\DB;
use App\Models\CompteurTransaction;
use Illuminate\Support\Facades\Auth;
use App\Models\CompteurDossierCredit;
use App\Models\LockedGarantie;
use Illuminate\Support\Facades\Validator;

class SuiviCreditController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }
    //RECUPERE LES INFORMATIONS RELATIVES A UN COMPTE RECHERCHE

    public function getInfoCompte(Request $request)
    {
        if ($request->CodeMonnaie == "CDF") {
            $getSomme = null;
            $data = Comptes::where("NumAdherant", "=", $request->compteToSearch)->where("CodeMonnaie", "=", 2)->first();
            if ($data) {

                $data2 = Portefeuille::where("NumCompteEpargne", "=", $data->NumCompte)
                    ->orderBy("id", "DESC")
                    ->first();
                //RECUPERE LA SOMME DES INTERETS 
                if ($data2) {
                    $getSommeInteret = DB::select('SELECT SUM(echeanciers.Interet) As soldeInteret FROM  echeanciers
                    JOIN portefeuilles ON echeanciers.NumDossier=portefeuilles.NumDossier WHERE portefeuilles.NumCompteEpargne="' . $data->NumCompte . '" and portefeuilles.Cloture=0 LIMIT 1')[0];
                    if ($getSommeInteret) {
                        $getSomme = $getSommeInteret;
                    } else {
                        $getSomme = null;
                    }
                }

                return response()->json(["success" => 1, "data" => $data, "data2" => $data2, "soldeInteret" => $getSomme]);
            } else {
                return response()->json(["success" => 0, "msg" => "Aucun numéro de compte trouvé"]);
            }
        } else if ($request->CodeMonnaie == "USD") {
            $data = Comptes::where("NumAdherant", "=", $request->compteToSearch)->where("CodeMonnaie", "=", 1)->first();
            if ($data) {
                $data2 = Portefeuille::where("NumCompteEpargne", "=", $data->NumCompte)->where("Cloture", 0)->first();

                return response()->json(["success" => 1, "data" => $data, "data2" => $data2]);
            } else {
                return response()->json(["success" => 0, "msg" => "Aucun numéro de compte trouvé"]);
            }
        } else {
            return response()->json(["success" => 0, "msg" => "Veuillez sélectionner la devise avant de continuer."]);
        }
    }

    //ENREGISTRE UN NOUVEL MONTAGE DE CREDIT

    public function saveNewMontageCredit(Request $request)
    {



        //VERIFIE SI LA PERSONNE A DEJA SOLDER  SON DERNIER CREDIT SINON LE SYSTEME DOIT REFUSER
        $checkIfSoldedCredit = Portefeuille::where("NumDossier", "=", $request->NumDossier)
            ->where("Cloture", "=", 0)->first();
        if ($checkIfSoldedCredit) {
            return response()->json(["success" => 0, "msg" => "Vous ne pouvez pas monter un crédit sur un compte avec un crédit non entierement remboursé."]);
        }
        if (Auth::user()->agentCredit != 1) {
            return response()->json(["success" => 0, "msg" => "Vous n'avez pas d'habilitation pour monter un crédit merci de contacter votre administrateur système."]);
        }
        // if (!isset($request->RefTypeCredit) and !isset($request->RefProduitCredit)) {
        //     return response()->json(["success" => 0, "msg" => "Veuillez saisir toutes les informations obligatoires."]);
        // }
        Portefeuille::create([
            "RefTypeCredit" =>  $request->RefTypeCredit,
            "RefProduitCredit" => $request->RefProduitCredit,
            "CodeAgence" => $request->CodeAgence,
            "CodeGuichet" => $request->CodeGuichet,
            "DateDemande" => $request->DateDemande,
            // "DateOctroi" => $request->DateOctroi,
            // "DateEcheance" => $request->DateEcheance,
            "DateTranche" => $request->DateTranche,
            "NbrTranche" => $request->NbrTranche,
            "NumCompteEpargne" => $request->NumCompteEpargne,
            "NumCompteCredit" => $request->NumCompteCredit,
            "NumCompteEpargneGarantie" => $request->NumCompteEpargneGarantie,
            "NomCompte" => $request->NomCompte,
            "Duree" => $request->Duree,
            "Dufferee" => $request->Dufferee,
            "Grace" => $request->Grace,
            "NumDossier" => $request->NumDossier,
            "NumDemande" => $request->NumDemande,
            "MontantDemande" => $request->MontantDemande,
            "ObjeFinance" => $request->ObjeFinance,
            // "MontantAccorde" => $request->MontantAccorde,
            // "Decision" => $request->Decision,
            // "Motivation" => $request->Motivation,
            "CodeMonnaie" => $request->CodeMonnaie,
            // "Interval" => $request->Interval,
            "ModeRemboursement" => $request->ModeRemboursement,
            "ModeCalcul" => $request->ModeCalcul,
            "TauxInteret" => $request->TauxInteret,
            "CompteInteret" => $request->CompteInteret,
            "TauxInteretRetard" => $request->TauxInteretRetard,
            "CompteInteretRetard" => $request->CompteInteretRetard,
            "InteretRetardIn" => $request->InteretRetardIn,
            "InteretCalcule" => $request->InteretCalcule,
            "TotCumule" => $request->TotCumule,
            "RemboursCapitalIn" => $request->RemboursCapitalIn,
            "RemboursInteretIn" => $request->RemboursInteretIn,
            "InteretSpotIn" => $request->InteretSpotIn,
            "RemboursEparneProgr" => $request->RemboursEparneProgr,
            "RemboursInteretRetarIn" => $request->RemboursInteretRetarIn,
            "RemboursCapital" => $request->RemboursCapital,
            "RemboursInteret" => $request->RemboursInteret,
            "RemboursEpargneProgr" => $request->RemboursEpargneProgr,
            "RemboursInteretRetard" => $request->RemboursInteretRetard,
            "CapitalRestant" => $request->CapitalRestant,
            "InteretRestant" => $request->InteretRestant,
            "CapitalEchu" => $request->CapitalEchu,
            "EpargneEchu" => $request->EpargneEchu,
            "InteretEchu" => $request->InteretEchu,
            "InteretRetardEchu" => $request->InteretRetardEchu,
            "CapitalDu" => $request->CapitalDu,
            "InteretDu" => $request->InteretDu,
            "EpargneDu" => $request->EpargneDu,
            "AvanceInteret" => $request->AvanceInteret,
            "NonEchu" => $request->NonEchu,
            "PourcentageProvision" => $request->PourcentageProvision,
            "JourRetard" => $request->JourRetard,
            "SourceFinancement" => $request->SourceFinancement,
            "Gestionnaire" => $request->Gestionnaire,
            "Octroye" => $request->Octroye,
            "numAdherant" => $request->numAdherant,
            "NumMensualite" => $request->NumMensualite,
            "FraisEtudeDossier" => $request->FraisEtudeDossier,
            "CompteEtudeDossier" => $request->CompteEtudeDossier,
            "FraisCommission" => $request->FraisCommission,
            "CompteCommission" => $request->CompteCommission,
            "Animateur" => $request->Animateur,
            "Accorde" => $request->Accorde,
            "AccordePar" => $request->AccordePar,
            "OctroyePar" => $request->OctroyePar,
            // "DateTombeEcheance" => $request->DateTombeEcheance,
            "NomUtilisateur" => $request->NomUtilisateur,
            "Cloture" => $request->Cloture,
            "CloturePar" => $request->CloturePar,
            "DateCloture" => $request->DateCloture,
            "Radie" => $request->Radie,
            "CapitalRadie" => $request->CapitalRadie,
            "InteretRadie" => $request->InteretRadie,
            "DateRadiation" => $request->DateRadiation,
            "NumCompteHB" => $request->NumCompteHB,
            "MontantRadie" => $request->MontantRadie,
            "Spot" => $request->Spot,
            "Anticipation" => $request->Anticipation,
            "Reechelonne" => $request->Reechelonne,
            "DateReechellonement" => $request->DateReechellonement,
            "MontantReechelonne" => $request->MontantReechelonne,
            "NbrTrancheReechellonne" => $request->NbrTrancheReechellonne,
            "DureeReechellone" => $request->DureeReechellone,
            'GroupeSolidaire' => $request->GroupeSolidaire,
            'Cyclable' => $request->Cyclable,
            'Cycle' => $request->Cycle,
            'RefMode' => $request->RefMode,
            'TrancheDecalage' => $request->TrancheDecalage,
            'PeriodiciteDecalage' => $request->PeriodiciteDecalage,
            'DureeDecalage' => $request->DureeDecalage,
            'DateDecale' => $request->DateDecale,
            'TypeGarantie' => $request->DescriptionGarantie,
            'InteretPrecompte' => 0,
        ]);

        Garantie::create([
            "NumDossier" => $request->NumDossier,
            "NumCompte" => $request->NumCompteEpargne,
            "DescriptionGarantie" => $request->DescriptionGarantie,
        ]);

        CompteurDossierCredit::create([
            "refDossier" => "ND0000",
        ]);

        return response()->json(["success" => 1, "msg" => "Le montage du crédit s'est passé avec succès."]);
    }





    //RECUPERE UN NOUVEL NUMERO DOSSIER POUR UN NOUVEAU CREDIT
    public function getNewDossierNumber()
    {
        $numDossier = CompteurDossierCredit::latest()->first()->id;
        return response()->json(["lastid" => $numDossier]);
    }


    //MET A JOUR UN CREDIT QUI A ETE MONTE

    public function upDateCredit(Request $request)
    {



        Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
            "RefTypeCredit" => $request->RefTypeCredit,
            "RefProduitCredit" => $request->RefProduitCredit,
            "MontantDemande" => $request->MontantDemande,
            "ObjeFinance" => $request->ObjeFinance,
            "Motivation" => $request->Motivation,
            "ModeRemboursement" => $request->ModeRemboursement,
            "TauxInteret" => $request->TauxInteret,
            "DateDemande" => $request->DateDemande,
            "NbrTranche" => $request->NbrTranche,
            "Cycle" => $request->Cycle,
            "Duree" => $request->Duree,
            "CodeMonnaie" => $request->CodeMonnaie,
            "Gestionnaire" => $request->Gestionnaire,
        ]);

        return response()->json(["success" => 1, "msg" => "Ce crédit a bien été mis à jour."]);
    }


    //ENREGISTRE L'ECHEANCIER
    public function saveEcheancier(Request $request)
    {
        $validator = validator::make($request->all(), [
            'MontantAccorde' => 'required',
            'ModeCalcul' => 'required',

        ]);

        if ($validator->fails()) {
            return response()->json([
                'validate_error' => $validator->errors()
            ]);
        } else {
            //MET  LE PORTE FEUILLE A JOUR
            Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
                "Decision" => $request->Decision,
                "Motivation" => $request->Motivation,
                "DateOctroi" => $request->DateOctroi,
                "DateEcheance" => $request->DateEcheance,
                "DateTombeEcheance" => $request->DateTombeEcheance,
                "Interval" => $request->Interval,
                "MontantAccorde" => $request->MontantAccorde,
                "InteretPrecompte" => $request->RefTypeCredit == "CREDIT TUINUKE" ? $request->MontantAccorde * $request->TauxInteret / 100 : null,
            ]);
            // ENEGISTRE L'ECHEANCIER
            if ($request->RefTypeCredit == "CREDIT TUINUKE") {
                Echeancier::create([
                    "NumDossier" => $request->NumDossier,
                    "NumMensualite"  => 0,
                    "NbreJour" => date('t'),
                    "Capital" => $request->MontantAccorde,
                    "Interet" => 0,
                    "Cumul"  => $request->MontantAccorde,
                    "DateTranch" => $request->DateOctroi,
                    // "SoldeCapital" => $request->MontantAccorde,
                    // "SoldeInteret" => 0,
                ]);

                //COMPLETE L'ECHEANCIER
                $capital = $request->MontantAccorde;
                $interet = 0;
                $capitalAmorti = $capital / $request->NbrTranche;
                $maxDays = date('t');
                $dates = array($request->DateTombeEcheance);

                $dateOctroie = $request->DateOctroi;
                for ($i = 1; $i < $maxDays; $i++) {
                    $NewDate = date('Y-m-d', strtotime("+" . $i . " days", strtotime("$dateOctroie")));
                    $dates[] = $NewDate;
                }
                if ($request->ModeCalcul == "Constant") {
                    foreach ($dates as $dt) {

                        $lastRowData  = Echeancier::orderBy('ReferenceEch', 'desc')->first();
                        Echeancier::create([
                            "NumDossier" => $request->NumDossier,
                            "NumMensualite" => 0,
                            "NbreJour" => $lastRowData->NbreJour + 1,
                            "Capital" =>  $lastRowData->Capital - $capitalAmorti,
                            "Interet" =>  $interet,
                            "CapAmmorti" => $capitalAmorti,
                            "TotalAp" => $capitalAmorti + $interet,
                            "Cumul"  => $lastRowData->Capital - $capitalAmorti,
                            // "SoldeCapital" => $lastRowData->Capital - $capitalAmorti,
                            "DateTranch" =>  $dt,
                            "DateDebut" => $request->DateTranche,
                            "InteretPrev" => $interet,
                            // "CumulCapital" => $lastRowData->Capital - $capitalAmorti,
                        ]);

                        $lastRowData  = Echeancier::orderBy('ReferenceEch', 'desc')->first();
                    }

                    return response()->json(["success" => 1, "msg" => "Géneration de l'écheancier bien effectuée"]);
                } else if ($request->ModeCalcul == "Degressif") {
                    foreach ($dates as $dt) {

                        $lastRowData  = Echeancier::orderBy('ReferenceEch', 'desc')->first();
                        Echeancier::create([
                            "NumDossier" => $request->NumDossier,
                            "NumMensualite" => 0,
                            "NbreJour" => $lastRowData->NbreJour + 1,
                            "Capital" =>  $lastRowData->Capital - $capitalAmorti,
                            "Interet" =>  $interet,
                            "CapAmmorti" => $capitalAmorti,
                            "TotalAp" => $capitalAmorti + $interet,
                            "Cumul"  => $lastRowData->Capital - $capitalAmorti,
                            // "SoldeCapital" => $lastRowData->Capital - $capitalAmorti,
                            "DateTranch" =>  $dt,
                            "DateDebut" => $request->DateTranche,
                            "InteretPrev" => $interet,
                            // "CumulCapital" => $lastRowData->Capital - $capitalAmorti,
                        ]);

                        $lastRowData  = Echeancier::orderBy('ReferenceEch', 'desc')->first();
                    }

                    return response()->json(["success" => 1, "msg" => "Géneration de l'écheancier bien effectuée"]);
                }
            } else if ($request->RefTypeCredit == "CREDIT INUKA") {
                Echeancier::create([
                    "NumDossier" => $request->NumDossier,
                    "NumMensualite"  => 0,
                    "NbreJour" => $request->NbrTranche,
                    "Capital" => $request->MontantAccorde,
                    "Interet" => 0,
                    "Cumul"  => $request->MontantAccorde,
                    "DateTranch" => $request->DateOctroi,
                    // "SoldeCapital" => $request->MontantAccorde,
                    // "SoldeInteret" => 0,
                ]);

                //COMPLETE L'ECHEANCIER
                // $capitalRestantDu = $capital - $capitalAmorti;
                // $dateRembours = date('Y-m-d', strtotime("+1 day"));
                //             $maxDays=date('t');
                // $currentDayOfMonth=date('j');

                // if($maxDays == $currentDayOfMonth){
                //   //Last day of month
                // }else{
                //   //Not last day of the month
                // }
                // $maxDays = date('t'); //RETURNS The number of days in the given month

                $dateOctroie = $request->DateOctroi;
                $dates = array($request->DateTombeEcheance);
                for ($i = 2; $i < $request->NbrTranche; $i++) {
                    $NewDate = date('Y-m-d', strtotime("+" . $i . "week", strtotime("$dateOctroie")));
                    $dates[] = $NewDate;
                }
                if ($request->ModeCalcul == "Constant") {
                    foreach ($dates as $dt) {
                        $capital = $request->MontantAccorde;
                        $interet = $request->TauxInteret;
                        $interetApayer = $request->MontantAccorde * $request->TauxInteret / 100;
                        $capitalAmorti = $capital / $request->NbrTranche;
                        $epargneObligatoire = ($capitalAmorti * 5) / 100;
                        $totalAp = $interetApayer + $capitalAmorti +  $epargneObligatoire;
                        $lastRowData  = Echeancier::orderBy('ReferenceEch', 'desc')->first();
                        Echeancier::create([
                            "NumDossier" => $request->NumDossier,
                            "NumMensualite" => 0,
                            "NbreJour" => $lastRowData->NbreJour + 1,
                            "Capital" =>  $lastRowData->Capital - $capitalAmorti,
                            "Interet" =>  $interetApayer,
                            "CapAmmorti" => $capitalAmorti,
                            "TotalAp" => $totalAp,
                            "Cumul"  => $lastRowData->Capital - $capitalAmorti,
                            // "SoldeCapital" => $lastRowData->Capital - $capitalAmorti,
                            "DateTranch" =>  $dt,
                            "DateDebut" => $request->DateTranche,
                            "InteretPrev" => $interetApayer,
                            "Epargne" => $epargneObligatoire
                            // "CumulCapital" => $lastRowData->Capital - $capitalAmorti,
                        ]);

                        $lastRowData  = Echeancier::orderBy('ReferenceEch', 'desc')->first();
                    }

                    return response()->json(["success" => 1, "msg" => "Géneration de l'écheancier bien effectuée"]);
                } else if ($request->ModeCalcul == "Degressif") {
                    foreach ($dates as $dt) {
                        $capital = $request->MontantAccorde;
                        $interet = $request->TauxInteret;

                        $capitalAmorti = $capital / $request->NbrTranche;
                        $epargneObligatoire = ($capitalAmorti * 5) / 100;

                        $lastRowData  = Echeancier::orderBy('ReferenceEch', 'desc')->first();
                        $interetApayer = $lastRowData->Capital * $request->TauxInteret / 100;
                        $totalAp = $interetApayer + $capitalAmorti +  $epargneObligatoire;

                        Echeancier::create([
                            "NumDossier" => $request->NumDossier,
                            "NumMensualite" => 0,
                            "NbreJour" => $lastRowData->NbreJour + 1,
                            "Capital" =>  $lastRowData->Capital - $capitalAmorti,
                            "Interet" =>  $interetApayer,
                            "CapAmmorti" => $capitalAmorti,
                            "TotalAp" => $totalAp,
                            "Cumul"  => $lastRowData->Capital - $capitalAmorti,
                            // "SoldeCapital" => $lastRowData->Capital - $capitalAmorti,
                            "DateTranch" =>  $dt,
                            "DateDebut" => $request->DateTranche,
                            "InteretPrev" => $interetApayer,
                            "Epargne" => $epargneObligatoire
                            // "CumulCapital" => $lastRowData->Capital - $capitalAmorti,
                        ]);

                        $lastRowData  = Echeancier::orderBy('ReferenceEch', 'desc')->first();
                    }

                    return response()->json(["success" => 1, "msg" => "Géneration de l'écheancier bien effectuée"]);
                }
            } else if ($request->RefTypeCredit == "C. A LA CONSOMMATION" or $request->RefTypeCredit == "C. PETIT COMMERCE") {

                Echeancier::create([
                    "NumDossier" => $request->NumDossier,
                    "NumMensualite"  => 0,
                    "NbreJour" => $request->NbrTranche,
                    "Capital" => $request->MontantAccorde,
                    "Interet" => 0,
                    "Cumul"  => $request->MontantAccorde,
                    "DateTranch" => $request->DateOctroi,
                ]);

                $dateOctroie = $request->DateOctroi;
                $dates = array($request->DateTombeEcheance);
                $NbrTranche = $request->NbrTranche + 1;
                for ($i = 2; $i < $NbrTranche; $i++) {
                    $NewDate = date('Y-m-d', strtotime("+" . $i . "month", strtotime("$dateOctroie")));
                    $dates[] = $NewDate;
                }
                if ($request->ModeCalcul == "Constant") {
                    foreach ($dates as $dt) {
                        $capital = $request->MontantAccorde;
                        $interet = $request->TauxInteret;
                        $interetApayer = $request->MontantAccorde * $request->TauxInteret / 100;
                        $capitalAmorti = $capital / $request->NbrTranche;
                        $totalAp = $interetApayer + $capitalAmorti;
                        $lastRowData  = Echeancier::orderBy('ReferenceEch', 'desc')->first();
                        Echeancier::create([
                            "NumDossier" => $request->NumDossier,
                            "NumMensualite" => 0,
                            "NbreJour" => $lastRowData->NbreJour + 1,
                            "Capital" =>  $lastRowData->Capital - $capitalAmorti,
                            "Interet" =>  $interetApayer,
                            "CapAmmorti" => $capitalAmorti,
                            "TotalAp" => $totalAp,
                            "Cumul"  => $lastRowData->Capital - $capitalAmorti,
                            // "SoldeCapital" => $lastRowData->Capital - $capitalAmorti,
                            "DateTranch" =>  $dt,
                            "DateDebut" => $request->DateTranche,
                            "InteretPrev" => $interetApayer,
                            // "CumulCapital" => $lastRowData->Capital - $capitalAmorti,
                        ]);

                        $lastRowData  = Echeancier::orderBy('ReferenceEch', 'desc')->first();
                    }
                    return response()->json(["success" => 1, "msg" => "Géneration de l'écheancier bien effectuée"]);
                } else if ($request->ModeCalcul == "Degressif") {
                    foreach ($dates as $dt) {
                        $capital = $request->MontantAccorde;
                        $interet = $request->TauxInteret;

                        $lastRowData  = Echeancier::orderBy('ReferenceEch', 'desc')->first();
                        $interetApayer = $lastRowData->Capital * $request->TauxInteret / 100;
                        $capitalAmorti = $capital / $request->NbrTranche;
                        $totalAp = $interetApayer + $capitalAmorti;
                        Echeancier::create([
                            "NumDossier" => $request->NumDossier,
                            "NumMensualite" => 0,
                            "NbreJour" => $lastRowData->NbreJour + 1,
                            "Capital" =>  $lastRowData->Capital - $capitalAmorti,
                            "Interet" =>  $interetApayer,
                            "CapAmmorti" => $capitalAmorti,
                            "TotalAp" => $totalAp,
                            "Cumul"  => $lastRowData->Capital - $capitalAmorti,
                            // "SoldeCapital" => $lastRowData->Capital - $capitalAmorti,
                            "DateTranch" =>  $dt,
                            "DateDebut" => $request->DateTranche,
                            "InteretPrev" => $interetApayer,
                            // "CumulCapital" => $lastRowData->Capital - $capitalAmorti,
                        ]);

                        $lastRowData  = Echeancier::orderBy('ReferenceEch', 'desc')->first();
                    }
                    return response()->json(["success" => 1, "msg" => "Géneration de l'écheancier bien effectuée"]);
                }
            }
        }
    }



    //MET A JOUR L'ECHEANCIER

    public     function upDateEcheancier(Request $request)
    {

        //SUPPRIME LA LIGNE CORRESPONDANT A CE NUMERO DE DOSSIER DANS ECHEANCIER
        Echeancier::where("NumDossier", "=", $request->NumDossier)->delete();
        if (!isset($request->ModeCalcul)) {
            return response()->json(["success" => 0, "msg" => "Vous devez renseigner le mode de calcul."]);
        }

        //MET  LE PORTE FEUILLE A JOUR

        Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
            "Decision" => $request->Decision,
            "Motivation" => $request->Motivation,
            "DateOctroi" => $request->DateOctroi,
            "DateEcheance" => $request->DateEcheance,
            "DateTombeEcheance" => $request->DateTombeEcheance,
            "Interval" => $request->Interval,
            "MontantAccorde" => $request->MontantAccorde,
            "InteretPrecompte" => $request->RefTypeCredit == "CREDIT TUINUKE" ? $request->$request->MontantAccorde * $request->TauxInteret / 100 : 0,
        ]);

        if ($request->RefTypeCredit == "CREDIT TUINUKE") {
            //GENERE L'ECHEANCIER POUR LE CREDIT TUINUKA
            Echeancier::create([
                "NumDossier" => $request->NumDossier,
                "NumMensualite"  => 0,
                "NbreJour" => $request->NbrTranche,
                "Capital" => $request->MontantAccorde,
                "Interet" => 0,
                "Cumul"  => $request->MontantAccorde,
                "DateTranch" => $request->DateOctroi,
                // "SoldeCapital" => $request->MontantAccorde,
                // "SoldeInteret" => 0,
            ]);

            //PREMIERE TRANCHE
            $capital = $request->MontantAccorde;
            $interet = 0;
            // $interetApayer = $capital * $interet / 100;
            $capitalAmorti = $capital / $request->NbrTranche;
            // $totalAp = $interetApayer + $capitalAmorti;
            // $capitalRestantDu = $capital - $capitalAmorti;
            // $dateRembours = date('Y-m-d', strtotime("+1 day"));
            //             $maxDays=date('t');
            // $currentDayOfMonth=date('j');

            // if($maxDays == $currentDayOfMonth){
            //   //Last day of month
            // }else{
            //   //Not last day of the month
            // }
            // $maxDays = date('t');

            $dateOctroie = $request->DateOctroi;
            $dates = array($request->DateTombeEcheance);
            for ($i = 1; $i <  $request->NbrTranche; $i++) {
                $NewDate = date('Y-m-d', strtotime("+" . $i . " days", strtotime("$dateOctroie")));
                $dates[] = $NewDate;
            }

            foreach ($dates as $dt) {

                $lastRowData  = Echeancier::orderBy('ReferenceEch', 'desc')->first();
                Echeancier::create([
                    "NumDossier" => $request->NumDossier,
                    "NumMensualite" => 0,
                    "NbreJour" => $lastRowData->NbreJour + 1,
                    "Capital" =>  $lastRowData->Capital - $capitalAmorti,
                    "Interet" =>  $interet,
                    "CapAmmorti" => $capitalAmorti,
                    "TotalAp" => $capitalAmorti + $interet,
                    "Cumul"  => $lastRowData->Capital - $capitalAmorti,
                    // "SoldeCapital" => $lastRowData->Capital - $capitalAmorti,
                    "DateTranch" =>  $dt,
                    "DateDebut" => $request->DateTranche,
                    "InteretPrev" => $interet,
                    // "CumulCapital" => $lastRowData->Capital - $capitalAmorti,
                ]);

                $lastRowData  = Echeancier::orderBy('ReferenceEch', 'desc')->first();
            }


            return response()->json(["success" => 1, "msg" => "Modification bien effectuée", "NumDossier" => $request->NumDossier]);
        } else if ($request->RefTypeCredit == "CREDIT INUKA") {

            //GENERE L'ECHEANCIER POUR LE CREDIT INUKA
            Echeancier::create([
                "NumDossier" => $request->NumDossier,
                "NumMensualite"  => 0,
                "NbreJour" => $request->NbrTranche,
                "Capital" => $request->MontantAccorde,
                "Interet" => 0,
                "Cumul"  => $request->MontantAccorde,
                // "SoldeCapital" => $request->MontantAccorde,
                // "SoldeInteret" => 0,
            ]);

            $dateOctroie = $request->DateOctroi;
            $dates = array($request->DateTombeEcheance);
            for ($i = 2; $i < $request->NbrTranche; $i++) {
                $NewDate = date('Y-m-d', strtotime("+" . $i . "week", strtotime("$dateOctroie")));
                $dates[] = $NewDate;
            }

            if ($request->ModeCalcul == "Constant") {
                foreach ($dates as $dt) {
                    $capital = $request->MontantAccorde;
                    $interet = $request->TauxInteret;
                    $interetApayer = $request->MontantAccorde * $request->TauxInteret / 100;
                    $capitalAmorti = $capital / $request->NbrTranche;
                    $epargneObligatoire = ($capitalAmorti * 5) / 100;
                    $totalAp = $interetApayer + $capitalAmorti +  $epargneObligatoire;
                    $lastRowData  = Echeancier::orderBy('ReferenceEch', 'desc')->first();
                    Echeancier::create([
                        "NumDossier" => $request->NumDossier,
                        "NumMensualite" => 0,
                        "NbreJour" => $lastRowData->NbreJour + 1,
                        "Capital" =>  $lastRowData->Capital - $capitalAmorti,
                        "Interet" =>  $interetApayer,
                        "CapAmmorti" => $capitalAmorti,
                        "TotalAp" => $totalAp,
                        "Cumul"  => $lastRowData->Capital - $capitalAmorti,
                        // "SoldeCapital" => $lastRowData->Capital - $capitalAmorti,
                        "DateTranch" =>  $dt,
                        "DateDebut" => $request->DateTranche,
                        "InteretPrev" => $interetApayer,
                        "Epargne" => $epargneObligatoire

                        // "CumulCapital" => $lastRowData->Capital - $capitalAmorti,
                    ]);

                    $lastRowData  = Echeancier::orderBy('ReferenceEch', 'desc')->first();
                }
                return response()->json(["success" => 1, "msg" => "Modification bien effectuée", "NumDossier" => $request->NumDossier]);
            } else if ($request->ModeCalcul == "Degressif") {
                foreach ($dates as $dt) {
                    $capital = $request->MontantAccorde;
                    $interet = $request->TauxInteret;
                    $capitalAmorti = $capital / $request->NbrTranche;
                    $epargneObligatoire = ($capitalAmorti * 5) / 100;

                    $lastRowData  = Echeancier::orderBy('ReferenceEch', 'desc')->first();
                    $interetApayer = $lastRowData->Capital * $request->TauxInteret / 100;
                    $totalAp = $interetApayer + $capitalAmorti +  $epargneObligatoire;
                    Echeancier::create([
                        "NumDossier" => $request->NumDossier,
                        "NumMensualite" => 0,
                        "NbreJour" => $lastRowData->NbreJour + 1,
                        "Capital" =>  $lastRowData->Capital - $capitalAmorti,
                        "Interet" =>  $interetApayer,
                        "CapAmmorti" => $capitalAmorti,
                        "TotalAp" => $totalAp,
                        "Cumul"  => $lastRowData->Capital - $capitalAmorti,
                        // "SoldeCapital" => $lastRowData->Capital - $capitalAmorti,
                        "DateTranch" =>  $dt,
                        "DateDebut" => $request->DateTranche,
                        "InteretPrev" => $interetApayer,
                        "Epargne" => $epargneObligatoire

                        // "CumulCapital" => $lastRowData->Capital - $capitalAmorti,
                    ]);

                    $lastRowData  = Echeancier::orderBy('ReferenceEch', 'desc')->first();
                }
                return response()->json(["success" => 1, "msg" => "Modification bien effectuée", "NumDossier" => $request->NumDossier]);
            }
        } else if ($request->RefTypeCredit == "C. A LA CONSOMMATION" or $request->RefTypeCredit == "C. PETIT COMMERCE") {

            // //GENERE L'ECHEANCIER POUR LE CREDIT INDIVIDUEL
            Echeancier::create([
                "NumDossier" => $request->NumDossier,
                "NumMensualite"  => 0,
                "NbreJour" => $request->NbrTranche,
                "Capital" => $request->MontantAccorde,
                "Interet" => 0,
                "Cumul"  => $request->MontantAccorde,
                "DateTranch" => $request->DateOctroi,
            ]);
            $dates = array($request->DateTombeEcheance);
            $dateOctroie = $request->DateOctroi;
            $NbrTranche = $request->NbrTranche + 1;
            for ($i = 2; $i < $NbrTranche; $i++) {
                $NewDate = date('Y-m-d', strtotime("+" . $i . "month", strtotime("$dateOctroie")));
                $dates[] = $NewDate;
            }

            if ($request->ModeCalcul == "Constant") {
                foreach ($dates as $dt) {
                    $capital = $request->MontantAccorde;
                    $interet = $request->TauxInteret;
                    $interetApayer = $request->MontantAccorde * $request->TauxInteret / 100;
                    $capitalAmorti = $capital / $request->NbrTranche;
                    $totalAp = $interetApayer + $capitalAmorti;
                    $lastRowData  = Echeancier::orderBy('ReferenceEch', 'desc')->first();
                    Echeancier::create([
                        "NumDossier" => $request->NumDossier,
                        "NumMensualite" => 0,
                        "NbreJour" => $lastRowData->NbreJour + 1,
                        "Capital" =>  $lastRowData->Capital - $capitalAmorti,
                        "Interet" =>  $interetApayer,
                        "CapAmmorti" => $capitalAmorti,
                        "TotalAp" => $totalAp,
                        "Cumul"  => $lastRowData->Capital - $capitalAmorti,
                        // "SoldeCapital" => $lastRowData->Capital - $capitalAmorti,
                        "DateTranch" =>  $dt,
                        "DateDebut" => $request->DateTranche,
                        "InteretPrev" => $interetApayer,
                        // "CumulCapital" => $lastRowData->Capital - $capitalAmorti,
                    ]);

                    $lastRowData  = Echeancier::orderBy('ReferenceEch', 'desc')->first();
                }
                return response()->json(["success" => 1, "msg" => "Géneration de l'écheancier bien effectuée"]);
            } else if ($request->ModeCalcul == "Degressif") {
                foreach ($dates as $dt) {
                    $capital = $request->MontantAccorde;
                    $interet = $request->TauxInteret;

                    $capitalAmorti = $capital / $request->NbrTranche;
                    $lastRowData  = Echeancier::orderBy('ReferenceEch', 'desc')->first();
                    $interetApayer = $lastRowData->Capital * $request->TauxInteret / 100;
                    $totalAp = $interetApayer + $capitalAmorti;
                    Echeancier::create([
                        "NumDossier" => $request->NumDossier,
                        "NumMensualite" => 0,
                        "NbreJour" => $lastRowData->NbreJour + 1,
                        "Capital" =>  $lastRowData->Capital - $capitalAmorti,
                        "Interet" =>  $interetApayer,
                        "CapAmmorti" => $capitalAmorti,
                        "TotalAp" => $totalAp,
                        "Cumul"  => $lastRowData->Capital - $capitalAmorti,
                        // "SoldeCapital" => $lastRowData->Capital - $capitalAmorti,
                        "DateTranch" =>  $dt,
                        "DateDebut" => $request->DateTranche,
                        "InteretPrev" => $interetApayer,
                        // "CumulCapital" => $lastRowData->Capital - $capitalAmorti,
                    ]);

                    $lastRowData  = Echeancier::orderBy('ReferenceEch', 'desc')->first();
                }
                return response()->json(["success" => 1, "msg" => "Géneration de l'écheancier bien effectuée"]);
            }
        }
    }

    //PERMET D'ACCORDER UN CREDIT


    public function AccordCredit(Request $request)
    {
        if (Auth::user()->gerant != 1) {
            return response()->json(["success" => 0, "msg" => "Vous n'avez pas d'habilitation pour accorder un crédit merci de contacter votre administrateur système."]);
        }



        if ($request->NumDossier) {
            //RECUPERE LES NUMERO DE COMPTE
            $compteEpargneGarantieCDF = "3340000000202";
            $compteEpargneGarantieUSD = "3340000000201";
            $getNumCompte = Portefeuille::where("NumDossier", "=", $request->NumDossier)->where("Cloture", "=", 0)->orderBy("id", "desc")->first();
            $NumCompte = $getNumCompte->NumCompteEpargne;
            if ($request->NumDossier == $getNumCompte->NumDossier and $getNumCompte->Accorde == 1) {
                return response()->json(["success" => 0, "msg" => "Ce crédit a été déjà accordé."]);
            }
            if ($getNumCompte->CodeMonnaie == "CDF") {

                //RECUPERE LE SOLDE 
                $soldeMembreCDF = Transactions::select(
                    DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeCDF"),
                )->where("NumCompte", '=', $NumCompte)
                    ->groupBy("NumCompte")
                    ->first();

                $montantAccorde = $getNumCompte->MontantAccorde;
                $garantieCredit = ($getNumCompte->MontantAccorde * 30) / 100;
                if ($soldeMembreCDF->soldeCDF >= $garantieCredit) {

                    //ON RECUPERE LE 30% SUR LE COMPTE DE LA PERSONNE CONCERNEE POUR L'EPARGNE GARANTIE
                    //CREE UN NUMERO DE TRANSACTION
                    CompteurTransaction::create([
                        'fakevalue' => "0000",
                    ]);
                    $numOperation = [];
                    $numOperation = CompteurTransaction::latest()->first();
                    $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "R00" . $numOperation->id;
                    $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
                    //RECUPERE LE TAUX JOURNALIER
                    $tauxDuJour = TauxJournalier::orderBy('id', 'desc')->first()->TauxEnFc;

                    //DEBITE LE COMPTE DU MEMBRE
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
                        "NumCompte" => $NumCompte,
                        "NumComptecp" => $compteEpargneGarantieCDF,
                        // "Operant" => "COMPTE COMMISSION CDF",
                        "Debit"  => $garantieCredit,
                        "Debit$"  => $garantieCredit / $tauxDuJour,
                        "Debitfc" => $garantieCredit,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "PRISE DE L'EPARGNE GARANTIE DU CREDIT",
                    ]);

                    //PUIS ON CREDITE LE COMPTE EPARGNE GARANTIE DE CE MONTANT
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
                        "NumCompte" => $compteEpargneGarantieCDF,
                        "NumComptecp" => $NumCompte,
                        // "Operant" => "COMPTE COMMISSION CDF",
                        "Credit"  => $garantieCredit,
                        "Credit$"  => $garantieCredit / $tauxDuJour,
                        "Creditfc" => $garantieCredit,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "CONSTATATION DE  L'EPARGNE GARANTIE DU CREDIT OCRTROYE A " . $getNumCompte->NomCompte . " NUMERO DE COMPTE " . $NumCompte,
                    ]);

                    //ENREGISTRE CA DANS UNE TABLE SPECIFIQUE

                    LockedGarantie::create([
                        "NumCompte" => $NumCompte,
                        "NumAbrege" => $getNumCompte->numAdherant,
                        "Montant" => $garantieCredit,
                        "Devise" => "CDF",
                    ]);
                } else {
                    return response()->json(["success" => 0, "msg" => "Ce compte n'a pas un solde suffisant faisant objet de l'epargne garantie de ce credit."]);
                }
            } else if ($getNumCompte->CodeMonnaie == "USD") {
                //RECUPERE LE SOLDE 
                $soldeMembreUSD = Transactions::select(
                    DB::raw("SUM(Credit$)-SUM(Debit$) as soldeUSD"),
                )->where("NumCompte", '=', $NumCompte)
                    ->groupBy("NumCompte")
                    ->first();

                $montantAccorde = $getNumCompte->MontantAccorde;
                $garantieCredit = ($montantAccorde * 30) / 100;
                if ($soldeMembreUSD->soldeUSD >= $garantieCredit) {
                    //ON RECUPERE LE 30% SUR LE COMPTE DE LA PERSONNE CONCERNEE POUR L'EPARGNE GARANTIE
                    //CREE UN NUMERO DE TRANSACTION
                    CompteurTransaction::create([
                        'fakevalue' => "0000",
                    ]);
                    $numOperation = [];
                    $numOperation = CompteurTransaction::latest()->first();
                    $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "R00" . $numOperation->id;
                    $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
                    //RECUPERE LE TAUX JOURNALIER
                    $tauxDuJour = TauxJournalier::orderBy('id', 'desc')->first()->TauxEnFc;

                    //DEBITE LE COMPTE DU MEMBRE
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
                        "NumCompte" => $NumCompte,
                        "NumComptecp" => $compteEpargneGarantieUSD,
                        "Debit"  => $garantieCredit,
                        "Debit$"  => $garantieCredit,
                        "Debitfc" => $garantieCredit * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "PRISE DE L'EPARGNE GARANTIE DU CREDIT",
                    ]);

                    //PUIS ON CREDITE LE COMPTE EPARGNE GARANTIE DE CE MONTANT
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
                        "NumCompte" => $compteEpargneGarantieUSD,
                        "NumComptecp" => $NumCompte,
                        "Credit"  => $garantieCredit,
                        "Credit$"  => $garantieCredit,
                        "Creditfc" => $garantieCredit * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "CONSTATATION DE  L'EPARGNE GARANTIE DU CREDIT OCRTROYE A " . $getNumCompte->NomCompte . " NUMERO DE COMPTE " . $NumCompte,
                    ]);

                    //ENREGISTRE CA DANS UNE TABLE SPECIFIQUE

                    LockedGarantie::create([
                        "NumCompte" => $NumCompte,
                        "NumAbrege" => $getNumCompte->numAdherant,
                        "Montant" => $garantieCredit,
                        "Devise" => "USD",
                    ]);
                } else {
                    return response()->json(["success" => 0, "msg" => "Ce compte n'a pas un solde suffisant faisant objet de l'epargne garantie de ce credit."]);
                }
            }
            Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
                "Accorde" => 1,
                "AccordePar" => Auth::user()->name,
            ]);

            return response()->json(["success" => 1, "msg" => "Ce crédit a bien été accordé merci."]);
        } else {
            return response()->json(["success" => 0, "msg" => "Vous n'avez renseigné aucun numéro de compte ou il n'existe aucun crédit associé au numéro de compte renseigné."]);
        }
    }

    //PERMET DE CLOTURER UN CREDIT


    public function  ClotureCredit(Request $request)
    {
        if (Auth::user()->gerant != 1) {
            return response()->json(["success" => 0, "msg" => "Vous n'avez pas d'habilitation pour clotûrer  un crédit merci de contacter votre administrateur système."]);
        }
        if (isset($request->NumDossier)) {

            //REMET L'EPARGNE GARANTIE A LA PERSONNE
            $compteEpargneGarantieCDF = "3340000000202";
            $compteEpargneGarantieUSD = "3340000000201";
            //CREE UN NUMERO DE TRANSACTION
            CompteurTransaction::create([
                'fakevalue' => "0000",
            ]);
            $numOperation = [];
            $numOperation = CompteurTransaction::latest()->first();
            $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "R00" . $numOperation->id;
            $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
            //RECUPERE LE TAUX JOURNALIER 
            $tauxDuJour = TauxJournalier::orderBy('id', 'desc')->first()->TauxEnFc;
            $getNumCompte = Portefeuille::where("NumDossier", "=", $request->NumDossier)->where("Cloture", "=", 0)->first();
            $NumCompte = $getNumCompte->NumCompteEpargne;
            if ($getNumCompte->CodeMonnaie == "CDF") {
                //RECUPERE LE MONTANT DANS LA TABLE CONCERNE
                $getData = LockedGarantie::where("NumCompte", "=", $NumCompte)->where("paidState", "=", 0)->first();
                if ($getData) {
                    //DEBITE LE COMPTE EPARGNE GARANTIE 
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
                        "NumCompte" => $compteEpargneGarantieCDF,
                        "NumComptecp" => $NumCompte,
                        "Debit"  => $getData->Montant,
                        "Debit$"  => $getData->Montant / $tauxDuJour,
                        "Debitfc" => $getData->Montant,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "RESTITUTION DE  L'EPARGNE GARANTIE DU CREDIT OCRTROYE A " . $getNumCompte->NomCompte . " NUMERO DE COMPTE " . $NumCompte,
                    ]);

                    //CREDITE LE COMPTE DU MEMBRE
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
                        "NumCompte" => $NumCompte,
                        "NumComptecp" => $compteEpargneGarantieCDF,
                        "Credit"  => $getData->Montant,
                        "Credit$"  => $getData->Montant / $tauxDuJour,
                        "Creditfc" => $getData->Montant,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "RESTITUTION DE VOTRE EPARGNE GARANTIE",
                    ]);
                    LockedGarantie::where("NumCompte", $NumCompte)->where("paidState", "=", 0)->update([
                        "paidState" => 1
                    ]);

                    Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
                        "Cloture" => 1,
                        "CloturePar" => Auth::user()->name,
                    ]);
                }
            } else if ($getNumCompte->CodeMonnaie == "USD") {
                //RECUPERE LE MONTANT DANS LA TABLE CONCERNE
                $getData = LockedGarantie::where("NumCompte", "=", $NumCompte)->where("paidState", "=", 0)->first();
                if ($getData) {
                    //DEBITE LE COMPTE EPARGNE GARANTIE 
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
                        "NumCompte" => $compteEpargneGarantieUSD,
                        "NumComptecp" => $NumCompte,
                        "Debit"  => $getData->Montant,
                        "Debit$"  => $getData->Montant,
                        "Debitfc" => $getData->Montant * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "RESTITUTION DE  L'EPARGNE GARANTIE DU CREDIT OCRTROYE A " . $getNumCompte->NomCompte . " NUMERO DE COMPTE " . $NumCompte,
                    ]);

                    //CREDITE LE COMPTE DU MEMBRE
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
                        "NumCompte" => $NumCompte,
                        "NumComptecp" => $compteEpargneGarantieUSD,
                        "Credit"  => $getData->Montant,
                        "Credit$"  => $getData->Montant,
                        "Creditfc" => $getData->Montant * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "RESTITUTION DE VOTRE EPARGNE GARANTIE",
                    ]);

                    LockedGarantie::where("NumCompte", $NumCompte)->where("paidState", "=", 0)->update([
                        "paidState" => 1
                    ]);
                }
                Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
                    "Cloture" => 1,
                    "CloturePar" => Auth::user()->name,
                ]);
            }



            return response()->json(["success" => 1, "msg" => "Ce crédit a bien été Clôturé merci."]);
        } else {
            return response()->json(["success" => 0, "msg" => "Aucun numéro de compte renseigné."]);
        }
    }


    //PERMET DE DECAISSER UN CREDIT
    public function DeccaissementCredit(Request $request)
    {
        if (Auth::user()->comptable != 1 or Auth::user()->subcomptbale != 1) {
            return response()->json(["success" => 0, "msg" => "Vous n'avez pas d'habilitation pour decaisser un crédit merci de contacter votre administrateur système."]);
        }
        if (isset($request->NumDossier)) {
            $creditExist = Portefeuille::where("NumDossier", "=", $request->NumDossier)->first();
            if ($creditExist->Accorde == 1) {

                Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
                    "Octroye" => 1,
                ]);
                //ENREGISTRE TOUT D'ABORD LE COMPTE CREDIT DU BENEFICIAIRE S'IL n'EXISTE PAS
                $dataCredit = Portefeuille::where("NumDossier", "=", $request->NumDossier)->first();
                //RECUPERE LES INFORMATIONS DU MEMBRE CORRESPONDANT
                $infoMembre = Comptes::where("NumCompte", "=", $dataCredit->NumCompteEpargne)->first();


                $checkIfCompteCreditExist = Comptes::where("NumCompte", "=", $dataCredit->NumCompteCredit)->first();
                if (!$checkIfCompteCreditExist) {

                    //ON CREE UN NOUVEL NUMERO DE CREDIT POUR CE MEMBRE 
                    Comptes::create([
                        'CodeAgence' => $dataCredit->codeAgence,
                        'NumCompte' => $dataCredit->NumCompteCredit,
                        'NomCompte' => $infoMembre->NomCompte,
                        'CodeMonnaie' => $dataCredit->CodeMonnaie == "USD" ? 1 : 2,
                        'NumAdherant' => $dataCredit->NumCompteCredit,
                        'RefTypeCompte' => 3,
                        'RefCadre' => 32,
                        'RefGroupe' => 320,
                        'RefSousGroupe' => 321,
                    ]);
                }

                //VERIFIE SI UN NUMERO DE COMPTE EPARGNE GARANTIE N'EXISTE PAS POUR EN CREE UN
                $checkIfCompteEpargneGarantieExist = Comptes::where("NumCompte", "=", $request->NumCompteEpargneGarantie)->first();
                if (!$checkIfCompteEpargneGarantieExist) {
                    //ON CREE UN NOUVEL NUMERO DE EPARGNE GARANTIE POUR CE MEMBRE 
                    Comptes::create([
                        'CodeAgence' => $dataCredit->codeAgence,
                        'NumCompte' => $request->NumCompteEpargneGarantie,
                        'NomCompte' => $infoMembre->NomCompte . " E.G",
                        'CodeMonnaie' => $dataCredit->CodeMonnaie == "USD" ? 1 : 2,
                        'NumAdherant' => $request->NumCompteEpargneGarantie,
                        'RefTypeCompte' => 3,
                        'RefCadre' => 33,
                        'RefGroupe' => 334,
                        'RefSousGroupe' => 3340,
                    ]);
                }



                //APRES LA CREATION DE SON COMPTE CREDIT ON DEBITE LE COMPTE DE CREDIT   
                //CREE UN NUMERO DE TRANSACTION

                if ($dataCredit->CodeMonnaie == "CDF") {


                    // $numCompteCreditCDF = 3270000000202;

                    CompteurTransaction::create([
                        'fakevalue' => "0000",
                    ]);
                    $numOperation = [];
                    $numOperation = CompteurTransaction::latest()->first();
                    $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "R00" . $numOperation->id;
                    //RECUPERE LA DATE DU SYSTEME

                    $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
                    //RECUPERE LE TAUX JOURNALIER
                    $tauxDuJour = TauxJournalier::orderBy('id', 'desc')->first()->TauxEnFc;
                    //DEBITE LE COMPTE CREDIT
                    $compteCreditAuxMembreCDF = "3210000000202";

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteCreditAuxMembreCDF,
                        "NumComptecp" => $dataCredit->NumCompteEpargne,
                        "Debit" => $dataCredit->MontantAccorde,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" => $dataCredit->MontantAccorde / $tauxDuJour,
                        "Debitfc" => $dataCredit->MontantAccorde,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Crédit à court terme octroyé à " . $infoMembre->NomCompte . " en date du " . $date . " Numéro dossier " . $dataCredit->NumDossier,
                        "refCompteMembre" => $compteCreditAuxMembreCDF,
                    ]);
                    //PUIS ON DEBITE LE COMPTE CREDIT DU MEMBRE


                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $dataCredit->NumCompteCredit,
                        "NumComptecp" =>  $dataCredit->NumCompteEpargne,
                        "Debit" => $dataCredit->MontantAccorde,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" => $dataCredit->MontantAccorde / $tauxDuJour,
                        "Debitfc" => $dataCredit->MontantAccorde,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Crédit à court terme octroyé à " . $infoMembre->NomCompte . " en date du " . $date . " Numéro dossier " . $dataCredit->NumDossier,
                        "refCompteMembre" => $dataCredit->NumCompteCredit,
                    ]);

                    //APRES CETTE OPERATION ON CREDITE SON COMPTE EPARGNE


                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" =>  $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $dataCredit->NumCompteEpargne,
                        "NumComptecp" =>  $dataCredit->NumCompteCredit,
                        "Credit" => $dataCredit->MontantAccorde,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" => $dataCredit->MontantAccorde / $tauxDuJour,
                        "Creditfc" => $dataCredit->MontantAccorde,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Votre crédit à court terme octroyé en date du " . $date . " Numéro dossier " . $dataCredit->NumDossier,
                        "refCompteMembre" => $dataCredit->NumCompteEpargne,
                    ]);
                } else if ($dataCredit->CodeMonnaie == "USD") {

                    // $numCompteCreditUSD = 3270000000201;


                    CompteurTransaction::create([
                        'fakevalue' => "0000",
                    ]);
                    $numOperation = [];
                    $numOperation = CompteurTransaction::latest()->first();
                    $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "R00" . $numOperation->id;
                    //RECUPERE LA DATE DU SYSTEME

                    $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
                    //RECUPERE LE TAUX JOURNALIER
                    $tauxDuJour = TauxJournalier::orderBy('id', 'desc')->first()->TauxEnFc;
                    $compteCreditAuxMembreUSD = "3210000000201";
                    //DEBITE LE COMPTE CREDIT USD
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteCreditAuxMembreUSD,
                        "NumComptecp" => $dataCredit->NumCompteEpargne,
                        "Debit" => $dataCredit->MontantAccorde,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" => $dataCredit->MontantAccorde,
                        "Debitfc" => $dataCredit->MontantAccorde * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Crédit à court terme octroyé à " . $infoMembre->NomCompte . " en date du " . $date . " Numéro dossier " . $dataCredit->NumDossier,
                        "refCompteMembre" => $compteCreditAuxMembreUSD,
                    ]);
                    //PUIS ON DEBITE LE COMPTE CREDIT DU MEMBRE


                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $dataCredit->NumCompteCredit,
                        "NumComptecp" =>  $dataCredit->NumCompteEpargne,
                        "Debit" => $dataCredit->MontantAccorde,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" => $dataCredit->MontantAccorde,
                        "Debitfc" => $dataCredit->MontantAccorde * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Crédit à court terme octroyé à " . $infoMembre->NomCompte . " en date du " . $date . " Numéro dossier " . $dataCredit->NumDossier,
                        "refCompteMembre" => $dataCredit->NumCompteCredit,
                    ]);

                    //APRES CETTE OPERATION ON CREDITE SON COMPTE EPARGNE


                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $dataCredit->NumCompteEpargne,
                        "NumComptecp" =>  $dataCredit->NumCompteCredit,
                        "Credit" => $dataCredit->MontantAccorde,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" => $dataCredit->MontantAccorde,
                        "Creditfc" => $dataCredit->MontantAccorde * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Votre crédit à court terme octroyé en date du " . $date . " Numéro dossier " . $dataCredit->NumDossier . " Compte crédit " . $dataCredit->NumCompteCredit,
                        "refCompteMembre" => $dataCredit->NumCompteEpargne,
                    ]);
                }


                return response()->json(["success" => 1, "msg" => "Ce crédit a bien été décaissé merci."]);
            } else {
                return response()->json(["success" => 0, "msg" => "Le crédit ne pas encore accordé merci."]);
            }
        } else {
            return response()->json(["success" => 0, "msg" => "Aucun numéro de dossier trouvé."]);
        }
    }

    public function getSuiviCreditPage()
    {
        return view('suivicredit');
    }
}
