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

                    //ICI ON VERIFIE S'IL YA PAS EU UN REMBOURSEMENT QUI N'A PAS ETE COMPLET ET QUE LE MONTANT N'A PAS ETE COMPLET
                    $checkRemboursement = Remboursementcredit::where("RefEcheance", "=", $dataMembre->ReferenceEch)->where("JoursRetard", ">", 0)->first();
                    if ($checkRemboursement) {
                        //SI LE MEMBRE EST EN RETARD DE REMBOURSEMENT ON VA METTRE A JOUR CE REMBOURSEMENT
                        $capitalDejaRembourse = $checkRemboursement->CapitalPaye;
                        $interetDejaRembourse = $checkRemboursement->InteretPaye;
                        $capitalManquant = $capitalAmmortie - $capitalDejaRembourse;
                        $interetManquant = $interetAmortie - $interetDejaRembourse;
                        $soldeDuMembreCDF = $soldeMembreCDF->soldeCDF;
                        $capitalAccorde = $dataMembre->MontantAccorde;
                        //ON VERIFIE SI LE SOLDE ACTUEL DU MEMBRE EST SUPERIEUR OU EGALE AU CREDIT QUI'IL DETIEN EN CAPITAL + L'INTERET
                        if ($soldeDuMembreCDF >= ($capitalManquant + $interetManquant))
                        //PUIS ON VA EFFECTUER UN REMBOURSEMENT EN METANT A JOUR CETTE LIGNE
                        {
                            Remboursementcredit::where("RefEcheance", "=", $dataMembre->ReferenceEch)->update([
                                "CapitalPaye" => $capitalDejaRembourse + $capitalManquant,
                                "InteretPaye" => $interetDejaRembourse + $interetManquant,
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
                                    "Debitfc" =>  $interetManquant,
                                    "Credit$" =>  $interetManquant / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
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
                                    "Debitfc" =>  $capitalManquant,
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
                                    "Debit$" =>  $capitalApaye / $tauxDuJour,
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
                                "Debitfc" => $capitalApayer,
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
                        $capitalAccorde = $dataMembre->MontantAccorde;
                        //SI LE SOLDE DU MEMBRE COUVRE SA DETTE POUR CETTE TRANCHE CAD CAPITAL AMORTI + INTERET AMORTI
                        if ($soldeDuMembreCDF >= ($capitalAmmortie + $interetAmortie)) {

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
                                    "Debitfc" =>  $interetPaye,
                                    "Credit$" => $interetPaye / $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre->NumDossier,
                                    "refCompteMembre" => $dataMembre->numAdherant,
                                ]);


                                //PUIS CONSTATE LE PAIEMENT SUR LA TABLE ECHEANCIER

                                Echeancier::where("echeanciers.ReferenceEch", "=", $dataMembre->ReferenceEch)
                                    ->update([
                                        "statutPayement" => "1",
                                    ]);
                            }

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
                                    "Debitfc" => $capitalApayer,
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
                                    "Creditfc" =>  $capitalApaye,
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
                            }
                            //SINON SI LE MONTANT A REMBOURSER EST INFERIEUR AU CAPITAL QUE LE MEMBRE DOIT
                            //CELA SIGNIFIE QU'UNE PARTIE DU CAPITAL EST D'INTERET RESTE EN RETARD

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
                                "Debitfc" => $capitalApayer,
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
            return response()->json(["success" => 1, "msg" => "Remboursement bien effectué"]);
        }
    }

    //AFFICHE LA PAGE POUR POSTER
    public function getPostagePage()
    {
        return view('postage');
    }
}
