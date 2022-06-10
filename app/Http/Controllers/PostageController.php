<?php

namespace App\Http\Controllers;

use App\Models\Echeancier;
use App\Models\Portefeuille;
use App\Models\Transactions;
use Illuminate\Http\Request;
use App\Models\TauxJournalier;
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

        //RECUPERE TOUT LES MEMBRES QUI ONT UN CREDIT EN CDF
        $dateDuJour = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
        $tauxDuJour =  TauxJournalier::orderBy('id', 'desc')->first()->TauxEnFc;
        $dataMembre = Portefeuille::where("portefeuilles.Cloture", "=", 0)
            ->where("portefeuilles.Octroye", "=", 1)
            ->join('echeanciers', 'echeanciers.NumDossier', '=', 'portefeuilles.NumDossier')
            ->where("echeanciers.DateTranch", "=", $dateDuJour)
            ->where("portefeuilles.CodeMonnaie", "=", "CDF")
            ->where("echeanciers.statutPayement", "=", 0)
            ->where("echeanciers.CapAmmorti", ">", 0)->get();
        //RECUPERE TOUT LE MEMBRE QUI ONT UN CREDIT EN USD

        $dataMembreUSD = Portefeuille::where("portefeuilles.Cloture", "=", 0)
            ->where("portefeuilles.Octroye", "=", 1)
            ->join('echeanciers', 'echeanciers.NumDossier', '=', 'portefeuilles.NumDossier')
            ->where("echeanciers.DateTranch", "=", $dateDuJour)
            ->where("portefeuilles.CodeMonnaie", "=", "USD")
            ->where("echeanciers.statutPayement", "=", 0)
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
                //LE CODE SUIVANT DOIT ETRE EXECUTE SEULEMENT SI LE SOLDE DU MEMBRE EST SUPERIEUR A ZERO
                if ($soldeMembreCDF->soldeCDF > 0) {
                    $capitalAmmortie = $dataMembre->CapAmmorti;
                    $interetAmortie = $dataMembre->Interet;
                    $epargneAmmortie = $dataMembre->Epargne;

                    //ICI ON VERIFIE S'IL YA PAS EU UN REMBOURSEMENT QUI N'A PAS ETE COMPLET ET QUE LE MONTANT N'A PAS ETE COMPLET
                    $checkRemboursement = Remboursementcredit::where("RefEcheance", "=", $dataMembre->ReferenceEch)->where("JoursRetard", ">", 0)->first();
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
                            Remboursementcredit::where("RefEcheance", "=", $dataMembre->ReferenceEch)->update([
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
                                "Retard1" => 0,
                                "Retard2" => 0,
                                "Retard3" => 0,
                                "Retard4" => 0,
                                "Retard5" => 0,
                                "JourRetard" => 0,
                            ]);
                            //PUIS CONSTATE LE PAIEMENT SUR LA TABLE ECHEANCIER

                            Echeancier::where("echeanciers.ReferenceEch", "=", $dataMembre->ReferenceEch)
                                ->update([
                                    "statutPayement" => "1",
                                ]);


                            //PUIS PASSE LE ECRITURE DE DEBIT SUR LE COMPTE DU MEMBRE

                            CompteurTransaction::create([
                                'fakevalue' => "0000",
                            ]);
                            $numOperation = [];
                            $numOperation = CompteurTransaction::latest()->first();
                            $NumTransaction = "AT00" . $numOperation->id;
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
                                "Libelle" => "Remboursement capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
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
                                "Libelle" => "Remboursement capital  de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
                                "refCompteMembre" => $dataMembre->numAdherant,
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
                                    "Libelle" => "Remboursement intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
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
                                    "Credit" =>  $interetManquant,
                                    // "Operant" =>  Auth::user()->name,
                                    "Creditfc" =>  $interetManquant,
                                    "Credit$" =>  $interetManquant / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);

                                //CREDITE LE COMPTE INTERET
                                $compteInteret = 712000000202;
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
                                    "Libelle" => "Paiement intérêt du crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
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
                                    "Libelle" => "Remboursement epargne garantie de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
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
                                    "Libelle" => "Remboursement Epargne garantie de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
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


                                CompteurTransaction::create([
                                    'fakevalue' => "0000",
                                ]);
                                $numOperation = [];
                                $numOperation = CompteurTransaction::latest()->first();
                                $NumTransaction = "AT00" . $numOperation->id;
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
                                    "Libelle" => "Remboursement capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
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
                                    "Libelle" => "Remboursement capital  de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);

                                Remboursementcredit::where("RefEcheance", "=", $dataMembre->ReferenceEch)->update([
                                    "CapitalPaye" => $capitalDejaRembourse + $capitalManquant,
                                    "InteretPaye" => $interetDejaRembourse + $interetManquant,
                                    "JoursRetard" => $checkRemboursement->JoursRetard + 1,
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
                                    "Retard1" => $dataMembre->Retard1 + 1,
                                    "JourRetard" =>  $dataMembre->JourRetard + 1,
                                ]);
                                //SINON SI LE SOLDE DU MEMBRE EST SUPERIEUR AU CAPITAL AMORTI QU'IL DOIT
                            } else if ($soldeDuMembreCDF > $capitalManquant) {
                                $capitalApaye = $soldeDuMembreCDF - $capitalManquant;
                                $interetApayer = $soldeDuMembreCDF - $capitalApaye;


                                CompteurTransaction::create([
                                    'fakevalue' => "0000",
                                ]);
                                $numOperation = [];
                                $numOperation = CompteurTransaction::latest()->first();
                                $NumTransaction = "AT00" . $numOperation->id;
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
                                    "Libelle" => "Remboursement capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
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
                                    "Libelle" => "Remboursement capital  de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
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
                                        "Libelle" => "Remboursement partiel intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
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
                                        "Credit" =>  $interetApayer,
                                        // "Operant" =>  Auth::user()->name,
                                        "Creditfc" =>  $interetApayer,
                                        "Credit$" => $interetApayer / $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement partiel intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
                                        "refCompteMembre" => $dataMembre->numAdherant,
                                    ]);

                                    $compteInteret = 712000000202;
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
                                        "Libelle" => "Remboursement intérêt du crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
                                        "refCompteMembre" => $dataMembre->numAdherant,
                                    ]);
                                }

                                Remboursementcredit::where("RefEcheance", "=", $dataMembre->ReferenceEch)->update([
                                    "CapitalPaye" => $capitalDejaRembourse + $capitalApaye,
                                    "InteretPaye" => $interetDejaRembourse + $interetApayer,
                                    "JoursRetard" => $checkRemboursement->JoursRetard + 1,
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
                                    "Retard1" => $dataMembre->Retard1 + 1,
                                    "JourRetard" =>  $dataMembre->JourRetard + 1,
                                ]);
                            }
                            //SINON SI LE MONTANT A REMBOURSER EST INFERIEUR AU CAPITAL QUE LE MEMBRE DOIT
                            //CELA SIGNIFIE QU'UNE PARTIE DU CAPITAL EST D'INTERET RESTE EN RETARD

                        } else if ($soldeDuMembreCDF < $capitalManquant) {
                            $capitalApayer = $soldeDuMembreCDF;

                            CompteurTransaction::create([
                                'fakevalue' => "0000",
                            ]);
                            $numOperation = [];
                            $numOperation = CompteurTransaction::latest()->first();
                            $NumTransaction = "AT00" . $numOperation->id;
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
                                "Libelle" => "Remboursement partiel capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
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
                                "Libelle" => "Remboursement partiel capital  de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
                                "refCompteMembre" => $dataMembre->numAdherant,
                            ]);

                            Remboursementcredit::where("RefEcheance", "=", $dataMembre->ReferenceEch)->update([
                                "CapitalPaye" => $capitalDejaRembourse + $capitalApayer,
                                "JoursRetard" => $checkRemboursement->JoursRetard + 1,
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
                                "Retard1" => $dataMembre->Retard1 + 1,
                                "JourRetard" =>  $dataMembre->JourRetard + 1,
                            ]);
                            //SINON SI LE SOLDE ET A ZERO CA SIGNIFIE QUE LE MEMBRE EST EN RETARD DE REMBOURSEMENT EN TOUS
                        } else if ($soldeDuMembreCDF == 0) {

                            Remboursementcredit::where("RefEcheance", "=", $dataMembre->ReferenceEch)->update([
                                "JoursRetard" => $checkRemboursement->JoursRetard + 1,
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
                                "Retard1" => $dataMembre->Retard1 + 1,
                                "JourRetard" =>  $dataMembre->JourRetard + 1,
                            ]);
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

                            CompteurTransaction::create([
                                'fakevalue' => "0000",
                            ]);
                            $numOperation = [];
                            $numOperation = CompteurTransaction::latest()->first();
                            $NumTransaction = "AT00" . $numOperation->id;
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
                                "Libelle" => "Remboursement capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
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
                                "Libelle" => "Remboursement capital  de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
                                "refCompteMembre" => $dataMembre->numAdherant,
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
                                    "Libelle" => "Remboursement intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
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
                                    "Credit" =>  $interetPaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Creditfc" =>  $interetPaye,
                                    "Credit$" => $interetPaye / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);


                                //CREDITE LE COMPTE INTERET
                                $compteInteret = 712000000202;
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
                                    "Libelle" => "Remboursement intérêt du crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
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
                                    "Libelle" => "Remboursement Epargne garantie de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
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
                                    "NumCompte" => $dataMembre->NumCompteEpargneGarantie,
                                    "NumComptecp" =>  $dataMembre->NumCompteEpargne,
                                    "Credit" => $EpargnePaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Creditfc" =>  $EpargnePaye,
                                    "Credit$" => $EpargnePaye / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement Epargne garantie de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);
                            }


                            //PUIS CONSTATE LE PAIEMENT SUR LA TABLE ECHEANCIER

                            Echeancier::where("echeanciers.ReferenceEch", "=", $dataMembre->ReferenceEch)
                                ->update([
                                    "statutPayement" => "1",
                                ]);

                            //SINON SI LE SOLDE DU MEMBRE EST INFERIEUR AU CAPITAL AMMORTI + INTERET AMMORTI

                        } else if ($soldeDuMembreCDF < ($capitalAmmortie + $interetAmortie)) {
                            //SI  LE SOLDE DU MEMBRE EST EGAL AU CAPITAL QUI'IL DOIT
                            if ($soldeDuMembreCDF == $capitalAmmortie) {
                                $capitalApayer = $soldeDuMembreCDF;
                                CompteurTransaction::create([
                                    'fakevalue' => "0000",
                                ]);
                                $numOperation = [];
                                $numOperation = CompteurTransaction::latest()->first();
                                $NumTransaction = "AT00" . $numOperation->id;
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
                                    "Libelle" => "Remboursement partiel capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
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
                                    "Libelle" => "Remboursement partiel capital  de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);
                                //ON EFFECTUE LE REMBOURSEMENT EN CAPITAL UNIQUEMENT
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
                                    "Retard1" => $dataMembre->Retard1 + 1,
                                    "JourRetard" =>  $dataMembre->JourRetard + 1,
                                    "InteretRetardIn" => $interetAmorti,
                                ]);
                            } else if ($soldeDuMembreCDF > $capitalAmmorti) {
                                $capitalApaye = $soldeDuMembreCDF - $capitalAmmorti;
                                $interetApayer = $soldeDuMembreCDF - $capitalApaye;
                                CompteurTransaction::create([
                                    'fakevalue' => "0000",
                                ]);
                                $numOperation = [];
                                $numOperation = CompteurTransaction::latest()->first();
                                $NumTransaction = "AT00" . $numOperation->id;
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
                                    "Libelle" => "Remboursement capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
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
                                    "Libelle" => "Remboursement capital  de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
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
                                        "Libelle" => "Remboursement partiel intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
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
                                        "Credit" =>  $interetApayer,
                                        // "Operant" =>  Auth::user()->name,
                                        "Creditfc" =>  $interetApayer,
                                        "Credit$" => $interetApayer / $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement partiel intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
                                        "refCompteMembre" => $dataMembre->numAdherant,
                                    ]);


                                    //CREDITE LE COMPTE INTERET
                                    $compteInteret = 712000000202;
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
                                        "Libelle" => "Remboursement partiel intérêt du crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
                                        "refCompteMembre" => $dataMembre->numAdherant,
                                    ]);
                                }


                                //ON EFFECTUE LE REMBOURSEMENT EN CAPITAL UNIQUEMENT
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
                                    "Retard1" => $dataMembre->Retard1 + 1,
                                    "JourRetard" =>  $dataMembre->JourRetard + 1,
                                ]);
                            } else if ($soldeDuMembreCDF < $capitalAmmorti) {
                                $capitalApayer = $soldeDuMembreCDF;

                                CompteurTransaction::create([
                                    'fakevalue' => "0000",
                                ]);
                                $numOperation = [];
                                $numOperation = CompteurTransaction::latest()->first();
                                $NumTransaction = "AT00" . $numOperation->id;
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
                                    "Libelle" => "Remboursement partiel capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
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
                                    "Libelle" => "Remboursement partiel capital  de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);


                                //ON EFFECTUE LE REMBOURSEMENT EN CAPITAL UNIQUEMENT
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
                                    "Retard1" => $dataMembre->Retard1 + 1,
                                    "JourRetard" =>  $dataMembre->JourRetard + 1,
                                ]);
                            }
                            //SINON SI LE MONTANT A REMBOURSER EST INFERIEUR AU CAPITAL QUE LE MEMBRE DOIT
                            //CELA SIGNIFIE QU'UNE PARTIE DU CAPITAL EST D'INTERET RESTE EN RETARD

                        } else if ($soldeDuMembreCDF == 0) {

                            Remboursementcredit::where("RefEcheance", "=", $dataMembre->ReferenceEch)->update([
                                "JoursRetard" => $checkRemboursement->JoursRetard + 1,
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
                                "Retard1" => $dataMembre->Retard1 + 1,
                                "JourRetard" =>  $dataMembre->JourRetard + 1,
                            ]);
                        }
                    }
                }
            }
















            //ICI LE SCRIPT POUR LE REMBOURESEMENT EN USD
        } else if (count($dataMembreUSD) != 0) {



            for ($i = 0; $i < sizeof($dataMembreUSD); $i++) {
                $response[] = $dataMembreUSD[$i];
            }
            foreach ($response as $dataMembreUSD) {
                //RECUPERE LE SOLDE DE CHAQUE COMPTE DONT SON ECHEANCE TOMBE

                $soldeMembreUSD = Transactions::select(
                    DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeUSD"),
                )->where("NumCompte", '=', $dataMembreUSD->NumCompteEpargne)
                    ->groupBy("NumCompte")
                    ->first();
                //LE CODE SUIVANT DOIT ETRE EXECUTE SEULEMENT SI LE SOLDE DU MEMBRE EST SUPERIEUR A ZERO
                if ($soldeMembreUSD->soldeUSD > 0) {
                    $capitalAmmortie = $dataMembreUSD->CapAmmorti;
                    $interetAmortie = $dataMembreUSD->Interet;
                    $epargneAmmortie = $dataMembreUSD->Epargne;

                    //ICI ON VERIFIE S'IL YA PAS EU UN REMBOURSEMENT QUI N'A PAS ETE COMPLET ET QUE LE MONTANT N'A PAS ETE COMPLET
                    $checkRemboursement = Remboursementcredit::where("RefEcheance", "=", $dataMembreUSD->ReferenceEch)->where("JoursRetard", ">", 0)->first();
                    if ($checkRemboursement) {
                        //SI LE MEMBRE EST EN RETARD DE REMBOURSEMENT ON VA METTRE A JOUR CE REMBOURSEMENT
                        $capitalDejaRembourse = $checkRemboursement->CapitalPaye;
                        $interetDejaRembourse = $checkRemboursement->InteretPaye;
                        $epagneDejaRembourse = $checkRemboursement->EpargnePaye;
                        $epargneManquant = $epargneAmmortie - $epagneDejaRembourse;
                        $capitalManquant = $capitalAmmortie - $capitalDejaRembourse;
                        $interetManquant = $interetAmortie - $interetDejaRembourse;
                        $soldeDuMembreUSD = $soldeMembreUSD->soldeUSD;
                        $capitalAccorde = $dataMembreUSD->MontantAccorde;
                        //ON VERIFIE SI LE SOLDE ACTUEL DU MEMBRE EST SUPERIEUR OU EGALE AU CREDIT QUI'IL DETIEN EN CAPITAL + L'INTERET
                        if ($soldeDuMembreUSD >= ($capitalManquant + $interetManquant + $epargneAmmortie))
                        //PUIS ON VA EFFECTUER UN REMBOURSEMENT EN METANT A JOUR CETTE LIGNE
                        {
                            Remboursementcredit::where("RefEcheance", "=", $dataMembreUSD->ReferenceEch)->update([
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
                            //PUIS CONSTATE LE PAIEMENT SUR LA TABLE ECHEANCIER

                            Echeancier::where("echeanciers.ReferenceEch", "=", $dataMembreUSD->ReferenceEch)
                                ->update([
                                    "statutPayement" => "1",
                                ]);


                            //PUIS PASSE LE ECRITURE DE DEBIT SUR LE COMPTE DU MEMBRE

                            CompteurTransaction::create([
                                'fakevalue' => "0000",
                            ]);
                            $numOperation = [];
                            $numOperation = CompteurTransaction::latest()->first();
                            $NumTransaction = "AT00" . $numOperation->id;
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
                                "Libelle" => "Remboursement capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
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
                                "Libelle" => "Remboursement capital  de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                "refCompteMembre" => $dataMembreUSD->numAdherant,
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
                                    "Libelle" => "Remboursement intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
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
                                    "Credit" =>  $interetManquant,
                                    // "Operant" =>  Auth::user()->name,
                                    "Credit$" =>  $interetManquant,
                                    "Creditfc" =>  $interetManquant * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                    "refCompteMembre" => $dataMembreUSD->numAdherant,
                                ]);

                                //CREDITE LE COMPTE INTERET
                                $compteInteret = 712000000201;
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
                                    "Libelle" => "Paiement intérêt du crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
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
                                    "Libelle" => "Remboursement epargne garantie de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
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
                                    "Libelle" => "Remboursement Epargne garantie de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                    "refCompteMembre" => $dataMembreUSD->numAdherant,
                                ]);
                            }







                            //SINON SI LE SOLDE DU MEMBRE EST INFERIEUR A LA DETTE QU'IL DOIT CAD INTERE + CAPITAL 
                            //ON PREND LE CAPITAL ET CE QUI RESTE ON LE MET EN INTERET MET IL RESTE EN RETARD
                        } else if ($soldeDuMembreUSD < ($capitalManquant + $interetManquant)) {
                            //ON VERIFIE SI LE SOLDE DU MEMBRE EST EGAL AU CAPITAL QU'IL DOIT
                            if ($soldeDuMembreUSD == $capitalManquant) {
                                $capitalManquant = $soldeDuMembreUSD;
                                //PUIS PASSE LE ECRITURE DE DEBIT SUR LE COMPTE DU MEMBRE


                                CompteurTransaction::create([
                                    'fakevalue' => "0000",
                                ]);
                                $numOperation = [];
                                $numOperation = CompteurTransaction::latest()->first();
                                $NumTransaction = "AT00" . $numOperation->id;
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
                                    "Libelle" => "Remboursement capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
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
                                    "Libelle" => "Remboursement capital  de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                    "refCompteMembre" => $dataMembreUSD->numAdherant,
                                ]);

                                Remboursementcredit::where("RefEcheance", "=", $dataMembreUSD->ReferenceEch)->update([
                                    "CapitalPaye" => $capitalDejaRembourse + $capitalManquant,
                                    "InteretPaye" => $interetDejaRembourse + $interetManquant,
                                    "JoursRetard" => $checkRemboursement->JoursRetard + 1,
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
                                    "Retard1" => $dataMembreUSD->Retard1 + 1,
                                    "JourRetard" =>  $dataMembreUSD->JourRetard + 1,
                                ]);
                                //SINON SI LE SOLDE DU MEMBRE EST SUPERIEUR AU CAPITAL AMORTI QU'IL DOIT
                            } else if ($soldeDuMembreUSD > $capitalManquant) {
                                $capitalApaye = $soldeDuMembreUSD - $capitalManquant;
                                $interetApayer = $soldeDuMembreUSD - $capitalApaye;


                                CompteurTransaction::create([
                                    'fakevalue' => "0000",
                                ]);
                                $numOperation = [];
                                $numOperation = CompteurTransaction::latest()->first();
                                $NumTransaction = "AT00" . $numOperation->id;
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
                                    "Libelle" => "Remboursement capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
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
                                    "Libelle" => "Remboursement capital  de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
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
                                        "Libelle" => "Remboursement partiel intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
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
                                        "Credit" =>  $interetApayer,
                                        // "Operant" =>  Auth::user()->name,
                                        "Credit$" =>  $interetApayer,
                                        "Creditfc" => $interetApayer * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement partiel intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);

                                    $compteInteret = 712000000201;
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
                                        "Libelle" => "Remboursement intérêt du crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);
                                }

                                Remboursementcredit::where("RefEcheance", "=", $dataMembreUSD->ReferenceEch)->update([
                                    "CapitalPaye" => $capitalDejaRembourse + $capitalApaye,
                                    "InteretPaye" => $interetDejaRembourse + $interetApayer,
                                    "JoursRetard" => $checkRemboursement->JoursRetard + 1,
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
                                    "Retard1" => $dataMembreUSD->Retard1 + 1,
                                    "JourRetard" =>  $dataMembreUSD->JourRetard + 1,
                                ]);
                            }
                            //SINON SI LE MONTANT A REMBOURSER EST INFERIEUR AU CAPITAL QUE LE MEMBRE DOIT
                            //CELA SIGNIFIE QU'UNE PARTIE DU CAPITAL EST D'INTERET RESTE EN RETARD

                        } else if ($soldeDuMembreUSD < $capitalManquant) {
                            $capitalApayer = $soldeDuMembreUSD;

                            CompteurTransaction::create([
                                'fakevalue' => "0000",
                            ]);
                            $numOperation = [];
                            $numOperation = CompteurTransaction::latest()->first();
                            $NumTransaction = "AT00" . $numOperation->id;
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
                                "Libelle" => "Remboursement partiel capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
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
                                "Libelle" => "Remboursement partiel capital  de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                "refCompteMembre" => $dataMembreUSD->numAdherant,
                            ]);

                            Remboursementcredit::where("RefEcheance", "=", $dataMembreUSD->ReferenceEch)->update([
                                "CapitalPaye" => $capitalDejaRembourse + $capitalApayer,
                                "JoursRetard" => $checkRemboursement->JoursRetard + 1,
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
                                "Retard1" => $dataMembreUSD->Retard1 + 1,
                                "JourRetard" =>  $dataMembreUSD->JourRetard + 1,
                            ]);
                            //SINON SI LE SOLDE ET A ZERO CA SIGNIFIE QUE LE MEMBRE EST EN RETARD DE REMBOURSEMENT EN TOUS
                        } else if ($soldeDuMembreUSD == 0) {

                            Remboursementcredit::where("RefEcheance", "=", $dataMembreUSD->ReferenceEch)->update([
                                "JoursRetard" => $checkRemboursement->JoursRetard + 1,
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
                                "Retard1" => $dataMembreUSD->Retard1 + 1,
                                "JourRetard" =>  $dataMembreUSD->JourRetard + 1,
                            ]);
                        }
                    } else {
                        //ICI LA LOGIQUE DE SI LE MEMBRE N'ETAIT PAS EN RETARD DE REMBOURSEMENT
                        $soldeDuMembreUSD = $soldeMembreUSD->soldeUSD;
                        $capitalAmmorti = $dataMembreUSD->CapAmmorti;
                        $interetAmorti = $dataMembreUSD->Interet;
                        $capitalPaye = $capitalAmmorti;
                        $interetPaye = $interetAmorti;
                        $epargneGarantieAmmortie = $dataMembreUSD->Epargne;
                        $EpargnePaye = $epargneGarantieAmmortie;
                        $capitalAccorde = $dataMembreUSD->MontantAccorde;

                        //SI LE SOLDE DU MEMBRE COUVRE SA DETTE POUR CETTE TRANCHE CAD CAPITAL AMORTI + INTERET AMORTI
                        if ($soldeDuMembreUSD >= ($capitalAmmortie + $interetAmortie + $epargneGarantieAmmortie)) {

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

                            CompteurTransaction::create([
                                'fakevalue' => "0000",
                            ]);
                            $numOperation = [];
                            $numOperation = CompteurTransaction::latest()->first();
                            $NumTransaction = "AT00" . $numOperation->id;
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
                                "Libelle" => "Remboursement capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
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
                                "Libelle" => "Remboursement capital  de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                "refCompteMembre" => $dataMembreUSD->numAdherant,
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
                                    "Libelle" => "Remboursement intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
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
                                    "Credit" =>  $interetPaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Credit$" =>  $interetPaye,
                                    "Creditfc" => $interetPaye * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                    "refCompteMembre" => $dataMembreUSD->numAdherant,
                                ]);


                                //CREDITE LE COMPTE INTERET
                                $compteInteret = 712000000201;
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
                                    "Libelle" => "Remboursement intérêt du crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
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
                                    "Libelle" => "Remboursement Epargne garantie de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
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
                                    "NumCompte" => $dataMembreUSD->NumCompteEpargneGarantie,
                                    "NumComptecp" =>  $dataMembreUSD->NumCompteEpargne,
                                    "Credit" => $EpargnePaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Credit$" =>  $EpargnePaye,
                                    "Creditfc" => $EpargnePaye * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement Epargne garantie de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                    "refCompteMembre" => $dataMembreUSD->numAdherant,
                                ]);
                            }


                            //PUIS CONSTATE LE PAIEMENT SUR LA TABLE ECHEANCIER

                            Echeancier::where("echeanciers.ReferenceEch", "=", $dataMembreUSD->ReferenceEch)
                                ->update([
                                    "statutPayement" => "1",
                                ]);

                            //SINON SI LE SOLDE DU MEMBRE EST INFERIEUR AU CAPITAL AMMORTI + INTERET AMMORTI

                        } else if ($soldeDuMembreUSD < ($capitalAmmortie + $interetAmortie)) {
                            //SI  LE SOLDE DU MEMBRE EST EGAL AU CAPITAL QUI'IL DOIT
                            if ($soldeDuMembreUSD == $capitalAmmortie) {
                                $capitalApayer = $soldeDuMembreUSD;
                                CompteurTransaction::create([
                                    'fakevalue' => "0000",
                                ]);
                                $numOperation = [];
                                $numOperation = CompteurTransaction::latest()->first();
                                $NumTransaction = "AT00" . $numOperation->id;
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
                                    "Libelle" => "Remboursement partiel capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
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
                                    "Libelle" => "Remboursement partiel capital  de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                    "refCompteMembre" => $dataMembreUSD->numAdherant,
                                ]);
                                //ON EFFECTUE LE REMBOURSEMENT EN CAPITAL UNIQUEMENT
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
                                    "Retard1" => $dataMembreUSD->Retard1 + 1,
                                    "JourRetard" =>  $dataMembreUSD->JourRetard + 1,
                                    "InteretRetardIn" => $interetAmorti,
                                ]);
                            } else if ($soldeDuMembreUSD > $capitalAmmorti) {
                                $capitalApaye = $soldeDuMembreUSD - $capitalAmmorti;
                                $interetApayer = $soldeDuMembreUSD - $capitalApaye;
                                CompteurTransaction::create([
                                    'fakevalue' => "0000",
                                ]);
                                $numOperation = [];
                                $numOperation = CompteurTransaction::latest()->first();
                                $NumTransaction = "AT00" . $numOperation->id;
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
                                    "Libelle" => "Remboursement capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
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
                                    "Debit$" =>  $capitalApaye,
                                    "Debitfc" =>  $capitalApaye * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital  de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                    "refCompteMembre" => $dataMembreUSD->numAdherant,
                                ]);
                                if ($interetApayer > 0) {


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
                                        "Debit" =>  $interetApayer,
                                        // "Operant" =>  Auth::user()->name,
                                        "Debit$" =>  $interetApayer,
                                        "Debitfc" =>  $interetApayer * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement partiel intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
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
                                        "Credit" =>  $interetApayer,
                                        // "Operant" =>  Auth::user()->name,
                                        "Credit$" =>  $interetApayer,
                                        "Creditfc" => $interetApayer * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement partiel intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);


                                    //CREDITE LE COMPTE INTERET
                                    $compteInteret = 712000000201;
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
                                        "Libelle" => "Remboursement partiel intérêt du crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                        "refCompteMembre" => $dataMembreUSD->numAdherant,
                                    ]);
                                }


                                //ON EFFECTUE LE REMBOURSEMENT EN CAPITAL UNIQUEMENT
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
                                    "Retard1" => $dataMembreUSD->Retard1 + 1,
                                    "JourRetard" =>  $dataMembreUSD->JourRetard + 1,
                                ]);
                            } else if ($soldeDuMembreUSD < $capitalAmmorti) {
                                $capitalApayer = $soldeDuMembreUSD;

                                CompteurTransaction::create([
                                    'fakevalue' => "0000",
                                ]);
                                $numOperation = [];
                                $numOperation = CompteurTransaction::latest()->first();
                                $NumTransaction = "AT00" . $numOperation->id;
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
                                    "Libelle" => "Remboursement  capital partiel de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
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
                                    "Libelle" => "Remboursement partiel capital  de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembreUSD->NumDossier,
                                    "refCompteMembre" => $dataMembreUSD->numAdherant,
                                ]);


                                //ON EFFECTUE LE REMBOURSEMENT EN CAPITAL UNIQUEMENT
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
                                    "Retard1" => $dataMembreUSD->Retard1 + 1,
                                    "JourRetard" =>  $dataMembreUSD->JourRetard + 1,
                                ]);
                            }
                            //SINON SI LE MONTANT A REMBOURSER EST INFERIEUR AU CAPITAL QUE LE MEMBRE DOIT
                            //CELA SIGNIFIE QU'UNE PARTIE DU CAPITAL EST D'INTERET RESTE EN RETARD

                        } else if ($soldeDuMembreUSD == 0) {

                            Remboursementcredit::where("RefEcheance", "=", $dataMembreUSD->ReferenceEch)->update([
                                "JoursRetard" => $checkRemboursement->JoursRetard + 1,
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
                                "Retard1" => $dataMembreUSD->Retard1 + 1,
                                "JourRetard" =>  $dataMembreUSD->JourRetard + 1,
                            ]);
                        }
                    }
                }
            }
        } else {
            return response()->json(["success" => 1, "msg" => "Clôture bien effectuée"]);
        }
        return response()->json(["success" => 1, "msg" => "Clotûre bien effectuée"]);
    }

    //PERMET DE DEFINR LA DATE DU SYSTEME

    public function definrDateSysteme(Request $request)
    {
        if (isset($request->dateWork) and isset($request->Taux)) {
            TauxJournalier::create([
                "DateTaux" => $request->dateWork,
                "Dollar" => $request->usd,
                "TauxEnFc" => $request->Taux,
            ]);
        } else {

            return response()->json(["success" => 0, "msg" => "Vous n'avez pas definie la date ou le taux."]);
        }
        return response()->json(["success" => 1, "msg" => "La date du sytème a été definie avec succès merci."]);
    }

    //AFFICHE LA PAGE POUR POSTER
    public function getPostagePage()
    {
        return view('postage');
    }
}
