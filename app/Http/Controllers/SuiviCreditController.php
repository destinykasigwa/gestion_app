<?php

namespace App\Http\Controllers;

use App\Models\Comptes;
use App\Models\Garantie;
use App\Models\Echeancier;
use App\Models\Portefeuille;
use App\Models\Transactions;
use Illuminate\Http\Request;
use App\Models\TauxJournalier;
use App\Models\CompteurTransaction;
use Illuminate\Support\Facades\Auth;
use App\Models\CompteurDossierCredit;
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
            $data = Comptes::where("NumAdherant", "=", $request->compteToSearch)->where("CodeMonnaie", "=", 2)->first();
            if ($data) {
                $data2 = Portefeuille::where("NumCompteEpargne", "=", $data->NumCompte)->first();

                return response()->json(["success" => 1, "data" => $data, "data2" => $data2]);
            } else {
                return response()->json(["success" => 0, "msg" => "Aucun numéro de compte trouvé"]);
            }
        } else if ($request->CodeMonnaie == "USD") {
            $data = Comptes::where("NumAdherant", "=", $request->compteToSearch)->where("CodeMonnaie", "=", 1)->first();
            if ($data) {
                $data2 = Portefeuille::where("NumCompteEpargne", "=", $data->NumCompte)->first();

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
                    // "SoldeCapital" => $request->MontantAccorde,
                    // "SoldeInteret" => 0,
                ]);

                //COMPLETE L'ECHEANCIER
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
                $maxDays = date('t');
                $dates = array($request->DateTombeEcheance);
                for ($i = 1; $i < $maxDays; $i++) {
                    $NewDate = date('Y-m-d', strtotime("+" . $i . " days"));
                    $dates[] = $NewDate;
                }

                foreach ($dates as $dt) {

                    $lastRowData  = Echeancier::orderBy('id', 'desc')->first();
                    Echeancier::create([
                        "NumDossier" => $request->NumDossier,
                        "NumMensualite" => 0,
                        "NbreJour" => $lastRowData->NbreJour - 1,
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

                    $lastRowData  = Echeancier::orderBy('id', 'desc')->first();
                }





                return response()->json(["success" => 1, "msg" => "Géneration de l'écheancier bien effectuée"]);
            } else if ($request->RefTypeCredit == "CREDIT INUKA") {
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
                $maxDays = date('t');
                $dates = array($request->DateTombeEcheance);
                for ($i = 1; $i < $request->NbrTranche; $i++) {
                    $NewDate = date('Y-m-d', strtotime("+" . $i . "week"));
                    $dates[] = $NewDate;
                }

                foreach ($dates as $dt) {
                    $capital = $request->MontantAccorde;
                    $interet = $request->TauxInteret;
                    $interetApayer = $request->MontantAccorde * $request->TauxInteret / 100;
                    $capitalAmorti = $capital / $request->NbrTranche;
                    $epargneObligatoire = 7000 - ($interetApayer + $capitalAmorti);
                    $totalAp = $interetApayer + $capitalAmorti +  $epargneObligatoire;
                    $lastRowData  = Echeancier::orderBy('id', 'desc')->first();
                    Echeancier::create([
                        "NumDossier" => $request->NumDossier,
                        "NumMensualite" => 0,
                        "NbreJour" => $lastRowData->NbreJour - 1,
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

                    $lastRowData  = Echeancier::orderBy('id', 'desc')->first();
                }





                return response()->json(["success" => 1, "msg" => "Géneration de l'écheancier bien effectuée"]);
            } else if ($request->RefTypeCredit == "CREDIT A LA CONSOMMATION" or $request->RefTypeCredit == "CREDIT PETIT COMMERCE") {

                Echeancier::create([
                    "NumDossier" => $request->NumDossier,
                    "NumMensualite"  => 0,
                    "NbreJour" => $request->NbrTranche,
                    "Capital" => $request->MontantAccorde,
                    "Interet" => 0,
                    "Cumul"  => $request->MontantAccorde,
                ]);

                $dates = array($request->DateTombeEcheance);
                for ($i = 1; $i < $request->NbrTranche; $i++) {
                    $NewDate = date('Y-m-d', strtotime("+" . $i . "month"));
                    $dates[] = $NewDate;
                }

                foreach ($dates as $dt) {
                    $capital = $request->MontantAccorde;
                    $interet = $request->TauxInteret;
                    $interetApayer = $request->MontantAccorde * $request->TauxInteret / 100;
                    $capitalAmorti = $capital / $request->NbrTranche;
                    $totalAp = $interetApayer + $capitalAmorti;
                    $lastRowData  = Echeancier::orderBy('id', 'desc')->first();
                    Echeancier::create([
                        "NumDossier" => $request->NumDossier,
                        "NumMensualite" => 0,
                        "NbreJour" => $lastRowData->NbreJour - 1,
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

                    $lastRowData  = Echeancier::orderBy('id', 'desc')->first();
                }
                return response()->json(["success" => 1, "msg" => "Géneration de l'écheancier bien effectuée"]);
            }
        }
    }

    //MET A JOUR L'ECHEANCIER

    public     function upDateEcheancier(Request $request)
    {

        //SUPPRIME LA LIGNE CORRESPONDANT A CE NUMERO DE DOSSIER DANS ECHEANCIER
        Echeancier::where("NumDossier", "=", $request->NumDossier)->delete();


        //MET  LE PORTE FEUILLE A JOUR

        Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
            "Decision" => $request->Decision,
            "Motivation" => $request->Motivation,
            "DateOctroi" => $request->DateOctroi,
            "DateEcheance" => $request->DateEcheance,
            "DateTombeEcheance" => $request->DateTombeEcheance,
            "Interval" => $request->Interval,
            "MontantAccorde" => $request->MontantAccorde,
            "InteretPrecompte" => $request->MontantAccorde * $request->TauxInteret / 100,
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
            $dates = array($request->DateTombeEcheance);
            for ($i = 1; $i <  $request->NbrTranche; $i++) {
                $NewDate = date('Y-m-d', strtotime("+" . $i . " days"));
                $dates[] = $NewDate;
            }

            foreach ($dates as $dt) {

                $lastRowData  = Echeancier::orderBy('id', 'desc')->first();
                Echeancier::create([
                    "NumDossier" => $request->NumDossier,
                    "NumMensualite" => 0,
                    "NbreJour" => $lastRowData->NbreJour - 1,
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

                $lastRowData  = Echeancier::orderBy('id', 'desc')->first();
            }


            return response()->json(["success" => 1, "msg" => "Modification bien effectuée", "NumDossier" => $request->NumDossier]);
        } else if ("CREDIT INUKA") {

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

            $dates = array($request->DateTombeEcheance);
            for ($i = 1; $i < $request->NbrTranche; $i++) {
                $NewDate = date('Y-m-d', strtotime("+" . $i . "week"));
                $dates[] = $NewDate;
            }

            foreach ($dates as $dt) {
                $capital = $request->MontantAccorde;
                $interet = $request->TauxInteret;
                $interetApayer = $request->MontantAccorde * $request->TauxInteret / 100;
                $capitalAmorti = $capital / $request->NbrTranche;
                $epargneObligatoire = 7000 - ($interetApayer + $capitalAmorti);
                $totalAp = $interetApayer + $capitalAmorti +  $epargneObligatoire;
                $lastRowData  = Echeancier::orderBy('id', 'desc')->first();
                Echeancier::create([
                    "NumDossier" => $request->NumDossier,
                    "NumMensualite" => 0,
                    "NbreJour" => $lastRowData->NbreJour - 1,
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

                $lastRowData  = Echeancier::orderBy('id', 'desc')->first();
            }
            return response()->json(["success" => 1, "msg" => "Modification bien effectuée", "NumDossier" => $request->NumDossier]);
        } else if ($request->RefTypeCredit == "CREDIT A LA CONSOMMATION" or $request->RefTypeCredit == "CREDIT PETIT COMMERCE") {

            // //GENERE L'ECHEANCIER POUR LE CREDIT INDIVIDUEL
            Echeancier::create([
                "NumDossier" => $request->NumDossier,
                "NumMensualite"  => 0,
                "NbreJour" => $request->NbrTranche,
                "Capital" => $request->MontantAccorde,
                "Interet" => 0,
                "Cumul"  => $request->MontantAccorde,
            ]);
            $dates = array($request->DateTombeEcheance);
            for ($i = 1; $i < $request->NbrTranche; $i++) {
                $NewDate = date('Y-m-d', strtotime("+" . $i . "month"));
                $dates[] = $NewDate;
            }

            foreach ($dates as $dt) {
                $capital = $request->MontantAccorde;
                $interet = $request->TauxInteret;
                $interetApayer = $request->MontantAccorde * $request->TauxInteret / 100;
                $capitalAmorti = $capital / $request->NbrTranche;
                $totalAp = $interetApayer + $capitalAmorti;
                $lastRowData  = Echeancier::orderBy('id', 'desc')->first();
                Echeancier::create([
                    "NumDossier" => $request->NumDossier,
                    "NumMensualite" => 0,
                    "NbreJour" => $lastRowData->NbreJour - 1,
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

                $lastRowData  = Echeancier::orderBy('id', 'desc')->first();
            }
            return response()->json(["success" => 1, "msg" => "Géneration de l'écheancier bien effectuée"]);
        }
    }

    //PERMET D'ACCORDER UN CREDIT


    public function AccordCredit(Request $request)
    {
        Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
            "Accorde" => 1,
        ]);

        return response()->json(["success" => 1, "msg" => "Ce crédit a bien été accordé merci."]);
    }

    //PERMET DE CLOTURER UN CREDIT


    public function  ClotureCredit(Request $request)
    {
        Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
            "Cloture" => 1,
        ]);

        return response()->json(["success" => 1, "msg" => "Ce crédit a bien été Clôturé merci."]);
    }


    //PERMET DE DECAISSER UN CREDIT
    public function DeccaissementCredit(Request $request)
    {

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

            // Transactions::create([
            //     "NumTransaction" => $NumTransaction,
            //     "DateTransaction" => $date,
            //     "DateSaisie" => $date,
            //     "TypeTransaction" => "D",
            //     "CodeMonnaie" => 2,
            //     "CodeAgence" => "20",
            //     "NumDossier" => "DOS00" . $numOperation->id,
            //     "NumDemande" => "V00" . $numOperation->id,
            //     "NumCompte" => $numCompteCreditCDF,
            //     "NumComptecp" => $dataCredit->NumCompteCredit,
            //     "Debit" => $dataCredit->MontantAccorde,
            //     "Operant" =>  Auth::user()->name,
            //     "Debit$" => $dataCredit->MontantAccorde / $tauxDuJour,
            //     "Debitfc" => $dataCredit->MontantAccorde,
            //     "NomUtilisateur" => Auth::user()->name,
            //     "Libelle" => "Crédit à court terme octroyé à " . $infoMembre->NomCompte . " en date du " . $date . " Numéro dossier " . $dataCredit->NumDossier,
            //     "refCompteMembre" => $numCompteCreditCDF,
            // ]);
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

            //DEBITE LE COMPTE CREDIT USD
            // Transactions::create([
            //     "NumTransaction" => $NumTransaction,
            //     "DateTransaction" => $date,
            //     "DateSaisie" => $date,
            //     "TypeTransaction" => "D",
            //     "CodeMonnaie" => 1,
            //     "CodeAgence" => "20",
            //     "NumDossier" => "DOS00" . $numOperation->id,
            //     "NumDemande" => "V00" . $numOperation->id,
            //     "NumCompte" => $numCompteCreditUSD,
            //     "NumComptecp" => $dataCredit->NumCompteCredit,
            //     "Debit" => $dataCredit->MontantAccorde,
            //     "Operant" =>  Auth::user()->name,
            //     "Debit$" => $dataCredit->MontantAccorde,
            //     "Debitfc" => $dataCredit->MontantAccorde * $tauxDuJour,
            //     "NomUtilisateur" => Auth::user()->name,
            //     "Libelle" => "Crédit à court terme octroyé à " . $infoMembre->NomCompte . " en date du " . $date . " Numéro dossier " . $dataCredit->NumDossier,
            //     "refCompteMembre" => $numCompteCreditUSD,
            // ]);
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
    }

    public function getSuiviCreditPage()
    {
        return view('suivicredit');
    }
}
