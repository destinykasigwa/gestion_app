<?php

namespace App\Http\Controllers;

use App\Http\Controllers\RemboursementCredit as ControllersRemboursementCredit;
use App\Models\ClosedDay;
use App\Models\Echeancier;
use App\Models\Portefeuille;
use App\Models\Transactions;
use Illuminate\Http\Request;
use App\Models\TauxJournalier;
use App\Models\RemboursEttendu;
use Illuminate\Support\Facades\DB;
use App\Models\CompteurTransaction;
use App\Models\Remboursementcredit;
use Illuminate\Support\Facades\Auth;

class PostageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    //PERMET DE CLOTURER LA JOURNEE EN COURS

    public function clotureJournee()
    {

        $compteCreditAuxMembreCDF = "3210000000202";
        $compteCreditAuxMembreUSD = "3210000000201";


        //RECUPERE TOUT LES MEMBRES QUI ONT UN CREDIT EN CDF
        $dateDuJour = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
        $tauxDuJour =  TauxJournalier::orderBy('id', 'desc')->first()->TauxEnFc;
        $dataMembre = Portefeuille::where("portefeuilles.Cloture", "=", 0)
            ->where("portefeuilles.Octroye", "=", 1)
            ->join('echeanciers', 'echeanciers.NumDossier', '=', 'portefeuilles.NumDossier')
            ->where("echeanciers.DateTranch", "<=", $dateDuJour)
            ->where("portefeuilles.CodeMonnaie", "=", "CDF")
            ->where("echeanciers.statutPayement", "=", 0)
            ->where("echeanciers.posted", "=", 0)
            ->where("echeanciers.CapAmmorti", ">", 0)->get();
        //RECUPERE TOUT LE MEMBRE QUI ONT UN CREDIT EN USD

        $dataMembreUSD = Portefeuille::where("portefeuilles.Cloture", "=", 0)
            ->where("portefeuilles.Octroye", "=", 1)
            ->join('echeanciers', 'echeanciers.NumDossier', '=', 'portefeuilles.NumDossier')
            ->where("echeanciers.DateTranch", "<=", $dateDuJour)
            ->where("portefeuilles.CodeMonnaie", "=", "USD")
            ->where("echeanciers.statutPayement", "=", 0)
            ->where("echeanciers.posted", "=", 0)
            ->where("echeanciers.CapAmmorti", ">", 0)->get();


        if (count($dataMembre) != 0) {

            for ($i = 0; $i < sizeof($dataMembre); $i++) {
                $response[] = $dataMembre[$i];
            }
            foreach ($response as $dataMembre) {
                //RECUPERE LE SOLDE DE CHAQUE COMPTE DONT SON ECHEANCE TOMBE
                $soldeMembreCDF = Transactions::select(
                    DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeCDF"),
                )->where("NumCompte", '=', $dataMembre->NumCompteEpargne)
                    ->groupBy("NumCompte")
                    ->first();
                //GENERE UN NUMERO DOSSIER 
                CompteurTransaction::create([
                    'fakevalue' => "0000",
                ]);
                $numOperation = [];
                $numOperation = CompteurTransaction::latest()->first();
                $NumTransaction = "AT00" . $numOperation->id;

                //SI LE MEMBRE EST EN RETARD EST QUE SON SOLDE EST A 0 ON INCREMENTE SON LES JOUR DE RETARD
                if ($soldeMembreCDF->soldeCDF <= 0 and ($dataMembre->CapitalRetard > 0 or $dataMembre->InteretRetardEchu > 0) and ($dataMembre->posted != 1)) {

                    $JourRetard = Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)
                        ->first()->JourRetard;
                    // $JourRetar = $JourRetard - 1;
                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                        "JourRetard" => $JourRetard + 1,
                    ]);
                } else {
                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                        "JourRetard" => 0,
                    ]);
                }
                //LE CODE SUIVANT DOIT ETRE EXECUTE SEULEMENT SI LE CLIENT EST EN RETARD DE PAIEMENT EST QUE SON SOLDE =0
                if (($soldeMembreCDF->soldeCDF == 0 or $soldeMembreCDF->soldeCDF < 0) and $dataMembre->DateTranch == $dateDuJour) {

                    $capitalAmmortie = $dataMembre->CapAmmorti;
                    $interetAmortie = $dataMembre->Interet;
                    $epargneAmmortie = $dataMembre->Epargne;

                    //ICI ON VERIFIE S'IL YA PAS EU UN REMBOURSEMENT QUI N'A PAS ETE COMPLET ET QUE LE MONTANT N'A PAS ETE COMPLET
                    $checkRemboursement = Remboursementcredit::where("NumDossie", "=", $dataMembre->NumDossier)->where("JoursRetard", ">", 0)->first();
                    if ($checkRemboursement) {
                        $getDateTrache = Remboursementcredit::where("NumDossie", "=", $dataMembre->NumDossier)->first();
                        //SI LE MEMBRE EST EN RETARD DE REMBOURSEMENT ON VA METTRE A JOUR CE REMBOURSEMENT
                        $capitalDejaRembourse = $checkRemboursement->CapitalPaye;
                        $interetDejaRembourse = $checkRemboursement->InteretPaye;
                        $epagneDejaRembourse = $checkRemboursement->EpargnePaye;
                        $epargneManquant = $epargneAmmortie - $epagneDejaRembourse;
                        $capitalManquant = $capitalAmmortie - $capitalDejaRembourse;
                        $interetManquant = $interetAmortie - $interetDejaRembourse;
                        $soldeDuMembreCDF = $soldeMembreCDF->soldeCDF;
                        $capitalAccorde = $dataMembre->MontantAccorde;
                        $dateTrache = $getDateTrache->DateTranche;
                        // RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE ET LE TOT DU CAPITAL EN RETARD
                        $totCapDejaPaye = Remboursementcredit::select(
                            DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                            DB::raw("SUM(remboursementcredits.CapitalAmmortie)-SUM(remboursementcredits.CapitalPaye) as totCaptRetard"),
                            DB::raw("SUM(remboursementcredits.InteretAmmorti)-SUM(remboursementcredits.InteretPaye) as totInteretRetard")
                        )->where("remboursementcredits.NumDossie", "=", $dataMembre->NumDossier)
                            ->groupBy("remboursementcredits.NumDossie")
                            ->first();

                        //RECUPERE ICI LE JOUR DE RETARD QUE LE MEMBRE A 
                        $JourRetard = Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)
                            ->first()->JourRetard;
                        //PUIS ON MET A JOUR LE PORTE FEUILLE DE CREDIT
                        $capRestant =  $capitalAccorde - $totCapDejaPaye->totCapitalPaye;
                        if ($JourRetard <= 30) {
                            Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                "CapitalRestant" => $capRestant,
                                "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                "Retard1" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                            ]);
                        } else if ($JourRetard > 30 and $JourRetard <= 60) {
                            Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                "CapitalRestant" => $capRestant,
                                "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                "Retard2" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                            ]);
                        } else if ($JourRetard > 60 and $JourRetard <= 90) {
                            Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                "CapitalRestant" => $capRestant,
                                "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                "Retard3" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                            ]);
                        } else if ($JourRetard > 90 and $JourRetard <= 180) {
                            Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                "CapitalRestant" => $capRestant,
                                "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                "Retard4" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                            ]);
                        }


                        //RENSEIGNE LE RETARD

                        //ON EFFECTUE LE REMBOURSEMENT
                        if ($dateTrache == $dataMembre->DateTranch) {
                            Remboursementcredit::where("RefEcheance", "=", $dataMembre->ReferenceEch)
                                ->where("DateTranche", "=", $dataMembre->DateTranch)->update([
                                    "RefEcheance" => $dataMembre->ReferenceEch,
                                    "NumCompte" => $dataMembre->NumCompteEpargne,
                                    "NumCompteCredit" => $dataMembre->NumCompteCredit,
                                    "NumDossie" => $dataMembre->NumDossier,
                                    "RefTypCredit" => $dataMembre->RefTypeCredit,
                                    "NomCompte" => $dataMembre->NomCompte,
                                    "DateTranche" => $dataMembre->DateTranch,
                                    "CapitalAmmortie" => $capitalAmmortie,
                                    "InteretAmmorti" => $interetAmortie,
                                    "EpargneAmmorti" => $epargneAmmortie,
                                    "CodeGuichet" => $dataMembre->CodeGuichet,
                                    "NumAdherent" => $dataMembre->numAdherant,
                                ]);
                        } else {
                            Remboursementcredit::create([
                                "RefEcheance" => $dataMembre->ReferenceEch,
                                "NumCompte" => $dataMembre->NumCompteEpargne,
                                "NumCompteCredit" => $dataMembre->NumCompteCredit,
                                "NumDossie" => $dataMembre->NumDossier,
                                "RefTypCredit" => $dataMembre->RefTypeCredit,
                                "NomCompte" => $dataMembre->NomCompte,
                                "DateTranche" => $dataMembre->DateTranch,
                                "CapitalAmmortie" => $capitalAmmortie,
                                "InteretAmmorti" => $interetAmortie,
                                "EpargneAmmorti" => $epargneAmmortie,
                                "CodeGuichet" => $dataMembre->CodeGuichet,
                                "NumAdherent" => $dataMembre->numAdherant,
                            ]);
                        }


                        //DEBITE LE COMPTE CREDIT EN RETARD 39
                        $compteCreditRetard = "390000000202";
                        Transactions::create([
                            "NumTransaction" => $NumTransaction,
                            "DateTransaction" => $dateDuJour,
                            "DateSaisie" => $dateDuJour,
                            "TypeTransaction" => "D",
                            "CodeMonnaie" => 2,
                            "CodeAgence" => "20",
                            "NumDossier" => "DOS00" . $numOperation->id,
                            "NumDemande" => "V00" . $numOperation->id,
                            "NumCompte" => $compteCreditRetard,
                            "NumComptecp" => $compteCreditAuxMembreCDF,
                            "Debit" =>  $capitalManquant,
                            // "Operant" =>  Auth::user()->name,
                            "Debitfc" =>  $capitalManquant,
                            "Debit$" =>  $capitalManquant / $tauxDuJour,
                            "NomUtilisateur" => "AUTO",
                            "Libelle" => "Constatation crédit en Retard pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                            "refCompteMembre" => $dataMembre->numAdherant,
                        ]);

                        //CREDITE LE COMPTE CREDIT AUX MEMBRE
                        // Transactions::create([
                        //     "NumTransaction" => $NumTransaction,
                        //     "DateTransaction" => $dateDuJour,
                        //     "DateSaisie" => $dateDuJour,
                        //     "TypeTransaction" => "C",
                        //     "CodeMonnaie" => 2,
                        //     "CodeAgence" => "20",
                        //     "NumDossier" => "DOS00" . $numOperation->id,
                        //     "NumDemande" => "V00" . $numOperation->id,
                        //     "NumCompte" => $compteCreditAuxMembreCDF,
                        //     "NumComptecp" => $compteCreditRetard,
                        //     "Credit" =>  $capitalManquant,
                        //     // "Operant" =>  Auth::user()->name,
                        //     "Creditfc" =>  $capitalManquant,
                        //     "Credit$" =>  $capitalManquant / $tauxDuJour,
                        //     "NomUtilisateur" => "AUTO",
                        //     "Libelle" => "Constatation crédit en Retard  " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
                        //     "refCompteMembre" => $dataMembre->numAdherant,
                        // ]);

                        //RENSEIGNE LE MONTANT DANS LA TABLE REMBOURSEMENT ATTENDU

                        RemboursEttendu::create([

                            "NumCompteEpargne" => $dataMembre->NumCompteEpargne,
                            "NumCompteCredit" => $dataMembre->NumCompteCredit,
                            "montantCapit" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                            "montantInteret" => $totCapDejaPaye->totInteretRetard,
                            "CodeMonnaie" => 2,
                            "StatutPayement" => 0,
                            "DateRemboursement" => $dateDuJour,
                            "NumAbrege" => $dataMembre->numAdherant,
                        ]);
                    }
                }
                //LE CODE SUIVANT DOIT ETRE EXECUTE SEULEMENT SI LE SOLDE DU MEMBRE EST SUPERIEUR A ZERO
                if ($soldeMembreCDF->soldeCDF > 0) {
                    $capitalAmmortie = $dataMembre->CapAmmorti;
                    $interetAmortie = $dataMembre->Interet;
                    $epargneAmmortie = $dataMembre->Epargne;

                    //ICI ON VERIFIE S'IL YA PAS EU UN REMBOURSEMENT QUI N'A PAS ETE COMPLET ET QUE LE MONTANT N'A PAS ETE COMPLET
                    $checkRemboursement = Remboursementcredit::where("RefEcheance", "=", $dataMembre->ReferenceEch)->where("JoursRetard", ">", 0)->where("DateTranche", "<=", $dataMembre->DateTranch)->first();
                    if ($checkRemboursement) {

                        //SI LE MEMBRE EST EN RETARD DE REMBOURSEMENT ON VA METTRE A JOUR CE REMBOURSEMENT
                        $capitalDejaRembourse = $checkRemboursement->CapitalPaye;
                        $interetDejaRembourse = $checkRemboursement->InteretPaye;
                        $epagneDejaRembourse = $checkRemboursement->EpargnePaye;
                        $epargneManquant = $epargneAmmortie - $epagneDejaRembourse;
                        $capitalManquant = $capitalAmmortie - $capitalDejaRembourse;
                        $interetManquant = $interetAmortie - $interetDejaRembourse;
                        $soldeDuMembreCDF = $soldeMembreCDF->soldeCDF;
                        $capitalAccorde = $dataMembre->MontantAccorde;
                        //ON VERIFIE SI LE SOLDE ACTUEL DU MEMBRE EST SUPERIEUR OU EGALE AU CREDIT QUI'IL DETIEN EN CAPITAL + L'INTERET
                        if ($soldeDuMembreCDF >= ($capitalManquant + $interetManquant + $epargneAmmortie))
                        //PUIS ON VA EFFECTUER UN REMBOURSEMENT EN METANT A JOUR CETTE LIGNE
                        {
                            Remboursementcredit::where("RefEcheance", "=", $dataMembre->ReferenceEch)
                                ->where("DateTranche", "=", $dataMembre->DateTranch)->update([
                                    "CapitalPaye" => $capitalDejaRembourse + $capitalManquant,
                                    "InteretPaye" => $interetDejaRembourse + $interetManquant,
                                    "EpargnePaye" => $epagneDejaRembourse + $epargneManquant,
                                    "JoursRetard" => 0,
                                ]);
                            // RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE
                            $totCapDejaPaye = Remboursementcredit::select(
                                DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                            )->where("remboursementcredits.NumDossie", "=", $dataMembre->NumDossier)
                                ->groupBy("remboursementcredits.NumDossie")
                                ->first();
                            //PUIS ON MET A JOUR LE PORTE FEUILLE DE CREDIT
                            $capRestant =  $capitalAccorde - $totCapDejaPaye->totCapitalPaye;
                            Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                "CapitalRestant" => $capRestant,
                                "InteretRetardEchu" => 0,
                                "CapitalRetard" => 0,
                                "Retard1" => 0,
                                "Retard2" => 0,
                                "Retard3" => 0,
                                "Retard4" => 0,
                                "Retard5" => 0,
                                "JourRetard" => 0,
                            ]);
                            //MET A JOUR LA TABLE REMBOURSEMENT ATTENTU

                            RemboursEttendu::where("NumCompteEpargne", "=", $dataMembre->NumCompteEpargne)->update([
                                "StatutPayement" => 1,
                            ]);

                            //PUIS PASSE LE ECRITURE DE DEBIT SUR LE COMPTE DU MEMBRE
                            //PUIS CONSTATE LE PAYEMENT SUR CREDIT EN RETARD 
                            //CREDITE LE COMPTE CREDIT EN RETARD 39
                            $compteCreditRetard = "390000000202";
                            Transactions::create([
                                "NumTransaction" => $NumTransaction,
                                "DateTransaction" => $dateDuJour,
                                "DateSaisie" => $dateDuJour,
                                "TypeTransaction" => "D",
                                "CodeMonnaie" => 2,
                                "CodeAgence" => "20",
                                "NumDossier" => "DOS00" . $numOperation->id,
                                "NumDemande" => "V00" . $numOperation->id,
                                "NumCompte" => $compteCreditRetard,
                                "NumComptecp" => $compteCreditAuxMembreCDF,
                                "Debit" =>  $capitalManquant,
                                //"Operant" =>  Auth::user()->name,
                                "Debitfc" =>  $capitalManquant,
                                "Debit$" =>  $capitalManquant / $tauxDuJour,
                                "NomUtilisateur" => "AUTO",
                                "Libelle" => "Constatation crédit en Retard  pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                "refCompteMembre" => $dataMembre->numAdherant,
                            ]);

                            //DEBITE LE COMPTE EPARGNE DU MEMBRE (REMBOURSEMENT EN CAPITAL)
                            Transactions::create([
                                "NumTransaction" => $NumTransaction,
                                "DateTransaction" => $dateDuJour,
                                "DateSaisie" => $dateDuJour,
                                "TypeTransaction" => "C",
                                "CodeMonnaie" => 2,
                                "CodeAgence" => "20",
                                "NumDossier" => "DOS00" . $numOperation->id,
                                "NumDemande" => "V00" . $numOperation->id,
                                "NumCompte" => $compteCreditAuxMembreCDF,
                                "NumComptecp" => $dataMembre->NumCompteCredit,
                                "Debit" =>  $capitalManquant,
                                // "Operant" =>  Auth::user()->name,
                                "Debitfc" =>  $capitalManquant,
                                "Debit$" =>  $capitalManquant / $tauxDuJour,
                                "NomUtilisateur" => "AUTO",
                                "Libelle" => "Constatation crédit en Retard  pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                "refCompteMembre" => $dataMembre->numAdherant,
                            ]);
                            //CREDITE SON COMPTE CREDIT
                            // Transactions::create([
                            //     "NumTransaction" => $NumTransaction,
                            //     "DateTransaction" => $dateDuJour,
                            //     "DateSaisie" => $dateDuJour,
                            //     "TypeTransaction" => "C",
                            //     "CodeMonnaie" => 2,
                            //     "CodeAgence" => "20",
                            //     "NumDossier" => "DOS00" . $numOperation->id,
                            //     "NumDemande" => "V00" . $numOperation->id,
                            //     "NumCompte" => $dataMembre->NumCompteCredit,
                            //     "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                            //     "Credit" =>  $capitalManquant,
                            //     // "Operant" =>  Auth::user()->name,
                            //     "Creditfc" =>  $capitalManquant,
                            //     "Credit$" =>  $capitalManquant / $tauxDuJour,
                            //     "NomUtilisateur" => "AUTO",
                            //     "Libelle" => "Remboursement capital  de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                            //     "refCompteMembre" => $dataMembre->numAdherant,
                            // ]);


                            //PUIS CONSTATE LE PAIEMENT SUR LA TABLE ECHEANCIER
                            Echeancier::where("echeanciers.ReferenceEch", "=", $dataMembre->ReferenceEch)
                                ->update([
                                    "statutPayement" => "1",
                                    "posted" => "1",
                                ]);


                            //EMBOURSEMENT EN INTERET
                            if ($interetManquant > 0) {

                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "D",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembre->NumCompteEpargne,
                                    "NumComptecp" => $dataMembre->NumCompteCredit,
                                    "Debit" =>  $interetManquant,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debitfc" =>  $interetManquant,
                                    "Debit$" =>  $interetManquant / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement intérêt de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);

                                //CREDITE SON COMPTE CREDIT
                                // Transactions::create([
                                //     "NumTransaction" => $NumTransaction,
                                //     "DateTransaction" => $dateDuJour,
                                //     "DateSaisie" => $dateDuJour,
                                //     "TypeTransaction" => "C",
                                //     "CodeMonnaie" => 2,
                                //     "CodeAgence" => "20",
                                //     "NumDossier" => "DOS00" . $numOperation->id,
                                //     "NumDemande" => "V00" . $numOperation->id,
                                //     "NumCompte" => $dataMembre->NumCompteCredit,
                                //     "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                //     "Credit" =>  $interetManquant,
                                //     // "Operant" =>  Auth::user()->name,
                                //     "Creditfc" =>  $interetManquant,
                                //     "Credit$" =>  $interetManquant / $tauxDuJour,
                                //     "NomUtilisateur" => "AUTO",
                                //     "Libelle" => "Remboursement intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
                                //     "refCompteMembre" => $dataMembre->numAdherant,
                                // ]);

                                //CREDITE LE COMPTE INTERET
                                $compteInteret = "712000000202";
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "C",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" =>  $compteInteret,
                                    "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                    "Credit" =>  $interetManquant,
                                    // "Operant" =>  Auth::user()->name,
                                    "Creditfc" =>  $interetManquant,
                                    "Credit$" =>  $interetManquant / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement intérêt du crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);
                            }


                            //REMBOURSEMENT EPARGNE GARANTIE
                            if ($epargneManquant > 0) {


                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "D",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembre->NumCompteEpargne,
                                    "NumComptecp" => $dataMembre->NumCompteEpargneGarantie,
                                    "Debit" => $epargneManquant,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debitfc" =>  $epargneManquant,
                                    "Debit$" =>  $epargneManquant / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement epargne garantie de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);

                                //CREDITE SON COMPTE EPARGNE GARANTIE
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "C",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembre->NumCompteEpargneGarantie,
                                    "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                    "Credit" =>  $epargneManquant,
                                    // "Operant" =>  Auth::user()->name,
                                    "Creditfc" =>  $epargneManquant,
                                    "Credit$" =>  $epargneManquant / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement Epargne garantie de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);
                            }







                            //SINON SI LE SOLDE DU MEMBRE EST INFERIEUR A LA DETTE QU'IL DOIT CAD INTERE + CAPITAL 
                            //ON PREND LE CAPITAL ET CE QUI RESTE ON LE MET EN INTERET MET IL RESTE EN RETARD
                        } else if ($soldeDuMembreCDF < ($capitalManquant + $interetManquant)) {
                            //ON VERIFIE SI LE SOLDE DU MEMBRE EST EGAL AU CAPITAL QU'IL DOIT
                            if ($soldeDuMembreCDF == $capitalManquant) {
                                $capitalManquant = $soldeDuMembreCDF;
                                //PUIS PASSE LE ECRITURE DE DEBIT SUR LE COMPTE DU MEMBRE
                                //DEBITE LE COMPTE EPARGNE DU MEMBRE (REMBOURSEMENT EN CAPITAL)

                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "D",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembre->NumCompteEpargne,
                                    "NumComptecp" => $dataMembre->NumCompteCredit,
                                    "Debit" =>  $capitalManquant,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debitfc" =>  $capitalManquant,
                                    "Debit$" =>  $capitalManquant / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);

                                //CREDITE SON COMPTE CREDIT
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "C",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembre->NumCompteCredit,
                                    "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                    "Credit" =>  $capitalManquant,
                                    // "Operant" =>  Auth::user()->name,
                                    "Creditfc" =>  $capitalManquant,
                                    "Credit$" =>  $capitalManquant / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital  de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);

                                //CREDITE LE  COMPTE CREDIT PRINCIPALE
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "C",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $compteCreditAuxMembreCDF,
                                    "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                    "Credit" =>  $capitalManquant,
                                    // "Operant" =>  Auth::user()->name,
                                    "Creditfc" =>  $capitalManquant,
                                    "Credit$" =>  $capitalManquant / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital  de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $compteCreditAuxMembreCDF,
                                ]);


                                Remboursementcredit::where("RefEcheance", "=", $dataMembre->ReferenceEch)->update([
                                    "CapitalPaye" => $capitalDejaRembourse + $capitalManquant,
                                    // "InteretPaye" => $interetDejaRembourse + $interetManquant,
                                    "JoursRetard" => $checkRemboursement->JoursRetard + 1,
                                ]);
                                // RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE ET LE TOT DU CAPITAL EN RETARD
                                $totCapDejaPaye = Remboursementcredit::select(
                                    DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                    DB::raw("SUM(remboursementcredits.CapitalAmmortie)-SUM(remboursementcredits.CapitalPaye) as totCaptRetard"),
                                    DB::raw("SUM(remboursementcredits.InteretAmmorti)-SUM(remboursementcredits.InteretPaye) as totInteretRetard")
                                )->where("remboursementcredits.NumDossie", "=", $dataMembre->NumDossier)
                                    ->groupBy("remboursementcredits.NumDossie")
                                    ->first();

                                //RECUPERE ICI LE JOUR DE RETARD QUE LE MEMBRE A 
                                $JourRetard = Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)
                                    ->where("Cloture", "=", 0)->first()->JourRetard;
                                //PUIS ON MET A JOUR LE PORTE FEUILLE DE CREDIT
                                $capRestant =  $capitalAccorde - $totCapDejaPaye->totCapitalPaye;
                                if ($JourRetard <= 30) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard1" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 30 and $JourRetard <= 60) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard2" => 0,
                                        "Retard2" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 60 and $JourRetard <= 90) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard2" => 0,
                                        "Retard3" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 90 and $JourRetard <= 180) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard3" => 0,
                                        "Retard4" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                }
                                //SINON SI LE SOLDE DU MEMBRE EST SUPERIEUR AU CAPITAL AMORTI QU'IL DOIT
                            } else if ($soldeDuMembreCDF > $capitalManquant) {
                                $capitalApaye = $soldeDuMembreCDF - $capitalManquant;
                                $interetApayer = $soldeDuMembreCDF - $capitalApaye;
                                //DEBITE LE COMPTE EPARGNE DU MEMBRE (REMBOURSEMENT EN CAPITAL)

                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "D",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembre->NumCompteEpargne,
                                    "NumComptecp" => $dataMembre->NumCompteCredit,
                                    "Debit" =>  $capitalApaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debitfc" =>  $capitalApaye,
                                    "Debit$" =>  $capitalApaye / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);

                                //CREDITE SON COMPTE CREDIT
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "C",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembre->NumCompteCredit,
                                    "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                    "Credit" =>  $capitalApaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Creditfc" =>  $capitalApaye,
                                    "Credit$" =>  $capitalApaye / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital  de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);

                                //CREDITE  COMPTE CREDIT PRINCIPAL
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "C",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembre->NumCompteCredit,
                                    "NumComptecp" =>  $compteCreditAuxMembreCDF,
                                    "Credit" =>  $capitalApaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Creditfc" =>  $capitalApaye,
                                    "Credit$" =>  $capitalApaye / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital  de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $compteCreditAuxMembreCDF,
                                ]);

                                //DEBITE LE COMPTE CREDIT EN RETARD 39
                                $compteCreditRetard = "390000000202";
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "C",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $compteCreditRetard,
                                    "NumComptecp" => $compteCreditAuxMembreCDF,
                                    "Credit" =>  $capitalManquant,
                                    "Creditfc" =>  $capitalManquant,
                                    "Credit$" =>  $capitalManquant / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement crédit en Retard  pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);


                                //EMBOURSEMENT EN INTERET
                                if ($interetApayer > 0) {


                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "D",
                                        "CodeMonnaie" => 2,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $dataMembre->NumCompteEpargne,
                                        "NumComptecp" => $dataMembre->NumCompteCredit,
                                        "Debit" =>  $interetApayer,
                                        // "Operant" =>  Auth::user()->name,
                                        "Debitfc" =>  $interetApayer,
                                        "Debit$" =>  $interetApayer / $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement partiel intérêt de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                        "refCompteMembre" => $dataMembre->numAdherant,
                                    ]);

                                    //CREDITE SON COMPTE CREDIT
                                    // Transactions::create([
                                    //     "NumTransaction" => $NumTransaction,
                                    //     "DateTransaction" => $dateDuJour,
                                    //     "DateSaisie" => $dateDuJour,
                                    //     "TypeTransaction" => "C",
                                    //     "CodeMonnaie" => 2,
                                    //     "CodeAgence" => "20",
                                    //     "NumDossier" => "DOS00" . $numOperation->id,
                                    //     "NumDemande" => "V00" . $numOperation->id,
                                    //     "NumCompte" => $dataMembre->NumCompteCredit,
                                    //     "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                    //     "Credit" =>  $interetApayer,
                                    //     // "Operant" =>  Auth::user()->name,
                                    //     "Creditfc" =>  $interetApayer,
                                    //     "Credit$" => $interetApayer / $tauxDuJour,
                                    //     "NomUtilisateur" => "AUTO",
                                    //     "Libelle" => "Remboursement partiel intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
                                    //     "refCompteMembre" => $dataMembre->numAdherant,
                                    // ]);




                                    $compteInteret = "712000000202";
                                    //CREDITE LE COMPTE INTERET
                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "C",
                                        "CodeMonnaie" => 2,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $compteInteret,
                                        "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                        "Credit" =>  $interetApayer,
                                        // "Operant" =>  Auth::user()->name,
                                        "Creditfc" =>  $interetApayer,
                                        "Credit$" => $interetApayer / $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement intérêt du crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                        "refCompteMembre" => $dataMembre->numAdherant,
                                    ]);
                                }

                                Remboursementcredit::where("RefEcheance", "=", $dataMembre->ReferenceEch)->update([
                                    "CapitalPaye" => $capitalDejaRembourse + $capitalApaye,
                                    "InteretPaye" => $interetDejaRembourse + $interetApayer,
                                    "JoursRetard" => $checkRemboursement->JoursRetard + 1,
                                ]);
                                // RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE ET LE TOT DU CAPITAL EN RETARD
                                $totCapDejaPaye = Remboursementcredit::select(
                                    DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                    DB::raw("SUM(remboursementcredits.CapitalAmmortie)-SUM(remboursementcredits.CapitalPaye) as totCaptRetard"),
                                    DB::raw("SUM(remboursementcredits.InteretAmmorti)-SUM(remboursementcredits.InteretPaye) as totInteretRetard")
                                )->where("remboursementcredits.NumDossie", "=", $dataMembre->NumDossier)
                                    ->groupBy("remboursementcredits.NumDossie")
                                    ->first();

                                //RECUPERE ICI LE JOUR DE RETARD QUE LE MEMBRE A 
                                $JourRetard = Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)
                                    ->where("Cloture", "=", 0)->first()->JourRetard;
                                //PUIS ON MET A JOUR LE PORTE FEUILLE DE CREDIT
                                $capRestant =  $capitalAccorde - $totCapDejaPaye->totCapitalPaye;
                                if ($JourRetard <= 30) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard1" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 30 and $JourRetard <= 60) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard2" => 0,
                                        "Retard2" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 60 and $JourRetard <= 90) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard2" => 0,
                                        "Retard3" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 90 and $JourRetard <= 180) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard3" => 0,
                                        "Retard4" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                }
                            }
                            //SINON SI LE MONTANT A REMBOURSER EST INFERIEUR AU CAPITAL QUE LE MEMBRE DOIT
                            //CELA SIGNIFIE QU'UNE PARTIE DU CAPITAL EST D'INTERET RESTE EN RETARD

                        } else if ($soldeDuMembreCDF < $capitalManquant) {
                            $capitalApayer = $soldeDuMembreCDF;
                            //DEBITE LE COMPTE EPARGNE DU MEMBRE (REMBOURSEMENT EN CAPITAL)

                            Transactions::create([
                                "NumTransaction" => $NumTransaction,
                                "DateTransaction" => $dateDuJour,
                                "DateSaisie" => $dateDuJour,
                                "TypeTransaction" => "D",
                                "CodeMonnaie" => 2,
                                "CodeAgence" => "20",
                                "NumDossier" => "DOS00" . $numOperation->id,
                                "NumDemande" => "V00" . $numOperation->id,
                                "NumCompte" => $dataMembre->NumCompteEpargne,
                                "NumComptecp" => $dataMembre->NumCompteCredit,
                                "Debit" =>  $capitalApayer,
                                // "Operant" =>  Auth::user()->name,
                                "Debitfc" =>  $capitalApayer,
                                "Debit$" =>  $capitalApayer / $tauxDuJour,
                                "NomUtilisateur" => "AUTO",
                                "Libelle" => "Remboursement partiel capital de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                "refCompteMembre" => $dataMembre->numAdherant,
                            ]);

                            //CREDITE SON COMPTE CREDIT
                            // Transactions::create([
                            //     "NumTransaction" => $NumTransaction,
                            //     "DateTransaction" => $dateDuJour,
                            //     "DateSaisie" => $dateDuJour,
                            //     "TypeTransaction" => "C",
                            //     "CodeMonnaie" => 2,
                            //     "CodeAgence" => "20",
                            //     "NumDossier" => "DOS00" . $numOperation->id,
                            //     "NumDemande" => "V00" . $numOperation->id,
                            //     "NumCompte" => $dataMembre->NumCompteCredit,
                            //     "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                            //     "Credit" =>  $capitalApayer,
                            //     // "Operant" =>  Auth::user()->name,
                            //     "Creditfc" => $capitalApayer,
                            //     "Credit$" => $capitalApayer / $tauxDuJour,
                            //     "NomUtilisateur" => "AUTO",
                            //     "Libelle" => "Remboursement partiel capital  de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                            //     "refCompteMembre" => $dataMembre->numAdherant,
                            // ]);

                            //CREDITE LE COMPTE CREDIT PRINCIPAL
                            Transactions::create([
                                "NumTransaction" => $NumTransaction,
                                "DateTransaction" => $dateDuJour,
                                "DateSaisie" => $dateDuJour,
                                "TypeTransaction" => "C",
                                "CodeMonnaie" => 2,
                                "CodeAgence" => "20",
                                "NumDossier" => "DOS00" . $numOperation->id,
                                "NumDemande" => "V00" . $numOperation->id,
                                "NumCompte" => $compteCreditAuxMembreCDF,
                                "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                "Credit" =>  $capitalApayer,
                                // "Operant" =>  Auth::user()->name,
                                "Creditfc" => $capitalApayer,
                                "Credit$" => $capitalApayer / $tauxDuJour,
                                "NomUtilisateur" => "AUTO",
                                "Libelle" => "Remboursement partiel capital  de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                "refCompteMembre" => $compteCreditAuxMembreCDF,
                            ]);


                            //DEBITE LE COMPTE CREDIT EN RETARD 39
                            $compteCreditRetard = "390000000202";
                            Transactions::create([
                                "NumTransaction" => $NumTransaction,
                                "DateTransaction" => $dateDuJour,
                                "DateSaisie" => $dateDuJour,
                                "TypeTransaction" => "D",
                                "CodeMonnaie" => 2,
                                "CodeAgence" => "20",
                                "NumDossier" => "DOS00" . $numOperation->id,
                                "NumDemande" => "V00" . $numOperation->id,
                                "NumCompte" => $compteCreditRetard,
                                "NumComptecp" => $compteCreditAuxMembreCDF,
                                "Debit" =>  $capitalManquant,
                                "Debitfc" =>  $capitalManquant,
                                "Debit$" =>  $capitalManquant / $tauxDuJour,
                                "NomUtilisateur" => "AUTO",
                                "Libelle" => "Constatation crédit en Retard  pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                "refCompteMembre" => $dataMembre->numAdherant,
                            ]);

                            Remboursementcredit::where("RefEcheance", "=", $dataMembre->ReferenceEch)->update([
                                "CapitalPaye" => $capitalDejaRembourse + $capitalApayer,
                                "JoursRetard" => $checkRemboursement->JoursRetard + 1,
                            ]);
                            // RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE ET LE TOT DU CAPITAL EN RETARD
                            $totCapDejaPaye = Remboursementcredit::select(
                                DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                DB::raw("SUM(remboursementcredits.CapitalAmmortie)-SUM(remboursementcredits.CapitalPaye) as totCaptRetard"),
                                DB::raw("SUM(remboursementcredits.InteretAmmorti)-SUM(remboursementcredits.InteretPaye) as totInteretRetard")
                            )->where("remboursementcredits.NumDossie", "=", $dataMembre->NumDossier)
                                ->groupBy("remboursementcredits.NumDossie")
                                ->first();

                            //RECUPERE ICI LE JOUR DE RETARD QUE LE MEMBRE A 
                            $JourRetard = Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)
                                ->where("Cloture", "=", 0)->first()->JourRetard;
                            //PUIS ON MET A JOUR LE PORTE FEUILLE DE CREDIT
                            $capRestant =  $capitalAccorde - $totCapDejaPaye->totCapitalPaye;
                            if ($JourRetard <= 30) {
                                Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                    "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                    "CapitalRestant" => $capRestant,
                                    "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                    "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    "Retard1" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                ]);
                            } else if ($JourRetard > 30 and $JourRetard <= 60) {
                                Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                    "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                    "CapitalRestant" => $capRestant,
                                    "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                    "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    "Retard2" => 0,
                                    "Retard2" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                ]);
                            } else if ($JourRetard > 60 and $JourRetard <= 90) {
                                Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                    "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                    "CapitalRestant" => $capRestant,
                                    "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                    "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    "Retard2" => 0,
                                    "Retard3" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                ]);
                            } else if ($JourRetard > 90 and $JourRetard <= 180) {
                                Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                    "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                    "CapitalRestant" => $capRestant,
                                    "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                    "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    "Retard3" => 0,
                                    "Retard4" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                ]);
                            }
                        }
                    } else {

                        //ICI LA LOGIQUE DE SI LE MEMBRE N'ETAIT PAS EN RETARD DE REMBOURSEMENT
                        $soldeDuMembreCDF = $soldeMembreCDF->soldeCDF;
                        $capitalAmmorti = $dataMembre->CapAmmorti;
                        $interetAmorti = $dataMembre->Interet;
                        $capitalPaye = $capitalAmmorti;
                        $interetPaye = $interetAmorti;
                        $epargneGarantieAmmortie = $dataMembre->Epargne;
                        $EpargnePaye = $epargneGarantieAmmortie;
                        $capitalAccorde = $dataMembre->MontantAccorde;
                        // dd($capitalPaye);
                        //SI LE SOLDE DU MEMBRE COUVRE SA DETTE POUR CETTE TRANCHE CAD CAPITAL AMORTI + INTERET AMORTI
                        if ($soldeDuMembreCDF >= ($capitalAmmortie + $interetAmortie + $epargneGarantieAmmortie)) {

                            //ON EFFECTUE LE REMBOURSEMENT
                            Remboursementcredit::create([
                                "RefEcheance" => $dataMembre->ReferenceEch,
                                "NumCompte" => $dataMembre->NumCompteEpargne,
                                "NumCompteCredit" => $dataMembre->NumCompteCredit,
                                "NumDossie" => $dataMembre->NumDossier,
                                "RefTypCredit" => $dataMembre->RefTypeCredit,
                                "NomCompte" => $dataMembre->NomCompte,
                                "DateTranche" => $dataMembre->DateTranch,
                                "CapitalAmmortie" => $capitalAmmorti,
                                "CapitalPaye"  => $capitalPaye,
                                "InteretAmmorti" => $interetAmorti,
                                "InteretPaye" => $interetPaye,
                                "EpargneAmmorti" => $epargneGarantieAmmortie,
                                "EpargnePaye" => $EpargnePaye,
                                "CodeGuichet" => $dataMembre->CodeGuichet,
                                "NumAdherent" => $dataMembre->numAdherant,
                            ]);

                            // RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE
                            $totCapDejaPaye = Remboursementcredit::select(
                                DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                            )->where("remboursementcredits.NumDossie", "=", $dataMembre->NumDossier)
                                ->groupBy("remboursementcredits.NumDossie")
                                ->first();
                            //PUIS ON MET A JOUR LE PORTE FEUILLE DE CREDIT
                            $capRestant =  $capitalAccorde - $totCapDejaPaye->totCapitalPaye;
                            Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                "CapitalRestant" => $capRestant,
                                "Retard1" => 0,
                                "Retard2" => 0,
                                "Retard3" => 0,
                                "Retard4" => 0,
                                "Retard5" => 0,
                                "JourRetard" => 0,
                            ]);

                            //PUIS PASSE LE ECRITURE DE DEBIT SUR LE COMPTE DU MEMBRE

                            //DEBITE LE COMPTE EPARGNE DU MEMBRE (REMBOURSEMENT EN CAPITAL)

                            Transactions::create([
                                "NumTransaction" => $NumTransaction,
                                "DateTransaction" => $dateDuJour,
                                "DateSaisie" => $dateDuJour,
                                "TypeTransaction" => "D",
                                "CodeMonnaie" => 2,
                                "CodeAgence" => "20",
                                "NumDossier" => "DOS00" . $numOperation->id,
                                "NumDemande" => "V00" . $numOperation->id,
                                "NumCompte" => $dataMembre->NumCompteEpargne,
                                "NumComptecp" => $dataMembre->NumCompteCredit,
                                "Debit" =>  $capitalPaye,
                                // "Operant" =>  Auth::user()->name,
                                "Debitfc" =>  $capitalPaye,
                                "Debit$" => $capitalPaye / $tauxDuJour,
                                "NomUtilisateur" => "AUTO",
                                "Libelle" => "Remboursement capital de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                "refCompteMembre" => $dataMembre->numAdherant,
                            ]);

                            //CREDITE SON COMPTE CREDIT
                            Transactions::create([
                                "NumTransaction" => $NumTransaction,
                                "DateTransaction" => $dateDuJour,
                                "DateSaisie" => $dateDuJour,
                                "TypeTransaction" => "C",
                                "CodeMonnaie" => 2,
                                "CodeAgence" => "20",
                                "NumDossier" => "DOS00" . $numOperation->id,
                                "NumDemande" => "V00" . $numOperation->id,
                                "NumCompte" => $dataMembre->NumCompteCredit,
                                "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                "Credit" =>  $capitalPaye,
                                // "Operant" =>  Auth::user()->name,
                                "Creditfc" =>  $capitalPaye,
                                "Credit$" =>  $capitalPaye / $tauxDuJour,
                                "NomUtilisateur" => "AUTO",
                                "Libelle" => "Remboursement capital  de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                "refCompteMembre" => $dataMembre->numAdherant,
                            ]);

                            //CREDITE LE CREDIT COMPTE PRINCIPAL
                            Transactions::create([
                                "NumTransaction" => $NumTransaction,
                                "DateTransaction" => $dateDuJour,
                                "DateSaisie" => $dateDuJour,
                                "TypeTransaction" => "C",
                                "CodeMonnaie" => 2,
                                "CodeAgence" => "20",
                                "NumDossier" => "DOS00" . $numOperation->id,
                                "NumDemande" => "V00" . $numOperation->id,
                                "NumCompte" => $compteCreditAuxMembreCDF,
                                "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                "Credit" =>  $capitalPaye,
                                // "Operant" =>  Auth::user()->name,
                                "Creditfc" =>  $capitalPaye,
                                "Credit$" =>  $capitalPaye / $tauxDuJour,
                                "NomUtilisateur" => "AUTO",
                                "Libelle" => "Remboursement capital  de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                "refCompteMembre" => $compteCreditAuxMembreCDF,
                            ]);
                            if ($interetPaye > 0) {


                                //EMBOURSEMENT EN INTERET
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "D",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembre->NumCompteEpargne,
                                    "NumComptecp" => $dataMembre->NumCompteCredit,
                                    "Debit" =>  $interetPaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debitfc" =>  $interetPaye,
                                    "Debit$" =>  $interetPaye / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement intérêt de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);

                                //CREDITE SON COMPTE CREDIT
                                // Transactions::create([
                                //     "NumTransaction" => $NumTransaction,
                                //     "DateTransaction" => $dateDuJour,
                                //     "DateSaisie" => $dateDuJour,
                                //     "TypeTransaction" => "C",
                                //     "CodeMonnaie" => 2,
                                //     "CodeAgence" => "20",
                                //     "NumDossier" => "DOS00" . $numOperation->id,
                                //     "NumDemande" => "V00" . $numOperation->id,
                                //     "NumCompte" => $dataMembre->NumCompteCredit,
                                //     "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                //     "Credit" =>  $interetPaye,
                                //     // "Operant" =>  Auth::user()->name,
                                //     "Creditfc" =>  $interetPaye,
                                //     "Credit$" => $interetPaye / $tauxDuJour,
                                //     "NomUtilisateur" => "AUTO",
                                //     "Libelle" => "Remboursement intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
                                //     "refCompteMembre" => $dataMembre->numAdherant,
                                // ]);




                                //CREDITE LE COMPTE INTERET
                                $compteInteret = "712000000202";
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "C",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $compteInteret,
                                    "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                    "Credit" =>  $interetPaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Creditfc" =>  $interetPaye,
                                    "Credit$" => $interetPaye / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement intérêt du crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);
                            }
                            //REMBOURSE L'EPARGNE PROGRESSIVE
                            if ($epargneGarantieAmmortie > 0) {


                                //EMBOURSEMENT EN INTERET
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "D",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembre->NumCompteEpargne,
                                    "NumComptecp" => $dataMembre->NumCompteEpargneGarantie,
                                    "Debit" =>  $EpargnePaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debitfc" =>  $EpargnePaye,
                                    "Debit$" =>  $EpargnePaye / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement Epargne garantie de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);

                                //CREDITE SON COMPTE EPARGNE GARANTIE
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "C",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembre->NumCompteEpargneGarantie,
                                    "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                    "Credit" => $EpargnePaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Creditfc" =>  $EpargnePaye,
                                    "Credit$" => $EpargnePaye / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement Epargne garantie de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);
                            }


                            //PUIS CONSTATE LE PAIEMENT SUR LA TABLE ECHEANCIER

                            Echeancier::where("echeanciers.ReferenceEch", "=", $dataMembre->ReferenceEch)
                                ->update([
                                    "statutPayement" => "1",
                                    "posted" => "1",
                                ]);

                            //SINON SI LE SOLDE DU MEMBRE EST INFERIEUR AU CAPITAL AMMORTI + INTERET AMMORTI

                        } else if ($soldeDuMembreCDF < ($capitalAmmortie + $interetAmortie)) {
                            //SI  LE SOLDE DU MEMBRE EST EGAL AU CAPITAL QUI'IL DOIT
                            if ($soldeDuMembreCDF == $capitalAmmortie) {
                                $capitalApayer = $soldeDuMembreCDF;

                                //DEBITE LE COMPTE EPARGNE DU MEMBRE (REMBOURSEMENT EN CAPITAL)

                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "D",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembre->NumCompteEpargne,
                                    "NumComptecp" => $dataMembre->NumCompteCredit,
                                    "Debit" =>  $capitalApayer,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debitfc" =>  $capitalApayer,
                                    "Debit$" =>  $capitalApayer / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement partiel capital de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);

                                //CREDITE SON COMPTE CREDIT
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "C",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembre->NumCompteCredit,
                                    "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                    "Credit" =>  $capitalApayer,
                                    // "Operant" =>  Auth::user()->name,
                                    "Creditfc" => $capitalApayer,
                                    "Credit$" => $capitalApayer / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement partiel capital  de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);
                                //CREDITE LE COMPTE CREDIT PRINCIPAL
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "C",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $compteCreditAuxMembreCDF,
                                    "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                    "Credit" =>  $capitalApayer,
                                    // "Operant" =>  Auth::user()->name,
                                    "Creditfc" => $capitalApayer,
                                    "Credit$" => $capitalApayer / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement partiel capital  de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $compteCreditAuxMembreCDF,
                                ]);

                                //ON EFFECTUE LE REMBOURSEMENT EN CAPITAL UNIQUEMENT
                                //Verifie d'abord s'il y'a pas eu un remboursement qui n'a pas été complet
                                $CheckIfDateExist = Remboursementcredit::where("DateTranche", "=", $dataMembre->DateTranch)
                                    ->where("RefEcheance", "=", $dataMembre->ReferenceEch)->first();
                                if (!$CheckIfDateExist) {
                                    Remboursementcredit::create([
                                        "RefEcheance" => $dataMembre->ReferenceEch,
                                        "NumCompte" => $dataMembre->NumCompteEpargne,
                                        "NumCompteCredit" => $dataMembre->NumCompteCredit,
                                        "NumDossie" => $dataMembre->NumDossier,
                                        "RefTypCredit" => $dataMembre->RefTypeCredit,
                                        "NomCompte" => $dataMembre->NomCompte,
                                        "DateTranche" => $dataMembre->DateTranch,
                                        "CapitalAmmortie" => $capitalAmmorti,
                                        "CapitalPaye"  => $capitalApayer,
                                        "InteretAmmorti" => $interetAmorti,
                                        "CodeGuichet" => $dataMembre->CodeGuichet,
                                        "NumAdherent" => $dataMembre->numAdherant,
                                    ]);
                                } else {
                                    Remboursementcredit::where("DateTranche", "=", $dataMembre->DateTranch)
                                        ->where("RefEcheance", "=", $dataMembre->ReferenceEch)->update([
                                            "RefEcheance" => $dataMembre->ReferenceEch,
                                            "NumCompte" => $dataMembre->NumCompteEpargne,
                                            "NumCompteCredit" => $dataMembre->NumCompteCredit,
                                            "NumDossie" => $dataMembre->NumDossier,
                                            "RefTypCredit" => $dataMembre->RefTypeCredit,
                                            "NomCompte" => $dataMembre->NomCompte,
                                            "DateTranche" => $dataMembre->DateTranch,
                                            "CapitalAmmortie" => $capitalAmmorti,
                                            "CapitalPaye"  => $capitalApayer,
                                            "InteretAmmorti" => $interetAmorti,
                                            "CodeGuichet" => $dataMembre->CodeGuichet,
                                            "NumAdherent" => $dataMembre->numAdherant,
                                        ]);
                                }


                                // RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE ET LE TOT DU CAPITAL EN RETARD
                                $totCapDejaPaye = Remboursementcredit::select(
                                    DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                    DB::raw("SUM(remboursementcredits.CapitalAmmortie)-SUM(remboursementcredits.CapitalPaye) as totCaptRetard"),
                                    DB::raw("SUM(remboursementcredits.InteretAmmorti)-SUM(remboursementcredits.InteretPaye) as totInteretRetard")
                                )->where("remboursementcredits.NumDossie", "=", $dataMembre->NumDossier)
                                    ->groupBy("remboursementcredits.NumDossie")
                                    ->first();

                                //RECUPERE ICI LE JOUR DE RETARD QUE LE MEMBRE A 
                                $JourRetard = Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)
                                    ->where("Cloture", "=", 0)->first()->JourRetard;
                                //PUIS ON MET A JOUR LE PORTE FEUILLE DE CREDIT
                                $capRestant =  $capitalAccorde - $totCapDejaPaye->totCapitalPaye;
                                if ($JourRetard <= 30) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard1" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 30 and $JourRetard <= 60) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard2" => 0,
                                        "Retard2" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 60 and $JourRetard <= 90) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard2" => 0,
                                        "Retard3" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 90 and $JourRetard <= 180) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard3" => 0,
                                        "Retard4" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                }
                            } else if ($soldeDuMembreCDF > $capitalAmmorti) {
                                $capitalApaye = $soldeDuMembreCDF - $capitalAmmorti;
                                $interetApayer = $soldeDuMembreCDF - $capitalApaye;

                                //DEBITE LE COMPTE EPARGNE DU MEMBRE (REMBOURSEMENT EN CAPITAL)

                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "D",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembre->NumCompteEpargne,
                                    "NumComptecp" => $dataMembre->NumCompteCredit,
                                    "Debit" =>  $capitalApaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debitfc" =>  $capitalApaye,
                                    "Debit$" =>  $capitalApaye / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);

                                //CREDITE SON COMPTE CREDIT
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "C",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembre->NumCompteCredit,
                                    "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                    "Credit" =>  $capitalApaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debitfc" =>  $capitalApaye,
                                    "Debit$" =>  $capitalApaye / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital  de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);

                                //CREDITE LE COMPTE CREDIT PRINCIPAL
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "C",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $compteCreditAuxMembreCDF,
                                    "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                    "Credit" =>  $capitalApaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debitfc" =>  $capitalApaye,
                                    "Debit$" =>  $capitalApaye / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital  de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $compteCreditAuxMembreCDF,
                                ]);
                                if ($interetApayer > 0) {


                                    //EMBOURSEMENT EN INTERET
                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "D",
                                        "CodeMonnaie" => 2,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $dataMembre->NumCompteEpargne,
                                        "NumComptecp" => $dataMembre->NumCompteCredit,
                                        "Debit" =>  $interetApayer,
                                        // "Operant" =>  Auth::user()->name,
                                        "Debitfc" =>  $interetApayer,
                                        "Debit$" =>  $interetApayer / $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement partiel intérêt de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                        "refCompteMembre" => $dataMembre->numAdherant,
                                    ]);



                                    //CREDITE SON COMPTE CREDIT
                                    // Transactions::create([
                                    //     "NumTransaction" => $NumTransaction,
                                    //     "DateTransaction" => $dateDuJour,
                                    //     "DateSaisie" => $dateDuJour,
                                    //     "TypeTransaction" => "C",
                                    //     "CodeMonnaie" => 2,
                                    //     "CodeAgence" => "20",
                                    //     "NumDossier" => "DOS00" . $numOperation->id,
                                    //     "NumDemande" => "V00" . $numOperation->id,
                                    //     "NumCompte" => $dataMembre->NumCompteCredit,
                                    //     "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                    //     "Credit" =>  $interetApayer,
                                    //     // "Operant" =>  Auth::user()->name,
                                    //     "Creditfc" =>  $interetApayer,
                                    //     "Credit$" => $interetApayer / $tauxDuJour,
                                    //     "NomUtilisateur" => "AUTO",
                                    //     "Libelle" => "Remboursement partiel intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
                                    //     "refCompteMembre" => $dataMembre->numAdherant,
                                    // ]);


                                    //CREDITE LE COMPTE INTERET
                                    $compteInteret = "712000000202";
                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "C",
                                        "CodeMonnaie" => 2,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $compteInteret,
                                        "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                        "Credit" =>  $interetApayer,
                                        // "Operant" =>  Auth::user()->name,
                                        "Creditfc" =>  $interetApayer,
                                        "Credit$" => $interetApayer / $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement partiel intérêt du crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                        "refCompteMembre" => $dataMembre->numAdherant,
                                    ]);
                                }


                                //ON EFFECTUE LE REMBOURSEMENT EN CAPITAL UNIQUEMENT
                                $CheckIfDateExist = Remboursementcredit::where("DateTranche", "=", $dataMembre->DateTranch)
                                    ->where("RefEcheance", "=", $dataMembre->ReferenceEch)->first();
                                if (!$CheckIfDateExist) {
                                    Remboursementcredit::create([
                                        "RefEcheance" => $dataMembre->ReferenceEch,
                                        "NumCompte" => $dataMembre->NumCompteEpargne,
                                        "NumCompteCredit" => $dataMembre->NumCompteCredit,
                                        "NumDossie" => $dataMembre->NumDossier,
                                        "RefTypCredit" => $dataMembre->RefTypeCredit,
                                        "NomCompte" => $dataMembre->NomCompte,
                                        "DateTranche" => $dataMembre->DateTranch,
                                        "CapitalAmmortie" => $capitalAmmorti,
                                        "CapitalPaye"  =>  $capitalApaye,
                                        "JoursRetard" => 1,
                                        "InteretAmmorti" => $interetAmorti,
                                        "InteretPaye" => $interetApayer,
                                        "CodeGuichet" => $dataMembre->CodeGuichet,
                                        "NumAdherent" => $dataMembre->numAdherant,
                                    ]);
                                } else {
                                    Remboursementcredit::where("DateTranche", "=", $dataMembre->DateTranch)
                                        ->where("RefEcheance", "=", $dataMembre->ReferenceEch)->update([
                                            "RefEcheance" => $dataMembre->ReferenceEch,
                                            "NumCompte" => $dataMembre->NumCompteEpargne,
                                            "NumCompteCredit" => $dataMembre->NumCompteCredit,
                                            "NumDossie" => $dataMembre->NumDossier,
                                            "RefTypCredit" => $dataMembre->RefTypeCredit,
                                            "NomCompte" => $dataMembre->NomCompte,
                                            "DateTranche" => $dataMembre->DateTranch,
                                            "CapitalAmmortie" => $capitalAmmorti,
                                            "CapitalPaye"  =>  $capitalApaye,
                                            "JoursRetard" => 1,
                                            "InteretAmmorti" => $interetAmorti,
                                            "InteretPaye" => $interetApayer,
                                            "CodeGuichet" => $dataMembre->CodeGuichet,
                                            "NumAdherent" => $dataMembre->numAdherant,
                                        ]);
                                }

                                // RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE ET LE TOT DU CAPITAL EN RETARD
                                $totCapDejaPaye = Remboursementcredit::select(
                                    DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                    DB::raw("SUM(remboursementcredits.CapitalAmmortie)-SUM(remboursementcredits.CapitalPaye) as totCaptRetard"),
                                    DB::raw("SUM(remboursementcredits.InteretAmmorti)-SUM(remboursementcredits.InteretPaye) as totInteretRetard")
                                )->where("remboursementcredits.NumDossie", "=", $dataMembre->NumDossier)
                                    ->groupBy("remboursementcredits.NumDossie")
                                    ->first();

                                //RECUPERE ICI LE JOUR DE RETARD QUE LE MEMBRE A 
                                $JourRetard = Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)
                                    ->where("Cloture", "=", 0)->first()->JourRetard;
                                //PUIS ON MET A JOUR LE PORTE FEUILLE DE CREDIT
                                $capRestant =  $capitalAccorde - $totCapDejaPaye->totCapitalPaye;
                                if ($JourRetard <= 30) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard1" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 30 and $JourRetard <= 60) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard2" => 0,
                                        "Retard2" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 60 and $JourRetard <= 90) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard2" => 0,
                                        "Retard3" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 90 and $JourRetard <= 180) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard3" => 0,
                                        "Retard4" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                }
                            } else if ($soldeDuMembreCDF < $capitalAmmorti) {
                                $capitalApayer = $soldeDuMembreCDF;

                                //DEBITE LE COMPTE EPARGNE DU MEMBRE (REMBOURSEMENT EN CAPITAL)

                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "D",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembre->NumCompteEpargne,
                                    "NumComptecp" => $dataMembre->NumCompteCredit,
                                    "Debit" =>  $capitalApayer,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debitfc" =>  $capitalApayer,
                                    "Debit$" =>  $capitalApayer / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement partiel capital de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);

                                //CREDITE SON COMPTE CREDIT
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "C",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembre->NumCompteCredit,
                                    "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                    "Credit" =>  $capitalApayer,
                                    // "Operant" =>  Auth::user()->name,
                                    "Creditfc" => $capitalApayer,
                                    "Credit$" => $capitalApayer / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement partiel capital  de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);

                                //CREDITE LE  COMPTE CREDIT PRINCIPALE
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "C",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $compteCreditAuxMembreCDF,
                                    "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                    "Credit" =>  $capitalApayer,
                                    // "Operant" =>  Auth::user()->name,
                                    "Creditfc" => $capitalApayer,
                                    "Credit$" => $capitalApayer / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement partiel capital  de votre crédit pour le crédit de " . $dataMembre->MontantAccorde . " pour la " . $dataMembre->NbreJour . "e tranche tombée en date du " . $dataMembre->DateTranch . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $compteCreditAuxMembreCDF,
                                ]);


                                //ON EFFECTUE LE REMBOURSEMENT EN CAPITAL UNIQUEMENT
                                $CheckIfDateExist = Remboursementcredit::where("DateTranche", "=", $dataMembre->DateTranch)
                                    ->where("RefEcheance", "=", $dataMembre->ReferenceEch)->first();
                                if (!$CheckIfDateExist) {
                                    Remboursementcredit::create([
                                        "RefEcheance" => $dataMembre->ReferenceEch,
                                        "NumCompte" => $dataMembre->NumCompteEpargne,
                                        "NumCompteCredit" => $dataMembre->NumCompteCredit,
                                        "NumDossie" => $dataMembre->NumDossier,
                                        "RefTypCredit" => $dataMembre->RefTypeCredit,
                                        "NomCompte" => $dataMembre->NomCompte,
                                        "DateTranche" => $dataMembre->DateTranch,
                                        "CapitalAmmortie" => $capitalAmmorti,
                                        "CapitalPaye"  =>  $capitalApayer,
                                        "JoursRetard" => 1,
                                        "InteretAmmorti" => $interetAmorti,
                                        "CodeGuichet" => $dataMembre->CodeGuichet,
                                        "NumAdherent" => $dataMembre->numAdherant,
                                    ]);
                                } else {
                                    Remboursementcredit::where("DateTranche", "=", $dataMembre->DateTranch)
                                        ->where("RefEcheance", "=", $dataMembre->ReferenceEch)->update([
                                            "RefEcheance" => $dataMembre->ReferenceEch,
                                            "NumCompte" => $dataMembre->NumCompteEpargne,
                                            "NumCompteCredit" => $dataMembre->NumCompteCredit,
                                            "NumDossie" => $dataMembre->NumDossier,
                                            "RefTypCredit" => $dataMembre->RefTypeCredit,
                                            "NomCompte" => $dataMembre->NomCompte,
                                            "DateTranche" => $dataMembre->DateTranch,
                                            "CapitalAmmortie" => $capitalAmmorti,
                                            "CapitalPaye"  =>  $capitalApayer,
                                            "JoursRetard" => 1,
                                            "InteretAmmorti" => $interetAmorti,
                                            "CodeGuichet" => $dataMembre->CodeGuichet,
                                            "NumAdherent" => $dataMembre->numAdherant,
                                        ]);
                                }

                                // RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE ET LE TOT DU CAPITAL EN RETARD
                                $totCapDejaPaye = Remboursementcredit::select(
                                    DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                    DB::raw("SUM(remboursementcredits.CapitalAmmortie)-SUM(remboursementcredits.CapitalPaye) as totCaptRetard"),
                                    DB::raw("SUM(remboursementcredits.InteretAmmorti)-SUM(remboursementcredits.InteretPaye) as totInteretRetard")
                                )->where("remboursementcredits.NumDossie", "=", $dataMembre->NumDossier)
                                    ->groupBy("remboursementcredits.NumDossie")
                                    ->first();

                                //RECUPERE ICI LE JOUR DE RETARD QUE LE MEMBRE A 
                                $JourRetard = Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)
                                    ->where("Cloture", "=", 0)->first()->JourRetard;
                                //PUIS ON MET A JOUR LE PORTE FEUILLE DE CREDIT
                                $capRestant =  $capitalAccorde - $totCapDejaPaye->totCapitalPaye;
                                if ($JourRetard <= 30) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard1" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 30 and $JourRetard <= 60) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard2" => 0,
                                        "Retard2" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 60 and $JourRetard <= 90) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard2" => 0,
                                        "Retard3" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 90 and $JourRetard <= 180) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard3" => 0,
                                        "Retard4" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                }
                            }
                            //SINON SI LE MONTANT A REMBOURSER EST INFERIEUR AU CAPITAL QUE LE MEMBRE DOIT
                            //CELA SIGNIFIE QU'UNE PARTIE DU CAPITAL EST D'INTERET RESTE EN RETARD

                        } else if ($soldeDuMembreCDF == 0) {

                            Remboursementcredit::where("RefEcheance", "=", $dataMembre->ReferenceEch)->update([
                                "JoursRetard" => $checkRemboursement->JoursRetard + 1,
                            ]);
                            // RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE ET LE TOT DU CAPITAL EN RETARD
                            $totCapDejaPaye = Remboursementcredit::select(
                                DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                DB::raw("SUM(remboursementcredits.CapitalAmmortie)-SUM(remboursementcredits.CapitalPaye) as totCaptRetard"),
                                DB::raw("SUM(remboursementcredits.InteretAmmorti)-SUM(remboursementcredits.InteretPaye) as totInteretRetard")
                            )->where("remboursementcredits.NumDossie", "=", $dataMembre->NumDossier)
                                ->groupBy("remboursementcredits.NumDossie")
                                ->first();

                            //RECUPERE ICI LE JOUR DE RETARD QUE LE MEMBRE A 
                            $JourRetard = Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)
                                ->where("Cloture", "=", 0)->first()->JourRetard;
                            //PUIS ON MET A JOUR LE PORTE FEUILLE DE CREDIT
                            $capRestant =  $capitalAccorde - $totCapDejaPaye->totCapitalPaye;
                            if ($JourRetard <= 30) {
                                Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                    "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                    "CapitalRestant" => $capRestant,
                                    "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                    "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    "Retard1" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                ]);
                            } else if ($JourRetard > 30 and $JourRetard <= 60) {
                                Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                    "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                    "CapitalRestant" => $capRestant,
                                    "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                    "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    "Retard2" => 0,
                                    "Retard2" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                ]);
                            } else if ($JourRetard > 60 and $JourRetard <= 90) {
                                Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                    "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                    "CapitalRestant" => $capRestant,
                                    "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                    "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    "Retard2" => 0,
                                    "Retard3" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                ]);
                            } else if ($JourRetard > 90 and $JourRetard <= 180) {
                                Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                    "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                    "CapitalRestant" => $capRestant,
                                    "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                    "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    "Retard3" => 0,
                                    "Retard4" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                ]);
                            }
                        }
                    }
                }

                CompteurTransaction::create([
                    'fakevalue' => "0000",
                ]);
                $numOperation = [];
                $numOperation = CompteurTransaction::latest()->first();
                $NumTransaction = "AT00" . $numOperation->id;
            }
















            //ICI LE SCRIPT POUR LE REMBOURESEMENT EN USD
        }
        if (count($dataMembreUSD) != 0) {

            for ($i = 0; $i < sizeof($dataMembreUSD); $i++) {
                $response[] = $dataMembreUSD[$i];
            }
            foreach ($response as $dataMembreUSD) {
                if ($dataMembreUSD->CodeMonnaie == "USD") {

                    //GENERE LE NUMERO AUTOMATIQUE DE L'OPERATION

                    CompteurTransaction::create([
                        'fakevalue' => "0000",
                    ]);
                    $numOperation = [];
                    $numOperation = CompteurTransaction::latest()->first();
                    $NumTransaction = "AT00" . $numOperation->id;

                    //RECUPERE LE SOLDE DE CHAQUE COMPTE DONT SON ECHEANCE TOMBE
                    $soldeMembreUSD = Transactions::select(
                        DB::raw("SUM(Credit$)-SUM(Debit$) as soldeUSD"),
                    )->where("NumCompte", '=', $dataMembreUSD->NumCompteEpargne)
                        ->groupBy("NumCompte")
                        ->first();
                    //INCREMENTE LE NOMBRE DE JOUR DE RETARD POUR TOUT LE CREDIT EN RETARD

                    //LE CODE SUIVANT DOIT ETRE EXECUTE SEULEMENT SI LE CLIENT EST EN RETARD DE PAIEMENT EST QUE SON SOLDE =0
                    if (($soldeMembreUSD->soldeUSD == 0 or $soldeMembreUSD->soldeUSD < 0) and $dataMembreUSD->DateTranch == $dateDuJour) {
                        $capitalAmmortie = $dataMembreUSD->CapAmmorti;
                        $interetAmortie = $dataMembreUSD->Interet;
                        $epargneAmmortie = $dataMembreUSD->Epargne;

                        //ICI ON VERIFIE S'IL YA PAS EU UN REMBOURSEMENT QUI N'A PAS ETE COMPLET ET QUE LE MONTANT N'A PAS ETE COMPLET
                        $checkRemboursement = Remboursementcredit::where("NumDossie", "=", $dataMembreUSD->NumDossier)->where("JoursRetard", ">", 0)->first();
                        if ($checkRemboursement) {
                            $getDateTrache = Remboursementcredit::where("NumDossie", "=", $dataMembre->NumDossier)->first();

                            //SI LE MEMBRE EST EN RETARD DE REMBOURSEMENT ON VA METTRE A JOUR CE REMBOURSEMENT
                            $capitalDejaRembourse = $checkRemboursement->CapitalPaye;
                            $interetDejaRembourse = $checkRemboursement->InteretPaye;
                            $epagneDejaRembourse = $checkRemboursement->EpargnePaye;
                            $epargneManquant = $epargneAmmortie - $epagneDejaRembourse;
                            $capitalManquant = $capitalAmmortie - $capitalDejaRembourse;
                            $interetManquant = $interetAmortie - $interetDejaRembourse;
                            $soldeMembreUSD = $soldeMembreUSD->soldeUSD;
                            $capitalAccorde = $dataMembreUSD->MontantAccorde;
                            $dataTranche = $getDateTrache->DateTranche;
                            // RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE ET LE TOT DU CAPITAL EN RETARD
                            $totCapDejaPaye = Remboursementcredit::select(
                                DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                DB::raw("SUM(remboursementcredits.CapitalAmmortie)-SUM(remboursementcredits.CapitalPaye) as totCaptRetard"),
                                DB::raw("SUM(remboursementcredits.InteretAmmorti)-SUM(remboursementcredits.InteretPaye) as totInteretRetard")
                            )->where("remboursementcredits.NumDossie", "=", $dataMembreUSD->NumDossier)
                                ->groupBy("remboursementcredits.NumDossie")
                                ->first();

                            //RECUPERE ICI LE JOUR DE RETARD QUE LE MEMBRE A 
                            $JourRetard = Portefeuille::where("NumDossier", "=", $dataMembreUSD->NumDossier)
                                ->where("Cloture", "=", 0)->first()->JourRetard;
                            //PUIS ON MET A JOUR LE PORTE FEUILLE DE CREDIT
                            $capRestant =  $capitalAccorde - $totCapDejaPaye->totCapitalPaye;
                            if ($JourRetard <= 30) {
                                Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                    "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                    "CapitalRestant" => $capRestant,
                                    "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                    "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    "Retard1" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                ]);
                            } else if ($JourRetard > 30 and $JourRetard <= 60) {
                                Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                    "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                    "CapitalRestant" => $capRestant,
                                    "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                    "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    "Retard2" => 0,
                                    "Retard2" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                ]);
                            } else if ($JourRetard > 60 and $JourRetard <= 90) {
                                Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                    "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                    "CapitalRestant" => $capRestant,
                                    "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                    "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    "Retard2" => 0,
                                    "Retard3" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                ]);
                            } else if ($JourRetard > 90 and $JourRetard <= 180) {
                                Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                    "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                    "CapitalRestant" => $capRestant,
                                    "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                    "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    "Retard3" => 0,
                                    "Retard4" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                ]);
                            }

                            //RENSEIGNE LE RETARD

                            //ON EFFECTUE LE REMBOURSEMENT
                            if ($dataTranche == $dataMembreUSD->DateTranch) {
                                Remboursementcredit::where("RefEcheance", "=", $dataMembreUSD->ReferenceEch)
                                    ->where("DateTranche", "=", $dataMembreUSD->DateTranch)->update([
                                        "RefEcheance" => $dataMembreUSD->ReferenceEch,
                                        "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                        "NumCompteCredit" => $dataMembreUSD->NumCompteCredit,
                                        "NumDossie" => $dataMembreUSD->NumDossier,
                                        "RefTypCredit" => $dataMembreUSD->RefTypeCredit,
                                        "NomCompte" => $dataMembreUSD->NomCompte,
                                        "DateTranche" => $dataMembreUSD->DateTranch,
                                        "CapitalAmmortie" => $capitalAmmortie,
                                        "InteretAmmorti" => $interetAmortie,
                                        "EpargneAmmorti" => $epargneAmmortie,
                                        "CodeGuichet" => $dataMembreUSD->CodeGuichet,
                                        "NumAdherent" => $dataMembreUSD->numAdherant,
                                    ]);
                            } else {
                                Remboursementcredit::create([
                                    "RefEcheance" => $dataMembreUSD->ReferenceEch,
                                    "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                    "NumCompteCredit" => $dataMembreUSD->NumCompteCredit,
                                    "NumDossie" => $dataMembreUSD->NumDossier,
                                    "RefTypCredit" => $dataMembreUSD->RefTypeCredit,
                                    "NomCompte" => $dataMembreUSD->NomCompte,
                                    "DateTranche" => $dataMembreUSD->DateTranch,
                                    "CapitalAmmortie" => $capitalAmmortie,
                                    "InteretAmmorti" => $interetAmortie,
                                    "EpargneAmmorti" => $epargneAmmortie,
                                    "CodeGuichet" => $dataMembreUSD->CodeGuichet,
                                    "NumAdherent" => $dataMembreUSD->numAdherant,
                                ]);
                            }
                            //DEBITE LE COMPTE CREDIT EN RETARD 39
                            //dddd
                            $compteCreditRetard = "390000000201";
                            Transactions::create([
                                "NumTransaction" => $NumTransaction,
                                "DateTransaction" => $dateDuJour,
                                "DateSaisie" => $dateDuJour,
                                "TypeTransaction" => "D",
                                "CodeMonnaie" => 1,
                                "CodeAgence" => "20",
                                "NumDossier" => "DOS00" . $numOperation->id,
                                "NumDemande" => "V00" . $numOperation->id,
                                "NumCompte" => $compteCreditRetard,
                                "NumComptecp" => $compteCreditAuxMembreUSD,
                                "Debit" =>  $capitalManquant,
                                // "Operant" =>  Auth::user()->name,
                                "Debitfc" =>  $capitalManquant,
                                "Debit$" =>  $capitalManquant / $tauxDuJour,
                                "NomUtilisateur" => "AUTO",
                                "Libelle" => "Constatation crédit en Retard  pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                "refCompteMembre" => $dataMembreUSD->numAdherant,
                            ]);

                            //CREDITE LE COMPTE CREDIT AUX MEMBRE
                            Transactions::create([
                                "NumTransaction" => $NumTransaction,
                                "DateTransaction" => $dateDuJour,
                                "DateSaisie" => $dateDuJour,
                                "TypeTransaction" => "C",
                                "CodeMonnaie" => 1,
                                "CodeAgence" => "20",
                                "NumDossier" => "DOS00" . $numOperation->id,
                                "NumDemande" => "V00" . $numOperation->id,
                                "NumCompte" => $compteCreditAuxMembreUSD,
                                "NumComptecp" => $compteCreditRetard,
                                "Credit" =>  $capitalManquant,
                                // "Operant" =>  Auth::user()->name,
                                "Creditfc" =>  $capitalManquant,
                                "Credit$" =>  $capitalManquant / $tauxDuJour,
                                "NomUtilisateur" => "AUTO",
                                "Libelle" => "Constatation crédit en Retard  " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                "refCompteMembre" => $dataMembreUSD->numAdherant,
                            ]);

                            //RENSEIGNE LE MONTANT DANS LA TABLE REMBOURSEMENT ATTENDU

                            RemboursEttendu::create([

                                "NumCompteEpargne" => $dataMembreUSD->NumCompteEpargne,
                                "NumCompteCredit" => $dataMembreUSD->NumCompteCredit,
                                "montantCapit" => $dataMembreUSD->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                "montantInteret" => $totCapDejaPaye->totInteretRetard,
                                "CodeMonnaie" => 1,
                                "StatutPayement" => 0,
                                "DateRemboursement" => $dateDuJour,
                                "NumAbrege" => $dataMembreUSD->numAdherant,
                            ]);
                        }
                        //LE CODE SUIVANT DOIT ETRE EXECUTE SEULEMENT SI LE SOLDE DU MEMBRE EST SUPERIEUR A ZERO
                    } else if ($soldeMembreUSD->soldeUSD > 0) {

                        $capitalAmmortie = $dataMembreUSD->CapAmmorti;
                        $interetAmortie = $dataMembreUSD->Interet;
                        $epargneAmmortie = $dataMembreUSD->Epargne;

                        //ICI ON VERIFIE S'IL YA PAS EU UN REMBOURSEMENT QUI N'A PAS ETE COMPLET ET QUE LE MONTANT N'A PAS ETE COMPLET
                        $checkRemboursement = Remboursementcredit::where("RefEcheance", "=", $dataMembreUSD->ReferenceEch)->where("JoursRetard", ">", 0)->where("DateTranche", "=", $dataMembreUSD->DateTranch)->first();
                        if ($checkRemboursement) {

                            //SI LE MEMBRE EST EN RETARD DE REMBOURSEMENT ON VA METTRE A JOUR CE REMBOURSEMENT
                            $capitalDejaRembourse = $checkRemboursement->CapitalPaye;
                            $interetDejaRembourse = $checkRemboursement->InteretPaye;
                            $epagneDejaRembourse = $checkRemboursement->EpargnePaye;
                            $epargneManquant = $epargneAmmortie - $epagneDejaRembourse;
                            $capitalManquant = $capitalAmmortie - $capitalDejaRembourse;
                            $interetManquant = $interetAmortie - $interetDejaRembourse;
                            $soldeMembreUSD = $soldeMembreUSD->soldeUSD;
                            $capitalAccorde = $dataMembreUSD->MontantAccorde;
                            //ON VERIFIE SI LE SOLDE ACTUEL DU MEMBRE EST SUPERIEUR OU EGALE AU CREDIT QUI'IL DETIEN EN CAPITAL + L'INTERET
                            if ($soldeMembreUSD >= ($capitalManquant + $interetManquant + $epargneAmmortie))
                            //PUIS ON VA EFFECTUER UN REMBOURSEMENT EN METANT A JOUR CETTE LIGNE
                            {
                                Remboursementcredit::where("RefEcheance", "=", $dataMembreUSD->ReferenceEch)
                                    ->where("DateTranche", "=", $dataMembreUSD->DateTranch)->update([
                                        "CapitalPaye" => $capitalDejaRembourse + $capitalManquant,
                                        "InteretPaye" => $interetDejaRembourse + $interetManquant,
                                        "EpargnePaye" => $epagneDejaRembourse + $epargneManquant,
                                        "JoursRetard" => 0,
                                    ]);
                                // RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE
                                $totCapDejaPaye = Remboursementcredit::select(
                                    DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                )->where("remboursementcredits.NumDossie", "=", $dataMembreUSD->NumDossier)
                                    ->groupBy("remboursementcredits.NumDossie")
                                    ->first();
                                //PUIS ON MET A JOUR LE PORTE FEUILLE DE CREDIT
                                $capRestant =  $capitalAccorde - $totCapDejaPaye->totCapitalPaye;
                                if ($JourRetard <= 30) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard1" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 30 and $JourRetard <= 60) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard2" => 0,
                                        "Retard2" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 60 and $JourRetard <= 90) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard2" => 0,
                                        "Retard3" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 90 and $JourRetard <= 180) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard3" => 0,
                                        "Retard4" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                }
                                //MET A JOUR LA TABLE REMBOURSEMENT ATTENTU

                                RemboursEttendu::where("NumCompteEpargne", "=", $dataMembreUSD->NumCompteEpargne)->update([
                                    "StatutPayement" => 1,
                                ]);



                                //PUIS CONSTATE LE PAYEMENT SUR CREDIT EN RETARD 
                                //CREDITE LE COMPTE CREDIT EN RETARD 39
                                $compteCreditRetard = "390000000201";
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "C",
                                    "CodeMonnaie" => 1,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $compteCreditRetard,
                                    "NumComptecp" => $compteCreditAuxMembreUSD,
                                    "Credit" =>  $capitalManquant,
                                    //"Operant" =>  Auth::user()->name,
                                    "Credit$" =>  $capitalManquant,
                                    "Creditfc" =>  $capitalManquant * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Constatation crédit en Retard  pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                    "refCompteMembre" => $dataMembreUSD->numAdherant,
                                ]);

                                //DEBITE LE COMPTE EPARGNE DU MEMBRE (REMBOURSEMENT EN CAPITAL)
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "D",
                                    "CodeMonnaie" => 1,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                    "NumComptecp" => $dataMembreUSD->NumCompteCredit,
                                    "Debit" =>  $capitalManquant,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $capitalManquant,
                                    "Debitfc" =>  $capitalManquant * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                    "refCompteMembre" => $dataMembreUSD->numAdherant,
                                ]);
                                //CREDITE SON COMPTE CREDIT
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "C",
                                    "CodeMonnaie" => 1,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembreUSD->NumCompteCredit,
                                    "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                    "Credit" =>  $capitalManquant,
                                    // "Operant" =>  Auth::user()->name,
                                    "Credit$" =>  $capitalManquant,
                                    "Creditfc" =>  $capitalManquant * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital  de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                    "refCompteMembre" => $dataMembreUSD->numAdherant,
                                ]);

                                //CREDITE LE COMPTE CREDIT AU MEMBRE USD 
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "C",
                                    "CodeMonnaie" => 1,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $compteCreditAuxMembreUSD,
                                    "NumComptecp" => $compteCreditRetard,
                                    "Credit" =>  $capitalManquant,
                                    // "Operant" =>  Auth::user()->name,
                                    "Creditfc" =>  $capitalManquant,
                                    "Credit$" =>  $capitalManquant / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement crédit en Retard  " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                    "refCompteMembre" => $dataMembreUSD->numAdherant,
                                ]);


                                //PUIS CONSTATE LE PAIEMENT SUR LA TABLE ECHEANCIER
                                Echeancier::where("echeanciers.ReferenceEch", "=", $dataMembreUSD->ReferenceEch)
                                    ->update([
                                        "statutPayement" => "1",
                                        "posted" => "1",
                                    ]);


                                //EMBOURSEMENT EN INTERET
                                if ($interetManquant > 0) {


                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "D",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                        "NumComptecp" => $dataMembreUSD->NumCompteCredit,
                                        "Debit" =>  $interetManquant,
                                        // "Operant" =>  Auth::user()->name,
                                        "Debit$" =>  $interetManquant,
                                        "Debitfc" =>  $interetManquant * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement intérêt de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);

                                    //CREDITE SON COMPTE CREDIT
                                    // Transactions::create([
                                    //     "NumTransaction" => $NumTransaction,
                                    //     "DateTransaction" => $dateDuJour,
                                    //     "DateSaisie" => $dateDuJour,
                                    //     "TypeTransaction" => "C",
                                    //     "CodeMonnaie" => 2,
                                    //     "CodeAgence" => "20",
                                    //     "NumDossier" => "DOS00" . $numOperation->id,
                                    //     "NumDemande" => "V00" . $numOperation->id,
                                    //     "NumCompte" => $dataMembreUSD->NumCompteCredit,
                                    //     "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                    //     "Credit" =>  $interetManquant,
                                    //     // "Operant" =>  Auth::user()->name,
                                    //     "Creditfc" =>  $interetManquant,
                                    //     "Credit$" =>  $interetManquant / $tauxDuJour,
                                    //     "NomUtilisateur" => "AUTO",
                                    //     "Libelle" => "Remboursement intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                    //     "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    // ]);

                                    //CREDITE LE COMPTE INTERET
                                    $compteInteret = "712000000201";
                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "C",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" =>  $compteInteret,
                                        "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                        "Credit" =>  $interetManquant,
                                        // "Operant" =>  Auth::user()->name,
                                        "Credit$" =>  $interetManquant,
                                        "Creditfc" =>  $interetManquant * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Paiement intérêt du crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);
                                }


                                //REMBOURSEMENT EPARGNE GARANTIE
                                if ($epargneManquant > 0) {


                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "D",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                        "NumComptecp" => $dataMembreUSD->NumCompteEpargneGarantie,
                                        "Debit" => $epargneManquant,
                                        // "Operant" =>  Auth::user()->name,
                                        "Debit$" =>  $epargneManquant,
                                        "Debitfc" =>  $epargneManquant * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement epargne garantie de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);

                                    //CREDITE SON COMPTE EPARGNE GARANTIE
                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "C",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $dataMembreUSD->NumCompteEpargneGarantie,
                                        "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                        "Credit" =>  $epargneManquant,
                                        // "Operant" =>  Auth::user()->name,
                                        "Credit$" =>  $epargneManquant,
                                        "Creditfc" =>  $epargneManquant * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement Epargne garantie de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);
                                }







                                //SINON SI LE SOLDE DU MEMBRE EST INFERIEUR A LA DETTE QU'IL DOIT CAD INTERE + CAPITAL 
                                //ON PREND LE CAPITAL ET CE QUI RESTE ON LE MET EN INTERET MET IL RESTE EN RETARD
                            } else if ($soldeMembreUSD < ($capitalManquant + $interetManquant)) {
                                //ON VERIFIE SI LE SOLDE DU MEMBRE EST EGAL AU CAPITAL QU'IL DOIT
                                if ($soldeMembreUSD == $capitalManquant) {
                                    $capitalManquant = $soldeMembreUSD;

                                    //DEBITE LE COMPTE EPARGNE DU MEMBRE (REMBOURSEMENT EN CAPITAL)

                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "D",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                        "NumComptecp" => $dataMembreUSD->NumCompteCredit,
                                        "Debit" =>  $capitalManquant,
                                        // "Operant" =>  Auth::user()->name,
                                        "Debit$" =>  $capitalManquant,
                                        "Debitfc" =>  $capitalManquant * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement capital de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);

                                    //CREDITE SON COMPTE CREDIT
                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "C",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $dataMembreUSD->NumCompteCredit,
                                        "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                        "Credit" =>  $capitalManquant,
                                        // "Operant" =>  Auth::user()->name,
                                        "Credit$" =>  $capitalManquant,
                                        "Creditfc" =>  $capitalManquant * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement capital  de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);

                                    //CREDITE LE  COMPTE CREDIT PRINCIPALE
                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "C",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $compteCreditAuxMembreUSD,
                                        "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                        "Credit" =>  $capitalManquant,
                                        // "Operant" =>  Auth::user()->name,
                                        "Credit$" =>  $capitalManquant,
                                        "Creditfc" =>  $capitalManquant * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement capital  de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $compteCreditAuxMembreUSD,
                                    ]);


                                    Remboursementcredit::where("RefEcheance", "=", $dataMembreUSD->ReferenceEch)->update([
                                        "CapitalPaye" => $capitalDejaRembourse + $capitalManquant,
                                        // "InteretPaye" => $interetDejaRembourse + $interetManquant,
                                        "JoursRetard" => $checkRemboursement->JoursRetard + 1,
                                    ]);
                                    // RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE ET LE TOT DU CAPITAL EN RETARD
                                    $totCapDejaPaye = Remboursementcredit::select(
                                        DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                        DB::raw("SUM(remboursementcredits.CapitalAmmortie)-SUM(remboursementcredits.CapitalPaye) as totCaptRetard"),
                                        DB::raw("SUM(remboursementcredits.InteretAmmorti)-SUM(remboursementcredits.InteretPaye) as totInteretRetard")
                                    )->where("remboursementcredits.NumDossie", "=", $dataMembreUSD->NumDossier)
                                        ->groupBy("remboursementcredits.NumDossie")
                                        ->first();

                                    //RECUPERE ICI LE JOUR DE RETARD QUE LE MEMBRE A 
                                    $JourRetard = Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)
                                        ->where("Cloture", "=", 0)->first()->JourRetard;
                                    //PUIS ON MET A JOUR LE PORTE FEUILLE DE CREDIT
                                    $capRestant =  $capitalAccorde - $totCapDejaPaye->totCapitalPaye;
                                    if ($JourRetard <= 30) {
                                        Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                            "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                            "CapitalRestant" => $capRestant,
                                            "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                            "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                            "Retard1" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        ]);
                                    } else if ($JourRetard > 30 and $JourRetard <= 60) {
                                        Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                            "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                            "CapitalRestant" => $capRestant,
                                            "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                            "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                            "Retard2" => 0,
                                            "Retard2" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        ]);
                                    } else if ($JourRetard > 60 and $JourRetard <= 90) {
                                        Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                            "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                            "CapitalRestant" => $capRestant,
                                            "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                            "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                            "Retard2" => 0,
                                            "Retard3" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        ]);
                                    } else if ($JourRetard > 90 and $JourRetard <= 180) {
                                        Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                            "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                            "CapitalRestant" => $capRestant,
                                            "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                            "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                            "Retard3" => 0,
                                            "Retard4" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        ]);
                                    }
                                    //SINON SI LE SOLDE DU MEMBRE EST SUPERIEUR AU CAPITAL AMORTI QU'IL DOIT
                                } else if ($soldeMembreUSD > $capitalManquant) {
                                    $capitalApaye = $soldeMembreUSD - $capitalManquant;
                                    $interetApayer = $soldeMembreUSD - $capitalApaye;


                                    //DEBITE LE COMPTE EPARGNE DU MEMBRE (REMBOURSEMENT EN CAPITAL)

                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "D",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                        "NumComptecp" => $dataMembreUSD->NumCompteCredit,
                                        "Debit" =>  $capitalApaye,
                                        // "Operant" =>  Auth::user()->name,
                                        "Debit$" =>  $capitalApaye,
                                        "Debitfc" =>  $capitalApaye * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement capital de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);

                                    //CREDITE SON COMPTE CREDIT
                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "C",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $dataMembreUSD->NumCompteCredit,
                                        "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                        "Credit" =>  $capitalApaye,
                                        // "Operant" =>  Auth::user()->name,
                                        "Credit$" =>  $capitalApaye,
                                        "Creditfc" =>  $capitalApaye * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement capital  de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);

                                    //CREDITE  COMPTE CREDIT PRINCIPAL
                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "C",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $dataMembreUSD->NumCompteCredit,
                                        "NumComptecp" =>  $compteCreditAuxMembreUSD,
                                        "Credit" =>  $capitalApaye,
                                        // "Operant" =>  Auth::user()->name,
                                        "Credit$" =>  $capitalApaye,
                                        "Creditfc" =>  $capitalApaye * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement capital  de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $compteCreditAuxMembreUSD,
                                    ]);

                                    //DEBITE LE COMPTE CREDIT EN RETARD 39
                                    $compteCreditRetard = "390000000201";
                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "D",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $compteCreditRetard,
                                        "NumComptecp" => $compteCreditAuxMembreUSD,
                                        "Debit" =>  $capitalManquant,
                                        "Debit$" =>  $capitalManquant,
                                        "Debitfc" =>  $capitalManquant * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Constatation crédit en Retard  pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);


                                    //EMBOURSEMENT EN INTERET
                                    if ($interetApayer > 0) {


                                        Transactions::create([
                                            "NumTransaction" => $NumTransaction,
                                            "DateTransaction" => $dateDuJour,
                                            "DateSaisie" => $dateDuJour,
                                            "TypeTransaction" => "D",
                                            "CodeMonnaie" => 1,
                                            "CodeAgence" => "20",
                                            "NumDossier" => "DOS00" . $numOperation->id,
                                            "NumDemande" => "V00" . $numOperation->id,
                                            "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                            "NumComptecp" => $dataMembreUSD->NumCompteCredit,
                                            "Debit" =>  $interetApayer,
                                            // "Operant" =>  Auth::user()->name,
                                            "Debit$" =>  $interetApayer,
                                            "Debitfc" =>  $interetApayer * $tauxDuJour,
                                            "NomUtilisateur" => "AUTO",
                                            "Libelle" => "Remboursement partiel intérêt de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                            "refCompteMembre" => $dataMembreUSD->numAdherant,
                                        ]);

                                        //CREDITE SON COMPTE CREDIT
                                        // Transactions::create([
                                        //     "NumTransaction" => $NumTransaction,
                                        //     "DateTransaction" => $dateDuJour,
                                        //     "DateSaisie" => $dateDuJour,
                                        //     "TypeTransaction" => "C",
                                        //     "CodeMonnaie" => 2,
                                        //     "CodeAgence" => "20",
                                        //     "NumDossier" => "DOS00" . $numOperation->id,
                                        //     "NumDemande" => "V00" . $numOperation->id,
                                        //     "NumCompte" => $dataMembreUSD->NumCompteCredit,
                                        //     "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                        //     "Credit" =>  $interetApayer,
                                        //     // "Operant" =>  Auth::user()->name,
                                        //     "Creditfc" =>  $interetApayer,
                                        //     "Credit$" => $interetApayer / $tauxDuJour,
                                        //     "NomUtilisateur" => "AUTO",
                                        //     "Libelle" => "Remboursement partiel intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        //     "refCompteMembre" => $dataMembreUSD->numAdherant,
                                        // ]);




                                        $compteInteret = "712000000201";
                                        //CREDITE LE COMPTE INTERET
                                        Transactions::create([
                                            "NumTransaction" => $NumTransaction,
                                            "DateTransaction" => $dateDuJour,
                                            "DateSaisie" => $dateDuJour,
                                            "TypeTransaction" => "C",
                                            "CodeMonnaie" => 1,
                                            "CodeAgence" => "20",
                                            "NumDossier" => "DOS00" . $numOperation->id,
                                            "NumDemande" => "V00" . $numOperation->id,
                                            "NumCompte" => $compteInteret,
                                            "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                            "Credit" =>  $interetApayer,
                                            // "Operant" =>  Auth::user()->name,
                                            "Credit$" =>  $interetApayer,
                                            "Creditfc" => $interetApayer * $tauxDuJour,
                                            "NomUtilisateur" => "AUTO",
                                            "Libelle" => "Remboursement intérêt du crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                            "refCompteMembre" => $dataMembreUSD->numAdherant,
                                        ]);
                                    }

                                    Remboursementcredit::where("RefEcheance", "=", $dataMembreUSD->ReferenceEch)->update([
                                        "CapitalPaye" => $capitalDejaRembourse + $capitalApaye,
                                        "InteretPaye" => $interetDejaRembourse + $interetApayer,
                                        "JoursRetard" => $checkRemboursement->JoursRetard + 1,
                                    ]);
                                    // RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE ET LE TOT DU CAPITAL EN RETARD
                                    $totCapDejaPaye = Remboursementcredit::select(
                                        DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                        DB::raw("SUM(remboursementcredits.CapitalAmmortie)-SUM(remboursementcredits.CapitalPaye) as totCaptRetard"),
                                        DB::raw("SUM(remboursementcredits.InteretAmmorti)-SUM(remboursementcredits.InteretPaye) as totInteretRetard")
                                    )->where("remboursementcredits.NumDossie", "=", $dataMembreUSD->NumDossier)
                                        ->groupBy("remboursementcredits.NumDossie")
                                        ->first();

                                    //RECUPERE ICI LE JOUR DE RETARD QUE LE MEMBRE A 
                                    $JourRetard = Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)
                                        ->where("Cloture", "=", 0)->first()->JourRetard;
                                    //PUIS ON MET A JOUR LE PORTE FEUILLE DE CREDIT
                                    $capRestant =  $capitalAccorde - $totCapDejaPaye->totCapitalPaye;
                                    if ($JourRetard <= 30) {
                                        Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                            "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                            "CapitalRestant" => $capRestant,
                                            "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                            "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                            "Retard1" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        ]);
                                    } else if ($JourRetard > 30 and $JourRetard <= 60) {
                                        Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                            "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                            "CapitalRestant" => $capRestant,
                                            "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                            "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                            "Retard2" => 0,
                                            "Retard2" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        ]);
                                    } else if ($JourRetard > 60 and $JourRetard <= 90) {
                                        Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                            "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                            "CapitalRestant" => $capRestant,
                                            "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                            "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                            "Retard2" => 0,
                                            "Retard3" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        ]);
                                    } else if ($JourRetard > 90 and $JourRetard <= 180) {
                                        Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                            "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                            "CapitalRestant" => $capRestant,
                                            "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                            "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                            "Retard3" => 0,
                                            "Retard4" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        ]);
                                    }
                                }
                                //SINON SI LE MONTANT A REMBOURSER EST INFERIEUR AU CAPITAL QUE LE MEMBRE DOIT
                                //CELA SIGNIFIE QU'UNE PARTIE DU CAPITAL EST D'INTERET RESTE EN RETARD

                            } else if ($soldeMembreUSD < $capitalManquant) {
                                $capitalApayer = $soldeMembreUSD;

                                //DEBITE LE COMPTE EPARGNE DU MEMBRE (REMBOURSEMENT EN CAPITAL)

                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "D",
                                    "CodeMonnaie" => 1,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                    "NumComptecp" => $dataMembreUSD->NumCompteCredit,
                                    "Debit" =>  $capitalApayer,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $capitalApayer,
                                    "Debitfc" =>  $capitalApayer * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement partiel capital de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                    "refCompteMembre" => $dataMembreUSD->numAdherant,
                                ]);

                                //CREDITE SON COMPTE CREDIT
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "C",
                                    "CodeMonnaie" => 1,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembreUSD->NumCompteCredit,
                                    "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                    "Credit" =>  $capitalApayer,
                                    // "Operant" =>  Auth::user()->name,
                                    "Credit$" => $capitalApayer,
                                    "Creditfc" => $capitalApayer * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement partiel capital  de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                    "refCompteMembre" => $dataMembreUSD->numAdherant,
                                ]);

                                //CREDITE LE COMPTE CREDIT PRINCIPAL
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "C",
                                    "CodeMonnaie" => 1,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $compteCreditAuxMembreUSD,
                                    "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                    "Credit" =>  $capitalApayer,
                                    // "Operant" =>  Auth::user()->name,
                                    "Credit$" => $capitalApayer,
                                    "Creditfc" => $capitalApayer * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement partiel capital  de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                ]);


                                //DEBITE LE COMPTE CREDIT EN RETARD 39
                                $compteCreditRetard = "390000000201";
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "D",
                                    "CodeMonnaie" => 1,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $compteCreditRetard,
                                    "NumComptecp" => $compteCreditAuxMembreUSD,
                                    "Debit" =>  $capitalManquant,
                                    "Debit$" =>  $capitalManquant,
                                    "Debitfc" =>  $capitalManquant * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Constatation crédit en Retard  pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                    "refCompteMembre" => $dataMembreUSD->numAdherant,
                                ]);

                                Remboursementcredit::where("RefEcheance", "=", $dataMembreUSD->ReferenceEch)->update([
                                    "CapitalPaye" => $capitalDejaRembourse + $capitalApayer,
                                    "JoursRetard" => $checkRemboursement->JoursRetard + 1,
                                ]);
                                // RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE ET LE TOT DU CAPITAL EN RETARD
                                $totCapDejaPaye = Remboursementcredit::select(
                                    DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                    DB::raw("SUM(remboursementcredits.CapitalAmmortie)-SUM(remboursementcredits.CapitalPaye) as totCaptRetard"),
                                    DB::raw("SUM(remboursementcredits.InteretAmmorti)-SUM(remboursementcredits.InteretPaye) as totInteretRetard")
                                )->where("remboursementcredits.NumDossie", "=", $dataMembreUSD->NumDossier)
                                    ->groupBy("remboursementcredits.NumDossie")
                                    ->first();

                                //RECUPERE ICI LE JOUR DE RETARD QUE LE MEMBRE A 
                                $JourRetard = Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)
                                    ->where("Cloture", "=", 0)->first()->JourRetard;
                                //PUIS ON MET A JOUR LE PORTE FEUILLE DE CREDIT
                                $capRestant =  $capitalAccorde - $totCapDejaPaye->totCapitalPaye;
                                if ($JourRetard <= 30) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard1" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 30 and $JourRetard <= 60) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard2" => 0,
                                        "Retard2" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 60 and $JourRetard <= 90) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard2" => 0,
                                        "Retard3" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 90 and $JourRetard <= 180) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard3" => 0,
                                        "Retard4" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                }
                            }
                        } else {
                            //ICI LA LOGIQUE DE SI LE MEMBRE N'ETAIT PAS EN RETARD DE REMBOURSEMENT
                            $soldeMembreUSD = $soldeMembreUSD->soldeUSD;
                            $capitalAmmorti = $dataMembreUSD->CapAmmorti;
                            $interetAmorti = $dataMembreUSD->Interet;
                            $capitalPaye = $capitalAmmorti;
                            $interetPaye = $interetAmorti;
                            $epargneGarantieAmmortie = $dataMembreUSD->Epargne;
                            $EpargnePaye = $epargneGarantieAmmortie;
                            $capitalAccorde = $dataMembreUSD->MontantAccorde;

                            //SI LE SOLDE DU MEMBRE COUVRE SA DETTE POUR CETTE TRANCHE CAD CAPITAL AMORTI + INTERET AMORTI
                            if ($soldeMembreUSD >= ($capitalAmmortie + $interetAmortie + $epargneGarantieAmmortie)) {

                                //ON EFFECTUE LE REMBOURSEMENT
                                Remboursementcredit::create([
                                    "RefEcheance" => $dataMembreUSD->ReferenceEch,
                                    "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                    "NumCompteCredit" => $dataMembreUSD->NumCompteCredit,
                                    "NumDossie" => $dataMembreUSD->NumDossier,
                                    "RefTypCredit" => $dataMembreUSD->RefTypeCredit,
                                    "NomCompte" => $dataMembreUSD->NomCompte,
                                    "DateTranche" => $dataMembreUSD->DateTranch,
                                    "CapitalAmmortie" => $capitalAmmorti,
                                    "CapitalPaye"  => $capitalPaye,
                                    "InteretAmmorti" => $interetAmorti,
                                    "InteretPaye" => $interetPaye,
                                    "EpargneAmmorti" => $epargneGarantieAmmortie,
                                    "EpargnePaye" => $EpargnePaye,
                                    "CodeGuichet" => $dataMembreUSD->CodeGuichet,
                                    "NumAdherent" => $dataMembreUSD->numAdherant,
                                ]);

                                // RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE
                                $totCapDejaPaye = Remboursementcredit::select(
                                    DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                )->where("remboursementcredits.NumDossie", "=", $dataMembreUSD->NumDossier)
                                    ->groupBy("remboursementcredits.NumDossie")
                                    ->first();
                                //PUIS ON MET A JOUR LE PORTE FEUILLE DE CREDIT
                                $capRestant =  $capitalAccorde - $totCapDejaPaye->totCapitalPaye;
                                Portefeuille::where("NumDossier", "=", $dataMembreUSD->NumDossier)->update([
                                    "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                    "CapitalRestant" => $capRestant,
                                    "Retard1" => 0,
                                    "Retard2" => 0,
                                    "Retard3" => 0,
                                    "Retard4" => 0,
                                    "Retard5" => 0,
                                    "JourRetard" => 0,
                                ]);

                                //PUIS PASSE LE ECRITURE DE DEBIT SUR LE COMPTE DU MEMBRE
                                //DEBITE LE COMPTE EPARGNE DU MEMBRE (REMBOURSEMENT EN CAPITAL)

                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "D",
                                    "CodeMonnaie" => 1,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                    "NumComptecp" => $dataMembreUSD->NumCompteCredit,
                                    "Debit" =>  $capitalPaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $capitalPaye,
                                    "Debitfc" => $capitalPaye * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                    "refCompteMembre" => $dataMembreUSD->numAdherant,
                                ]);

                                //CREDITE SON COMPTE CREDIT
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "C",
                                    "CodeMonnaie" => 1,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembreUSD->NumCompteCredit,
                                    "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                    "Credit" =>  $capitalPaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Credit$" =>  $capitalPaye,
                                    "Creditfc" =>  $capitalPaye * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital  de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                    "refCompteMembre" => $dataMembreUSD->numAdherant,
                                ]);

                                //CREDITE LE CREDIT COMPTE PRINCIPAL
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "C",
                                    "CodeMonnaie" => 1,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $compteCreditAuxMembreUSD,
                                    "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                    "Credit" =>  $capitalPaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Credit$" =>  $capitalPaye,
                                    "Creditfc" =>  $capitalPaye * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital  de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                    "refCompteMembre" => $compteCreditAuxMembreUSD,
                                ]);
                                if ($interetPaye > 0) {


                                    //EMBOURSEMENT EN INTERET
                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "D",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                        "NumComptecp" => $dataMembreUSD->NumCompteCredit,
                                        "Debit" =>  $interetPaye,
                                        // "Operant" =>  Auth::user()->name,
                                        "Debit$" =>  $interetPaye,
                                        "Debitfc" =>  $interetPaye * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement intérêt de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);


                                    //CREDITE LE COMPTE INTERET
                                    $compteInteret = "712000000201";
                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "C",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $compteInteret,
                                        "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                        "Credit" =>  $interetPaye,
                                        // "Operant" =>  Auth::user()->name,
                                        "Credit$" =>  $interetPaye,
                                        "Creditfc" => $interetPaye * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement intérêt du crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);
                                }
                                //REMBOURSE L'EPARGNE PROGRESSIVE
                                if ($epargneGarantieAmmortie > 0) {


                                    //EMBOURSEMENT EN INTERET
                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "D",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                        "NumComptecp" => $dataMembreUSD->NumCompteEpargneGarantie,
                                        "Debit" =>  $EpargnePaye,
                                        // "Operant" =>  Auth::user()->name,
                                        "Debit$" =>  $EpargnePaye,
                                        "Debitfc" =>  $EpargnePaye * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement Epargne garantie de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);

                                    //CREDITE SON COMPTE EPARGNE GARANTIE
                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "C",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $dataMembreUSD->NumCompteEpargneGarantie,
                                        "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                        "Credit" => $EpargnePaye,
                                        // "Operant" =>  Auth::user()->name,
                                        "Credit$" =>  $EpargnePaye,
                                        "Creditfc" => $EpargnePaye * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement Epargne garantie de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);
                                }

                                //PUIS CONSTATE LE PAIEMENT SUR LA TABLE ECHEANCIER

                                Echeancier::where("echeanciers.ReferenceEch", "=", $dataMembreUSD->ReferenceEch)
                                    ->update([
                                        "statutPayement" => "1",
                                        "posted" => "1",
                                    ]);

                                //SINON SI LE SOLDE DU MEMBRE EST INFERIEUR AU CAPITAL AMMORTI + INTERET AMMORTI

                            } else if ($soldeMembreUSD < ($capitalAmmortie + $interetAmortie)) {
                                //SI  LE SOLDE DU MEMBRE EST EGAL AU CAPITAL QUI'IL DOIT
                                if ($soldeMembreUSD == $capitalAmmortie) {
                                    $capitalApayer = $soldeMembreUSD;

                                    //DEBITE LE COMPTE EPARGNE DU MEMBRE (REMBOURSEMENT EN CAPITAL)

                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "D",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                        "NumComptecp" => $dataMembreUSD->NumCompteCredit,
                                        "Debit" =>  $capitalApayer,
                                        // "Operant" =>  Auth::user()->name,
                                        "Debit$" =>  $capitalApayer,
                                        "Debitfc" =>  $capitalApayer * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement partiel capital de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);

                                    //CREDITE SON COMPTE CREDIT
                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "C",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $dataMembreUSD->NumCompteCredit,
                                        "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                        "Credit" =>  $capitalApayer,
                                        // "Operant" =>  Auth::user()->name,
                                        "Credit$" => $capitalApayer,
                                        "Creditfc" => $capitalApayer * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement partiel capital  de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);
                                    //CREDITE LE COMPTE CREDIT PRINCIPAL
                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "C",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $compteCreditAuxMembreUSD,
                                        "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                        "Credit" =>  $capitalApayer,
                                        // "Operant" =>  Auth::user()->name,
                                        "Credit$" => $capitalApayer,
                                        "Creditfc" => $capitalApayer * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement partiel capital  de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $compteCreditAuxMembreUSD,
                                    ]);

                                    //ON EFFECTUE LE REMBOURSEMENT EN CAPITAL UNIQUEMENT
                                    //Verifie d'abord s'il y'a pas eu un remboursement qui n'a pas été complet
                                    $CheckIfDateExist = Remboursementcredit::where("DateTranche", "=", $dataMembreUSD->DateTranch)
                                        ->where("RefEcheance", "=", $dataMembreUSD->ReferenceEch)->first();
                                    if (!$CheckIfDateExist) {
                                        Remboursementcredit::create([
                                            "RefEcheance" => $dataMembreUSD->ReferenceEch,
                                            "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                            "NumCompteCredit" => $dataMembreUSD->NumCompteCredit,
                                            "NumDossie" => $dataMembreUSD->NumDossier,
                                            "RefTypCredit" => $dataMembreUSD->RefTypeCredit,
                                            "NomCompte" => $dataMembreUSD->NomCompte,
                                            "DateTranche" => $dataMembreUSD->DateTranch,
                                            "CapitalAmmortie" => $capitalAmmorti,
                                            "CapitalPaye"  => $capitalApayer,
                                            "InteretAmmorti" => $interetAmorti,
                                            "CodeGuichet" => $dataMembreUSD->CodeGuichet,
                                            "NumAdherent" => $dataMembreUSD->numAdherant,
                                        ]);
                                    } else {
                                        Remboursementcredit::where("DateTranche", "=", $dataMembreUSD->DateTranch)
                                            ->where("RefEcheance", "=", $dataMembreUSD->ReferenceEch)->update([
                                                "RefEcheance" => $dataMembreUSD->ReferenceEch,
                                                "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                                "NumCompteCredit" => $dataMembreUSD->NumCompteCredit,
                                                "NumDossie" => $dataMembreUSD->NumDossier,
                                                "RefTypCredit" => $dataMembreUSD->RefTypeCredit,
                                                "NomCompte" => $dataMembreUSD->NomCompte,
                                                "DateTranche" => $dataMembreUSD->DateTranch,
                                                "CapitalAmmortie" => $capitalAmmorti,
                                                "CapitalPaye"  => $capitalApayer,
                                                "InteretAmmorti" => $interetAmorti,
                                                "CodeGuichet" => $dataMembreUSD->CodeGuichet,
                                                "NumAdherent" => $dataMembreUSD->numAdherant,
                                            ]);
                                    }


                                    // RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE ET LE TOT DU CAPITAL EN RETARD
                                    $totCapDejaPaye = Remboursementcredit::select(
                                        DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                        DB::raw("SUM(remboursementcredits.CapitalAmmortie)-SUM(remboursementcredits.CapitalPaye) as totCaptRetard"),
                                        DB::raw("SUM(remboursementcredits.InteretAmmorti)-SUM(remboursementcredits.InteretPaye) as totInteretRetard")
                                    )->where("remboursementcredits.NumDossie", "=", $dataMembreUSD->NumDossier)
                                        ->groupBy("remboursementcredits.NumDossie")
                                        ->first();

                                    //RECUPERE ICI LE JOUR DE RETARD QUE LE MEMBRE A 
                                    $JourRetard = Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)
                                        ->where("Cloture", "=", 0)->first()->JourRetard;
                                    //PUIS ON MET A JOUR LE PORTE FEUILLE DE CREDIT
                                    $capRestant =  $capitalAccorde - $totCapDejaPaye->totCapitalPaye;
                                    if ($JourRetard <= 30) {
                                        Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                            "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                            "CapitalRestant" => $capRestant,
                                            "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                            "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                            "Retard1" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        ]);
                                    } else if ($JourRetard > 30 and $JourRetard <= 60) {
                                        Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                            "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                            "CapitalRestant" => $capRestant,
                                            "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                            "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                            "Retard2" => 0,
                                            "Retard2" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        ]);
                                    } else if ($JourRetard > 60 and $JourRetard <= 90) {
                                        Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                            "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                            "CapitalRestant" => $capRestant,
                                            "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                            "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                            "Retard2" => 0,
                                            "Retard3" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        ]);
                                    } else if ($JourRetard > 90 and $JourRetard <= 180) {
                                        Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                            "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                            "CapitalRestant" => $capRestant,
                                            "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                            "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                            "Retard3" => 0,
                                            "Retard4" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        ]);
                                    }
                                } else if ($soldeMembreUSD > $capitalAmmorti) {
                                    $capitalApaye = $soldeMembreUSD - $capitalAmmorti;
                                    $interetApayer = $soldeMembreUSD - $capitalApaye;

                                    //DEBITE LE COMPTE EPARGNE DU MEMBRE (REMBOURSEMENT EN CAPITAL)

                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "D",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                        "NumComptecp" => $dataMembreUSD->NumCompteCredit,
                                        "Debit" =>  $capitalApaye,
                                        // "Operant" =>  Auth::user()->name,
                                        "Debit$" =>  $capitalApaye,
                                        "Debitfc" =>  $capitalApaye * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement capital de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);

                                    //CREDITE SON COMPTE CREDIT
                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "C",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $dataMembreUSD->NumCompteCredit,
                                        "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                        "Credit" =>  $capitalApaye,
                                        // "Operant" =>  Auth::user()->name,
                                        "Credit$" =>  $capitalApaye,
                                        "Creditfc" =>  $capitalApaye * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement capital  de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);

                                    //CREDITE LE COMPTE CREDIT PRINCIPAL
                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "C",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $compteCreditAuxMembreUSD,
                                        "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                        "Credit" =>  $capitalApaye,
                                        // "Operant" =>  Auth::user()->name,
                                        "Credit$" =>  $capitalApaye,
                                        "Creditfc" =>  $capitalApaye * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement capital  de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $compteCreditAuxMembreUSD,
                                    ]);
                                    if ($interetApayer > 0) {


                                        //REMBOURSEMENT EN INTERET
                                        Transactions::create([
                                            "NumTransaction" => $NumTransaction,
                                            "DateTransaction" => $dateDuJour,
                                            "DateSaisie" => $dateDuJour,
                                            "TypeTransaction" => "D",
                                            "CodeMonnaie" => 1,
                                            "CodeAgence" => "20",
                                            "NumDossier" => "DOS00" . $numOperation->id,
                                            "NumDemande" => "V00" . $numOperation->id,
                                            "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                            "NumComptecp" => $dataMembreUSD->NumCompteCredit,
                                            "Debit" =>  $interetApayer,
                                            // "Operant" =>  Auth::user()->name,
                                            "Debit$" =>  $interetApayer,
                                            "Debitfc" =>  $interetApayer * $tauxDuJour,
                                            "NomUtilisateur" => "AUTO",
                                            "Libelle" => "Remboursement partiel intérêt de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                            "refCompteMembre" => $dataMembreUSD->numAdherant,
                                        ]);


                                        //CREDITE LE COMPTE INTERET
                                        $compteInteret = "712000000201";
                                        Transactions::create([
                                            "NumTransaction" => $NumTransaction,
                                            "DateTransaction" => $dateDuJour,
                                            "DateSaisie" => $dateDuJour,
                                            "TypeTransaction" => "C",
                                            "CodeMonnaie" => 1,
                                            "CodeAgence" => "20",
                                            "NumDossier" => "DOS00" . $numOperation->id,
                                            "NumDemande" => "V00" . $numOperation->id,
                                            "NumCompte" => $compteInteret,
                                            "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                            "Credit" =>  $interetApayer,
                                            // "Operant" =>  Auth::user()->name,
                                            "Credit$" =>  $interetApayer,
                                            "Creditfc" => $interetApayer * $tauxDuJour,
                                            "NomUtilisateur" => "AUTO",
                                            "Libelle" => "Remboursement partiel intérêt du crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                            "refCompteMembre" => $dataMembreUSD->numAdherant,
                                        ]);
                                    }


                                    //ON EFFECTUE LE REMBOURSEMENT EN CAPITAL UNIQUEMENT
                                    $CheckIfDateExist = Remboursementcredit::where("DateTranche", "=", $dataMembreUSD->DateTranch)
                                        ->where("RefEcheance", "=", $dataMembreUSD->ReferenceEch)->first();
                                    if (!$CheckIfDateExist) {
                                        Remboursementcredit::create([
                                            "RefEcheance" => $dataMembreUSD->ReferenceEch,
                                            "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                            "NumCompteCredit" => $dataMembreUSD->NumCompteCredit,
                                            "NumDossie" => $dataMembreUSD->NumDossier,
                                            "RefTypCredit" => $dataMembreUSD->RefTypeCredit,
                                            "NomCompte" => $dataMembreUSD->NomCompte,
                                            "DateTranche" => $dataMembreUSD->DateTranch,
                                            "CapitalAmmortie" => $capitalAmmorti,
                                            "CapitalPaye"  =>  $capitalApaye,
                                            "JoursRetard" => 1,
                                            "InteretAmmorti" => $interetAmorti,
                                            "InteretPaye" => $interetApayer,
                                            "CodeGuichet" => $dataMembreUSD->CodeGuichet,
                                            "NumAdherent" => $dataMembreUSD->numAdherant,
                                        ]);
                                    } else {
                                        Remboursementcredit::where("DateTranche", "=", $dataMembreUSD->DateTranch)
                                            ->where("RefEcheance", "=", $dataMembreUSD->ReferenceEch)->update([
                                                "RefEcheance" => $dataMembreUSD->ReferenceEch,
                                                "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                                "NumCompteCredit" => $dataMembreUSD->NumCompteCredit,
                                                "NumDossie" => $dataMembreUSD->NumDossier,
                                                "RefTypCredit" => $dataMembreUSD->RefTypeCredit,
                                                "NomCompte" => $dataMembreUSD->NomCompte,
                                                "DateTranche" => $dataMembreUSD->DateTranch,
                                                "CapitalAmmortie" => $capitalAmmorti,
                                                "CapitalPaye"  =>  $capitalApaye,
                                                "JoursRetard" => 1,
                                                "InteretAmmorti" => $interetAmorti,
                                                "InteretPaye" => $interetApayer,
                                                "CodeGuichet" => $dataMembreUSD->CodeGuichet,
                                                "NumAdherent" => $dataMembreUSD->numAdherant,
                                            ]);
                                    }

                                    // RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE ET LE TOT DU CAPITAL EN RETARD
                                    $totCapDejaPaye = Remboursementcredit::select(
                                        DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                        DB::raw("SUM(remboursementcredits.CapitalAmmortie)-SUM(remboursementcredits.CapitalPaye) as totCaptRetard"),
                                        DB::raw("SUM(remboursementcredits.InteretAmmorti)-SUM(remboursementcredits.InteretPaye) as totInteretRetard")
                                    )->where("remboursementcredits.NumDossie", "=", $dataMembreUSD->NumDossier)
                                        ->groupBy("remboursementcredits.NumDossie")
                                        ->first();

                                    //RECUPERE ICI LE JOUR DE RETARD QUE LE MEMBRE A 
                                    $JourRetard = Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)
                                        ->where("Cloture", "=", 0)->first()->JourRetard;
                                    //PUIS ON MET A JOUR LE PORTE FEUILLE DE CREDIT
                                    $capRestant =  $capitalAccorde - $totCapDejaPaye->totCapitalPaye;
                                    if ($JourRetard <= 30) {
                                        Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                            "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                            "CapitalRestant" => $capRestant,
                                            "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                            "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                            "Retard1" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        ]);
                                    } else if ($JourRetard > 30 and $JourRetard <= 60) {
                                        Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                            "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                            "CapitalRestant" => $capRestant,
                                            "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                            "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                            "Retard2" => 0,
                                            "Retard2" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        ]);
                                    } else if ($JourRetard > 60 and $JourRetard <= 90) {
                                        Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                            "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                            "CapitalRestant" => $capRestant,
                                            "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                            "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                            "Retard2" => 0,
                                            "Retard3" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        ]);
                                    } else if ($JourRetard > 90 and $JourRetard <= 180) {
                                        Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                            "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                            "CapitalRestant" => $capRestant,
                                            "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                            "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                            "Retard3" => 0,
                                            "Retard4" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        ]);
                                    }
                                } else if ($soldeMembreUSD < $capitalAmmorti) {
                                    $capitalApayer = $soldeMembreUSD;


                                    //DEBITE LE COMPTE EPARGNE DU MEMBRE (REMBOURSEMENT EN CAPITAL)

                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "D",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                        "NumComptecp" => $dataMembreUSD->NumCompteCredit,
                                        "Debit" =>  $capitalApayer,
                                        // "Operant" =>  Auth::user()->name,
                                        "Debit$" =>  $capitalApayer,
                                        "Debitfc" =>  $capitalApayer * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement partiel capital de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);

                                    //CREDITE SON COMPTE CREDIT
                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "C",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $dataMembreUSD->NumCompteCredit,
                                        "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                        "Credit" =>  $capitalApayer,
                                        // "Operant" =>  Auth::user()->name,
                                        "Credit$" => $capitalApayer,
                                        "Creditfc" => $capitalApayer * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement partiel capital  de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);

                                    //CREDITE LE  COMPTE CREDIT PRINCIPALE
                                    Transactions::create([
                                        "NumTransaction" => $NumTransaction,
                                        "DateTransaction" => $dateDuJour,
                                        "DateSaisie" => $dateDuJour,
                                        "TypeTransaction" => "C",
                                        "CodeMonnaie" => 1,
                                        "CodeAgence" => "20",
                                        "NumDossier" => "DOS00" . $numOperation->id,
                                        "NumDemande" => "V00" . $numOperation->id,
                                        "NumCompte" => $compteCreditAuxMembreUSD,
                                        "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                        "Credit" =>  $capitalApayer,
                                        // "Operant" =>  Auth::user()->name,
                                        "Credit$" => $capitalApayer,
                                        "Creditfc" => $capitalApayer * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement partiel capital  de votre crédit pour le crédit de " . $dataMembreUSD->MontantAccorde . " pour la " . $dataMembreUSD->NbreJour . "e tranche tombée en date du " . $dataMembreUSD->DateTranch . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $compteCreditAuxMembreUSD,
                                    ]);


                                    //ON EFFECTUE LE REMBOURSEMENT EN CAPITAL UNIQUEMENT
                                    $CheckIfDateExist = Remboursementcredit::where("DateTranche", "=", $dataMembreUSD->DateTranch)
                                        ->where("RefEcheance", "=", $dataMembreUSD->ReferenceEch)->first();
                                    if (!$CheckIfDateExist) {
                                        Remboursementcredit::create([
                                            "RefEcheance" => $dataMembreUSD->ReferenceEch,
                                            "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                            "NumCompteCredit" => $dataMembreUSD->NumCompteCredit,
                                            "NumDossie" => $dataMembreUSD->NumDossier,
                                            "RefTypCredit" => $dataMembreUSD->RefTypeCredit,
                                            "NomCompte" => $dataMembreUSD->NomCompte,
                                            "DateTranche" => $dataMembreUSD->DateTranch,
                                            "CapitalAmmortie" => $capitalAmmorti,
                                            "CapitalPaye"  =>  $capitalApayer,
                                            "JoursRetard" => 1,
                                            "InteretAmmorti" => $interetAmorti,
                                            "CodeGuichet" => $dataMembreUSD->CodeGuichet,
                                            "NumAdherent" => $dataMembreUSD->numAdherant,
                                        ]);
                                    } else {
                                        Remboursementcredit::where("DateTranche", "=", $dataMembreUSD->DateTranch)
                                            ->where("RefEcheance", "=", $dataMembreUSD->ReferenceEch)->update([
                                                "RefEcheance" => $dataMembreUSD->ReferenceEch,
                                                "NumCompte" => $dataMembreUSD->NumCompteEpargne,
                                                "NumCompteCredit" => $dataMembreUSD->NumCompteCredit,
                                                "NumDossie" => $dataMembreUSD->NumDossier,
                                                "RefTypCredit" => $dataMembreUSD->RefTypeCredit,
                                                "NomCompte" => $dataMembreUSD->NomCompte,
                                                "DateTranche" => $dataMembreUSD->DateTranch,
                                                "CapitalAmmortie" => $capitalAmmorti,
                                                "CapitalPaye"  =>  $capitalApayer,
                                                "JoursRetard" => 1,
                                                "InteretAmmorti" => $interetAmorti,
                                                "CodeGuichet" => $dataMembreUSD->CodeGuichet,
                                                "NumAdherent" => $dataMembreUSD->numAdherant,
                                            ]);
                                    }

                                    // RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE ET LE TOT DU CAPITAL EN RETARD
                                    $totCapDejaPaye = Remboursementcredit::select(
                                        DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                        DB::raw("SUM(remboursementcredits.CapitalAmmortie)-SUM(remboursementcredits.CapitalPaye) as totCaptRetard"),
                                        DB::raw("SUM(remboursementcredits.InteretAmmorti)-SUM(remboursementcredits.InteretPaye) as totInteretRetard")
                                    )->where("remboursementcredits.NumDossie", "=", $dataMembreUSD->NumDossier)
                                        ->groupBy("remboursementcredits.NumDossie")
                                        ->first();

                                    //RECUPERE ICI LE JOUR DE RETARD QUE LE MEMBRE A 
                                    $JourRetard = Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)
                                        ->where("Cloture", "=", 0)->first()->JourRetard;
                                    //PUIS ON MET A JOUR LE PORTE FEUILLE DE CREDIT
                                    $capRestant =  $capitalAccorde - $totCapDejaPaye->totCapitalPaye;
                                    if ($JourRetard <= 30) {
                                        Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                            "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                            "CapitalRestant" => $capRestant,
                                            "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                            "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                            "Retard1" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        ]);
                                    } else if ($JourRetard > 30 and $JourRetard <= 60) {
                                        Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                            "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                            "CapitalRestant" => $capRestant,
                                            "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                            "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                            "Retard2" => 0,
                                            "Retard2" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        ]);
                                    } else if ($JourRetard > 60 and $JourRetard <= 90) {
                                        Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                            "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                            "CapitalRestant" => $capRestant,
                                            "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                            "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                            "Retard2" => 0,
                                            "Retard3" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        ]);
                                    } else if ($JourRetard > 90 and $JourRetard <= 180) {
                                        Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                            "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                            "CapitalRestant" => $capRestant,
                                            "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                            "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                            "Retard3" => 0,
                                            "Retard4" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        ]);
                                    }
                                }
                                //SINON SI LE MONTANT A REMBOURSER EST INFERIEUR AU CAPITAL QUE LE MEMBRE DOIT
                                //CELA SIGNIFIE QU'UNE PARTIE DU CAPITAL EST D'INTERET RESTE EN RETARD

                            } else if ($soldeMembreUSD == 0) {

                                Remboursementcredit::where("RefEcheance", "=", $dataMembreUSD->ReferenceEch)->update([
                                    "JoursRetard" => $checkRemboursement->JoursRetard + 1,
                                ]);
                                // RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE ET LE TOT DU CAPITAL EN RETARD
                                $totCapDejaPaye = Remboursementcredit::select(
                                    DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                    DB::raw("SUM(remboursementcredits.CapitalAmmortie)-SUM(remboursementcredits.CapitalPaye) as totCaptRetard"),
                                    DB::raw("SUM(remboursementcredits.InteretAmmorti)-SUM(remboursementcredits.InteretPaye) as totInteretRetard")
                                )->where("remboursementcredits.NumDossie", "=", $dataMembreUSD->NumDossier)
                                    ->groupBy("remboursementcredits.NumDossie")
                                    ->first();

                                //RECUPERE ICI LE JOUR DE RETARD QUE LE MEMBRE A 
                                $JourRetard = Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)
                                    ->where("Cloture", "=", 0)->first()->JourRetard;
                                //PUIS ON MET A JOUR LE PORTE FEUILLE DE CREDIT
                                $capRestant =  $capitalAccorde - $totCapDejaPaye->totCapitalPaye;
                                if ($JourRetard <= 30) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard1" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 30 and $JourRetard <= 60) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard2" => 0,
                                        "Retard2" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 60 and $JourRetard <= 90) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard2" => 0,
                                        "Retard3" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                } else if ($JourRetard > 90 and $JourRetard <= 180) {
                                    Portefeuille::where("NumDossier", "=", $dataMembre->NumDossier)->update([
                                        "RemboursCapital" => $totCapDejaPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "InteretRetardEchu" => $totCapDejaPaye->totInteretRetard,
                                        "CapitalRetard" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                        "Retard3" => 0,
                                        "Retard4" => $dataMembre->CapitalRetard + $totCapDejaPaye->totCaptRetard,
                                    ]);
                                }
                            }
                        }
                    }
                }

                //GENERE LE NUMERO AUTOMATIQUE DE L'OPERATION

                CompteurTransaction::create([
                    'fakevalue' => "0000",
                ]);
                $numOperation = [];
                $numOperation = CompteurTransaction::latest()->first();
                $NumTransaction = "AT00" . $numOperation->id;
            }
        }
        //REND LA JOURNEE CLOTUREE
        ClosedDay::where("DateSysteme", "=", $dateDuJour)->update([
            "closed" => 1,
        ]);

        return response()->json(["success" => 1, "msg" => "Clotûre bien effectuée"]);
    }

    //PERMET DE DEFINR LA DATE DU SYSTEME

    public function definrDateSysteme(Request $request)
    {
        $tauxDuJour =  TauxJournalier::orderBy('id', 'desc')->first();
        $checkIfDateUsed =  TauxJournalier::where('DateTaux', '=', $request->dateWork)->first();
        if ($checkIfDateUsed) {
            return response()->json(["success" => 0, "msg" => "Impossible d'utiliser une date déjà clotûrée veuillez contacter votre administrateur système merci."]);
        }
        if (!isset($request->dateWork)) {
            return response()->json(["success" => 0, "msg" => "Veuillez definir la date du système pour valider."]);
        }
        if (isset($request->dateWork) and !isset($request->Taux)) {
            //ON RECUPERE LE DERNIER TAUX 
            $tauxDuJour =  TauxJournalier::orderBy('id', 'desc')->first();

            TauxJournalier::create([
                "DateTaux" => $request->dateWork,
                "Dollar" => $tauxDuJour->Dollar,
                "TauxEnFc" => $tauxDuJour->TauxEnFc,
            ]);
            // RENSEIGNE LA DATE DANS LA TABLE CLOSED DAY

            ClosedDay::create([
                "closed" => 1,
                "DateSysteme" => $request->dateWork,

            ]);
        } else {
            //ON RECUPERE LE DERNIER TAUX 
            $tauxDuJour =  TauxJournalier::orderBy('id', 'desc')->first();
            TauxJournalier::create([
                "DateTaux" => $request->dateWork,
                "Dollar" => $request->usd,
                "TauxEnFc" => $request->Taux,
            ]);

            // RENSEIGNE LA DATE DANS LA TABLE CLOSED DAY

            ClosedDay::create([
                "closed" => 1,
                "DateSysteme" => $request->dateWork,

            ]);

            // return response()->json(["success" => 0, "msg" => "Vous n'avez pas definie la date ou le taux."]);
        }
        return response()->json(["success" => 1, "msg" => "La date du sytème a été definie avec succès merci."]);
    }


    //PERMET D'OUVRIR UNE NOUVELLE JOURNEE
    public function openNewday()
    {
        ClosedDay::where("closed", "=", 1)->update([
            "closed" => 0,
        ]);
        return response()->json(["success" => 1, "msg" => "Vous avez ouvert cette journée avec succès."]);
    }

    //AFFICHE LA PAGE POUR POSTER
    public function getPostagePage()
    {
        return view('postage');
    }
}
