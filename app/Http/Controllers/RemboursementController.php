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

class RemboursementController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }


    //PERMET D'EFFECTUER UN REMBOURSEMENT MANUEL EN CAPITAL

    public function remboursementEnCapital(Request $request)
    {

        if (isset($request->NumDossier) and isset($request->RemboursCapital)) {

            //AVANT TOUTE CHOSE ON VERIFIE SI LE SOLDE DU MEMBRE EST SUFFISANT
            $compteCreditAuxMembreCDF = "3210000000202";
            $compteCreditAuxMembreUSD = "3210000000201";
            //RECUPERE LE SOLDE DU MEMBRE EN FC EN CDF
            $getPorteFeuilledata = Portefeuille::where("NumDossier", "=", $request->NumDossier)->first();
            if ($getPorteFeuilledata->CodeMonnaie == "CDF") {
                $soldeMembreCDF = Transactions::select(
                    DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeMembreCDF"),
                )->where("NumCompte", '=', $getPorteFeuilledata->NumCompteEpargne)
                    ->groupBy("NumCompte")
                    ->first();

                if ($soldeMembreCDF->soldeMembreCDF < $request->RemboursCapital) {
                    return response()->json(['success' => 0, 'msg' => "le solde de ce compte est insuffisant veuillez d'abord effectué un dépot à ce compte solde disponible CDF: " . $soldeMembreCDF->soldeMembreCDF . " .00" . ""]);
                }
            } else if ($getPorteFeuilledata->CodeMonnaie == "USD") {
                $soldeMembreUSD = Transactions::select(
                    DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
                )->where("NumCompte", '=', $getPorteFeuilledata->NumCompteEpargne)
                    ->groupBy("NumCompte")
                    ->first();

                if ($soldeMembreUSD->soldeMembreUSD < $request->RemboursCapital) {
                    return response()->json(['success' => 0, 'msg' => "le solde de ce compte est insuffisant veuillez d'abord effectué un dépot à ce compte solde disponible USD: " . $soldeMembreUSD->soldeMembreUSD . " .00" . ""]);
                }
            }


            // ON VERIFIE SI LA PERSONNE NE PAS A RETARD DE REMBOURSEMENT

            $getNbrJrRetard = Remboursementcredit::where("NumDossie", "=", $request->NumDossier)->first();
            if ($getNbrJrRetard->JoursRetard > 0) {
                if ($getNbrJrRetard->CapitalPaye + $request->RemboursCapital >= $getNbrJrRetard->CapitalAmmortie) {
                    Remboursementcredit::where("NumDossie", "=", $request->NumDossier)->where("JoursRetard", ">", 0)->update([
                        "CapitalPaye" => $getNbrJrRetard->CapitalPaye + $request->RemboursCapital,
                        "JoursRetard" => 0,
                    ]);
                    //RECUPERE LE CREDIT CORRESPONDANT A CE MEMBRE

                    //RECUPEPERE LA SOMME DU CAPITAL RESTANT
                    $totCapPaye = Remboursementcredit::select(
                        DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                    )->where("remboursementcredits.NumDossie", "=", $request->NumDossier)
                        ->groupBy("remboursementcredits.NumDossie")
                        ->first();

                    $getPorteFeuilledata = Portefeuille::where("NumDossier", "=", $request->NumDossier)->first();
                    //RENSEIGNE LE CAPITAL  REMBOURSE ET LE CAPITAL RESTANT
                    $capRestant = $getPorteFeuilledata->MontantAccorde - $totCapPaye->totCapitalPaye;
                    Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
                        "RemboursCapital" => $totCapPaye->totCapitalPaye,
                        "CapitalRestant" => $capRestant,
                        "JourRetard" => 0,
                    ]);
                    //RENSEIGNE LE PAYEMENT
                    // Echeancier::where("NumDossier", "=", $request->NumDossier)
                    //     ->where("echeanciers.statutPayement", "=", 0)
                    //     ->where("echeanciers.CapAmmorti", ">", 0)
                    //     ->update([
                    //         "statutPayement" => 1,
                    //     ])->limit(1);
                } else {
                    Remboursementcredit::where("NumDossie", "=", $request->NumDossier)->where("JoursRetard", ">", 0)->update([
                        "CapitalPaye" => $getNbrJrRetard->CapitalPaye + $request->RemboursCapital,
                    ]);
                    //RECUPERE LE REMBOURSEMENT ATTENDU POUR CE MEMBRE

                    $getRoumboursement = Echeancier::where("echeanciers.NumDossier", "=", $request->NumDossier)->where("echeanciers.statutPayement", "=", 0)->where("echeanciers.CapAmmorti", ">", 0)
                        ->join('portefeuilles', 'portefeuilles.NumDossier', '=', 'echeanciers.NumDossier')
                        ->join('comptes', 'comptes.NumCompte', '=', 'portefeuilles.NumCompteEpargne')
                        ->join('remboursementcredits', 'remboursementcredits.RefEcheance', '=', 'echeanciers.ReferenceEch')
                        ->limit(1)->first();
                    $capitalEnRetard = $getRoumboursement->CapitalAmmortie - $getRoumboursement->CapitalPaye;
                    $getPorteFeuilledata = Portefeuille::where("NumDossier", "=", $request->NumDossier)->first();

                    //RECUPEPERE LA SOMME DU CAPITAL RESTANT
                    $totCapPaye = Remboursementcredit::select(
                        DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                    )->where("remboursementcredits.NumDossie", "=", $request->NumDossier)
                        ->groupBy("remboursementcredits.NumDossie")
                        ->first();
                    //RENSEIGNE LE CAPITAL  REMBOURSE ET LE CAPITAL RESTANT
                    $capRestant = $getPorteFeuilledata->MontantAccorde - $totCapPaye->totCapitalPaye;
                    Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
                        "RemboursCapital" => $totCapPaye->totCapitalPaye,
                        "CapitalRestant" => $capRestant,
                        "JourRetard" => $getPorteFeuilledata->JourRetard + 1,
                        "CapitalRetard" => $capitalEnRetard,
                    ]);
                }
                //PASSE LES ECRITURE DE DEBIT ET CREDIT SUR LE COMPTE




                if ($getPorteFeuilledata->CodeMonnaie == "USD") {
                    //CREDITE LE COMPTE EPARGNE DU MEMBRE
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

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                        "NumComptecp" => $getPorteFeuilledata->NumCompteCredit,
                        "Debit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" =>  $request->RemboursCapital,
                        "Debitfc" =>  $request->RemboursCapital * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE SON COMPTE CREDIT
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteCredit,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $request->RemboursCapital,
                        "Creditfc" =>  $request->RemboursCapital * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE LE COMPTE CREDIT 

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteCreditAuxMembreUSD,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $request->RemboursCapital,
                        "Creditfc" =>  $request->RemboursCapital * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital du crédit octroyé à " . $getPorteFeuilledata->NomCompte . " en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $compteCreditAuxMembreUSD,
                    ]);




                    return response()->json(['success' => 1, 'msg' => 'Remboursement bien effectué.']);
                } else if ($getPorteFeuilledata->CodeMonnaie == "CDF") {
                    //CREDITE LE COMPTE EPARGNE DU MEMBRE
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

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                        "NumComptecp" => $getPorteFeuilledata->NumCompteCredit,
                        "Debit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" =>  $request->RemboursCapital * $tauxDuJour,
                        "Debitfc" =>  $request->RemboursCapital,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE SON COMPTE CREDIT
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteCredit,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $request->RemboursCapital * $tauxDuJour,
                        "Creditfc" =>  $request->RemboursCapital,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE LE COMPTE CREDIT 

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteCreditAuxMembreCDF,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $request->RemboursCapital * $tauxDuJour,
                        "Creditfc" =>  $request->RemboursCapital,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital du crédit octroyé à " . $getPorteFeuilledata->NomCompte . " en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $compteCreditAuxMembreCDF,
                    ]);

                    return response()->json(['success' => 1, 'msg' => 'Remboursement bien effectué.']);
                }
            }
            //RECUPERE LE CREDIT CORRESPONDANT A CE MEMBRE

            $getPorteFeuilledata = Portefeuille::where("NumDossier", "=", $request->NumDossier)->first();

            //RECUPERE LE REMBOURSEMENT ATTENDU POUR CE MEMBRE
            $getRoumboursement = Echeancier::where("echeanciers.NumDossier", "=", $request->NumDossier)->where("echeanciers.statutPayement", "=", 0)->where("echeanciers.CapAmmorti", ">", 0)
                ->join('portefeuilles', 'portefeuilles.NumDossier', '=', 'echeanciers.NumDossier')
                ->join('comptes', 'comptes.NumCompte', '=', 'portefeuilles.NumCompteEpargne')
                ->leftJoin('remboursementcredits', 'remboursementcredits.RefEcheance', '=', 'echeanciers.ReferenceEch')
                ->limit(1)->first();

            //Si le montant à rembourser equivaut au montant que le membre doit payer pour cette tranche cad Cap  Ammorti
            if ($request->RemboursCapital == $getRoumboursement->CapAmmorti) {
                Remboursementcredit::create([
                    "RefEcheance" => $getRoumboursement->ReferenceEch,
                    "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                    "NumCompteCredit" => $getPorteFeuilledata->NumCompteCredit,
                    "NumDossie" => $getPorteFeuilledata->NumDossier,
                    "RefTypCredit" => $getPorteFeuilledata->RefTypeCredit,
                    "NomCompte" => $getPorteFeuilledata->NomCompte,
                    "DateTranche" => $getRoumboursement->DateTranch,
                    "CapitalAmmortie" => $getRoumboursement->CapAmmorti,
                    "CapitalPaye"  => $request->RemboursCapital,
                    "CodeGuichet" => $getPorteFeuilledata->CodeGuichet,
                    "NumAdherent" => $getPorteFeuilledata->numAdherant,
                ]);
                //RENSEIGNE LE CAPITAL  REMBOURSE ET LE CAPITAL RESTANT

                $totCapPaye = Remboursementcredit::select(
                    DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                )->where("remboursementcredits.NumDossie", "=", $request->NumDossier)
                    ->groupBy("remboursementcredits.NumDossie")
                    ->first();
                //RECUPEPERE LA SOMME DU CAPITAL RESTANT
                $capRestant = $getPorteFeuilledata->MontantAccorde - $totCapPaye->totCapitalPaye;
                Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
                    "RemboursCapital" => $totCapPaye->totCapitalPaye,
                    "CapitalRestant" => $getPorteFeuilledata->CapitalRestant + $capRestant,
                ]);

                if ($getPorteFeuilledata->CodeMonnaie == "USD") {
                    //CREDITE LE COMPTE EPARGNE DU MEMBRE
                    // $numCompteCreditCDF = 3270000000202;
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

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                        "NumComptecp" => $getPorteFeuilledata->NumCompteCredit,
                        "Debit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" =>  $request->RemboursCapital,
                        "Debitfc" =>  $request->RemboursCapital * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE SON COMPTE CREDIT
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteCredit,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $request->RemboursCapital,
                        "Creditfc" =>  $request->RemboursCapital * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE LE COMPTE CREDIT AGR

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteCreditAuxMembreUSD,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $request->RemboursCapital,
                        "Creditfc" =>  $request->RemboursCapital * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital du crédit octroyé à " . $getPorteFeuilledata->NomCompte . " en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $compteCreditAuxMembreUSD,

                    ]);
                } else if ($getPorteFeuilledata->CodeMonnaie == "CDF") {
                    //CREDITE LE COMPTE EPARGNE DU MEMBRE
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

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                        "NumComptecp" => $getPorteFeuilledata->NumCompteCredit,
                        "Debit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" =>  $request->RemboursCapital * $tauxDuJour,
                        "Debitfc" =>  $request->RemboursCapital,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE SON COMPTE CREDIT
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteCredit,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $request->RemboursCapital * $tauxDuJour,
                        "Creditfc" =>  $request->RemboursCapital,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE LE COMPTE CREDIT AGR

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteCreditAuxMembreCDF,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $request->RemboursCapital * $tauxDuJour,
                        "Creditfc" =>  $request->RemboursCapital,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital du crédit octroyé à " . $getPorteFeuilledata->NomCompte . " en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $compteCreditAuxMembreCDF,
                    ]);
                }
                //RENSEIGNE LE PAYEMENT
                // Echeancier::where("ReferenceEch", "=", $getRoumboursement->ReferenceEch)
                //     // ->where("echeanciers.statutPayement", "=", 0)
                //     // ->where("echeanciers.CapAmmorti", ">", 0)
                //     ->update([
                //         "statutPayement" => 1,
                //     ]);
                // // ->limit(1);




                return response()->json(['success' => 1, 'msg' => 'Remboursement bien effectué.']);

                //SI MONTANT REMBOURSER EST INFERIEUR AU CAPIATL ATENDU
            } else if ($request->RemboursCapital < $getRoumboursement->CapAmmorti) {
                //VERIFIE S'IL YA AU MOINS UN REMBOURSEMENT DEJA FAIT 

                $checkifRowExiste = Remboursementcredit::where("RefEcheance", "=", $getRoumboursement->ReferenceEch)->first();
                if ($checkifRowExiste) {
                    //SI AUMOINS UN REMBOURSEMENT A ETE FAIT ON LE MET A JOUR
                    Remboursementcredit::where("RefEcheance", "=", $getRoumboursement->ReferenceEch)->update([
                        "JoursRetard" => $getRoumboursement->JoursRetard + 1,
                        "CapitalPaye"  => $getRoumboursement->CapitalPaye + $request->RemboursCapital,
                    ]);
                } else {
                    //SINON ON INSERT LE NOUVEL REMBOURSEMENT POUR CETTE TRANCHE
                    $capitalEnRetard = $getRoumboursement->CapAmmorti - $request->RemboursCapital;
                    Remboursementcredit::create([
                        "RefEcheance" => $getRoumboursement->ReferenceEch,
                        "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                        "NumCompteCredit" => $getPorteFeuilledata->NumCompteCredit,
                        "NumDossie" => $getPorteFeuilledata->NumDossier,
                        "RefTypCredit" => $getPorteFeuilledata->RefTypeCredit,
                        "NomCompte" => $getPorteFeuilledata->NomCompte,
                        "DateTranche" => $getRoumboursement->DateTranch,
                        "DateRetard" => $getRoumboursement->DateTranch,
                        "JoursRetard" => 1,
                        "CapitalAmmortie" => $getRoumboursement->CapAmmorti,
                        "CapitalPaye"  => $request->RemboursCapital,
                        "CodeGuichet" => $getPorteFeuilledata->CodeGuichet,
                        "NumAdherent" => $getPorteFeuilledata->numAdherant,
                    ]);
                }


                // $NbrJrRetard  = Remboursementcredit::orderBy('id', 'desc')->first()->JoursRetard;
                // Remboursementcredit::where()

                //RECUPEPERE LA SOMME DU CAPITAL RESTANT
                $totCapPaye = Remboursementcredit::select(
                    DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                )->where("remboursementcredits.NumDossie", "=", $request->NumDossier)
                    ->groupBy("remboursementcredits.NumDossie")
                    ->first();
                //RENSEIGNE LE CAPITAL EN RETARD ET LE CAP REMBOURSE ET LE CAPITAL RESTANT
                $capRestant = $getPorteFeuilledata->MontantAccorde - $totCapPaye->totCapitalPaye;
                $capitalEnRetard = $getRoumboursement->CapAmmorti - $getRoumboursement->CapitalPaye;
                Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
                    "RemboursCapital" => $totCapPaye->totCapitalPaye,
                    "CapitalRestant" => $capRestant,
                    "CapitalRetard" =>  $capitalEnRetard,
                ]);




                if ($getPorteFeuilledata->CodeMonnaie == "USD") {
                    //CREDITE LE COMPTE EPARGNE DU MEMBRE
                    // $numCompteCreditCDF = 3270000000202;
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

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                        "NumComptecp" => $getPorteFeuilledata->NumCompteCredit,
                        "Debit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" =>  $request->RemboursCapital,
                        "Debitfc" =>  $request->RemboursCapital * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE SON COMPTE CREDIT
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteCredit,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $request->RemboursCapital,
                        "Creditfc" =>  $request->RemboursCapital * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE LE COMPTE CREDIT AGR

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteCreditAuxMembreUSD,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $request->RemboursCapital,
                        "Creditfc" =>  $request->RemboursCapital * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital du crédit octroyé à " . $getPorteFeuilledata->NomCompte . " en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $compteCreditAuxMembreUSD,
                    ]);



                    return response()->json(['success' => 1, 'msg' => 'Remboursement bien effectué.']);
                } else if ($getPorteFeuilledata->CodeMonnaie == "CDF") {
                    //CREDITE LE COMPTE EPARGNE DU MEMBRE
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

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                        "NumComptecp" => $getPorteFeuilledata->NumCompteCredit,
                        "Debit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" =>  $request->RemboursCapital * $tauxDuJour,
                        "Debitfc" =>  $request->RemboursCapital,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE SON COMPTE CREDIT
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteCredit,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $request->RemboursCapital * $tauxDuJour,
                        "Creditfc" =>  $request->RemboursCapital,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE LE COMPTE CREDIT 

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteCreditAuxMembreCDF,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $request->RemboursCapital * $tauxDuJour,
                        "Creditfc" =>  $request->RemboursCapital,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital du crédit octroyé à " . $getPorteFeuilledata->NomCompte . " en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $compteCreditAuxMembreCDF,
                    ]);



                    return response()->json(['success' => 1, 'msg' => 'Remboursement bien effectué.']);
                } else {
                    return response()->json(['success' => 0, 'msg' => 'Ooops un problème est servenue veuillez contacter votre administrateur système.']);
                }
                //SI LE MONTANT REMBOURSER EST SUPERIEUR A CAPITAL DU CA SIGNIFIE QUE LE MEMBRE EST EN AVANCE EN CAPITAL



            } else if ($request->RemboursCapital > $getRoumboursement->CapAmmorti) {
                //RECUPERE LE REMBOURSEMENT ATTENDU POUR CE MEMBRE

                $getRoumboursement = Echeancier::where("echeanciers.NumDossier", "=", $request->NumDossier)->where("echeanciers.statutPayement", "=", 0)->where("echeanciers.CapAmmorti", ">", 0)
                    ->join('portefeuilles', 'portefeuilles.NumDossier', '=', 'echeanciers.NumDossier')
                    ->join('comptes', 'comptes.NumCompte', '=', 'portefeuilles.NumCompteEpargne')
                    ->leftJoin('remboursementcredits', 'remboursementcredits.RefEcheance', '=', 'echeanciers.ReferenceEch')
                    ->limit(1)->first();
                $capitalEnRetard = $getRoumboursement->CapitalAmmortie - $getRoumboursement->CapitalPaye;
                $getPorteFeuilledata = Portefeuille::where("NumDossier", "=", $request->NumDossier)->first();

                //RECUPEPERE LA SOMME DU CAPITAL QU'IL DEVRAIT PAYE POUR CETTE TRANCHE
                $capAmmortie = $getRoumboursement->CapAmmorti;
                $capitalAvance = $request->RemboursCapital - $getRoumboursement->CapAmmorti;


                Remboursementcredit::create([
                    "RefEcheance" => $getRoumboursement->ReferenceEch,
                    "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                    "NumCompteCredit" => $getPorteFeuilledata->NumCompteCredit,
                    "NumDossie" => $getPorteFeuilledata->NumCompteCredit,
                    "RefTypCredit" => $getPorteFeuilledata->RefTypeCredit,
                    "NomCompte" => $getPorteFeuilledata->NomCompte,
                    "DateTranche" => $getRoumboursement->DateTranch,
                    // "DateRetard" =>$getRoumboursement->DateTranch,
                    // "JoursRetard",
                    // "InteretAmmorti",
                    // "InteretPaye",
                    // "InteretS",
                    "CapitalAmmortie" => $getRoumboursement->CapAmmorti,
                    "CapitalPaye"  => $request->RemboursCapital,
                    // "CapitalS",
                    // "EpargneAmmorti",
                    // "EpargnePaye",
                    // "EpargneS",
                    "CodeGuichet" => $getPorteFeuilledata->CodeGuichet,
                    "NumAdherent" => $getPorteFeuilledata->numAdherant,
                ]);
                //RENSEIGNE LE CAPITAL  REMBOURSE ET LE CAPITAL RESTANT
                //RECUPEPERE LA SOMME DU CAPITAL RESTANT
                $totCapPaye = Remboursementcredit::select(
                    DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                )->where("remboursementcredits.NumDossie", "=", $request->NumDossier)
                    ->groupBy("remboursementcredits.NumDossie")
                    ->first();

                $capRestant = $getPorteFeuilledata->MontantAccorde - $totCapPaye->totCapitalPaye;
                Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
                    "RemboursCapital" => $totCapPaye->totCapitalPaye,
                    "CapitalRestant" => $getPorteFeuilledata->CapitalRestant + $capRestant,
                ]);

                //RENSEIGNE LE PAYEMENT
                // Echeancier::where("ReferenceEch ", "=", $getRoumboursement->ReferenceEch)
                //     ->update([
                //         "statutPayement" => 1,
                //     ]);

                //PASSE LES ECRITURES DE DEBIT ET CREDIT SUR COMPTE



                if ($getPorteFeuilledata->CodeMonnaie == "USD") {
                    //CREDITE LE COMPTE EPARGNE DU MEMBRE
                    // $numCompteCreditCDF = 3270000000202;
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

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                        "NumComptecp" => $getPorteFeuilledata->NumCompteCredit,
                        "Debit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" =>  $request->RemboursCapital,
                        "Debitfc" =>  $request->RemboursCapital * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE SON COMPTE CREDIT
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteCredit,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $request->RemboursCapital,
                        "Creditfc" =>  $request->RemboursCapital * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE LE COMPTE CREDIT 

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteCreditAuxMembreUSD,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $request->RemboursCapital,
                        "Creditfc" =>  $request->RemboursCapital * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital du crédit octroyé à " . $getPorteFeuilledata->NomCompte . " en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $compteCreditAuxMembreUSD,
                    ]);

                    return response()->json(['success' => 1, 'msg' => 'Remboursement bien effectué.']);
                } else if ($getPorteFeuilledata->CodeMonnaie == "CDF") {
                    //DEBITE LE COMPTE EPARGNE DU MEMBRE
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

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                        "NumComptecp" => $getPorteFeuilledata->NumCompteCredit,
                        "Debit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" =>  $request->RemboursCapital * $tauxDuJour,
                        "Debitfc" =>  $request->RemboursCapital,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE SON COMPTE CREDIT
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteCredit,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $request->RemboursCapital * $tauxDuJour,
                        "Creditfc" =>  $request->RemboursCapital,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE LE COMPTE CREDIT AGR

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteCreditAuxMembreCDF,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $request->RemboursCapital,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $request->RemboursCapital * $tauxDuJour,
                        "Creditfc" =>  $request->RemboursCapital,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement capital du crédit octroyé à " . $getPorteFeuilledata->NomCompte . " en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $compteCreditAuxMembreCDF,
                    ]);




                    return response()->json(['success' => 1, 'msg' => 'Remboursement bien effectué.']);
                }

                //PUIS RENSEIGNE LE PAIEMENT SUR LA TRANCHE SUIVANTE



                //RECUPERE LE REMBOURSEMENT ATTENDU POUR CE MEMBRE

                $getRoumboursement = Echeancier::where("echeanciers.NumDossier", "=", $request->NumDossier)->where("echeanciers.statutPayement", "=", 0)->where("echeanciers.CapAmmorti", ">", 0)
                    ->join('portefeuilles', 'portefeuilles.NumDossier', '=', 'echeanciers.NumDossier')
                    ->join('comptes', 'comptes.NumCompte', '=', 'portefeuilles.NumCompteEpargne')
                    ->LeftJoin('remboursementcredits', 'remboursementcredits.RefEcheance', '=', 'echeanciers.ReferenceEch')
                    ->limit(1)->first();
                $capitalEnRetard = $getRoumboursement->CapitalAmmortie - $getRoumboursement->CapitalPaye;
                $getPorteFeuilledata = Portefeuille::where("NumDossier", "=", $request->NumDossier)->first();

                //RECUPEPERE LA SOMME DU CAPITAL QU'IL DEVRAIT PAYE POUR CETTE TRANCHE
                $capAmmortie = $getRoumboursement->CapAmmorti;
                $capitalAvance = $request->RemboursCapital - $getRoumboursement->CapAmmorti;


                Remboursementcredit::create([
                    "RefEcheance" => $getRoumboursement->ReferenceEch,
                    "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                    "NumCompteCredit" => $getPorteFeuilledata->NumCompteCredit,
                    "NumDossie" => $getPorteFeuilledata->NumCompteCredit,
                    "RefTypCredit" => $getPorteFeuilledata->RefTypeCredit,
                    "NomCompte" => $getPorteFeuilledata->NomCompte,
                    "DateTranche" => $getRoumboursement->DateTranch,
                    // "DateRetard" =>$getRoumboursement->DateTranch,
                    // "JoursRetard",
                    // "InteretAmmorti",
                    // "InteretPaye",
                    // "InteretS",
                    "CapitalAmmortie" => $capAmmortie,
                    "CapitalPaye"  => $capitalAvance,
                    // "CapitalS",
                    // "EpargneAmmorti",
                    // "EpargnePaye",
                    // "EpargneS",
                    "CodeGuichet" => $getPorteFeuilledata->CodeGuichet,
                    "NumAdherent" => $getPorteFeuilledata->numAdherant,
                ]);
                //RENSEIGNE LE CAPITAL  REMBOURSE ET LE CAPITAL RESTANT
                //RECUPEPERE LA SOMME DU CAPITAL RESTANT
                $totCapPaye = Remboursementcredit::select(
                    DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                )->where("remboursementcredits.NumDossie", "=", $request->NumDossier)
                    ->groupBy("remboursementcredits.NumDossie")
                    ->first();

                $capRestant = $getPorteFeuilledata->MontantAccorde - $totCapPaye->totCapitalPaye;
                Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
                    "RemboursCapital" => $totCapPaye->totCapitalPaye,
                    "CapitalRestant" => $getPorteFeuilledata->CapitalRestant + $capRestant,
                ]);

                //RENSEIGNE LE PAYEMENT
                // Echeancier::where("ReferenceEch ", "=", $getRoumboursement->ReferenceEch)
                //     ->update([
                //         "statutPayement" => 1,
                //     ]);

                //PASSE LES ECRITURES DE DEBIT ET CREDIT SUR COMPTE



                if ($getPorteFeuilledata->CodeMonnaie == "USD") {
                    //CREDITE LE COMPTE EPARGNE DU MEMBRE
                    // $numCompteCreditCDF = 3270000000202;
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

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                        "NumComptecp" => $getPorteFeuilledata->NumCompteCredit,
                        "Debit" =>  $capitalAvance,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" =>  $capitalAvance,
                        "Debitfc" =>  $capitalAvance * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement tranche du capital en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE SON COMPTE CREDIT
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteCredit,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $capitalAvance,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $capitalAvance,
                        "Creditfc" =>  $capitalAvance * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement tranche capital de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE LE COMPTE CREDIT 

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteCreditAuxMembreUSD,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" => $capitalAvance,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $capitalAvance,
                        "Creditfc" =>  $capitalAvance * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement tranche capital du crédit octroyé à " . $getPorteFeuilledata->NomCompte . " en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $compteCreditAuxMembreUSD,
                    ]);

                    return response()->json(['success' => 1, 'msg' => 'Remboursement bien effectué.']);
                } else if ($getPorteFeuilledata->CodeMonnaie == "CDF") {
                    //CREDITE LE COMPTE EPARGNE DU MEMBRE
                    $numCompteCreditCDF = 3270000000202;


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

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                        "NumComptecp" => $getPorteFeuilledata->NumCompteCredit,
                        "Debit" =>  $capitalAvance,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" =>  $capitalAvance * $tauxDuJour,
                        "Debitfc" =>  $capitalAvance,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement tranche capital de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE SON COMPTE CREDIT
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteCredit,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $capitalAvance,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" => $capitalAvance * $tauxDuJour,
                        "Creditfc" =>  $capitalAvance,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement tranche capital de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE LE COMPTE CREDIT 

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteCreditAuxMembreCDF,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $capitalAvance,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $capitalAvance * $tauxDuJour,
                        "Creditfc" => $capitalAvance,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement tranche capital du crédit octroyé à " . $getPorteFeuilledata->NomCompte . " en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $compteCreditAuxMembreCDF,
                    ]);

                    return response()->json(['success' => 1, 'msg' => 'Remboursement bien effectué.']);
                }
            }
        } else {
            return response()->json(['success' => 0, 'msg' => 'Veuillez renseigner le montant.']);
        }
    }










    //PERMET D'EFFECTUER UN REMBOURSEMENT MANUEL EN INTERET
    public function remboursementEnInteret(Request $request)
    {
        if (isset($request->NumDossier) and isset($request->RemboursInteret)) {
            $compteInteretCDF = "712000000202";
            $compteInteretUSD = "712000000202";
            //AVANT TOUTE CHOSE ON VERIFIE SI LE SOLDE DU MEMBRE EST SUFFISANT

            //RECUPERE LE SOLDE DU MEMBRE EN FC EN CDF
            $getPorteFeuilledata = Portefeuille::where("NumDossier", "=", $request->NumDossier)->first();
            if ($getPorteFeuilledata->CodeMonnaie == "CDF") {
                $soldeMembreCDF = Transactions::select(
                    DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeMembreCDF"),
                )->where("NumCompte", '=', $getPorteFeuilledata->NumCompteEpargne)
                    ->groupBy("NumCompte")
                    ->first();

                if ($soldeMembreCDF->soldeMembreCDF < $request->RemboursInteret) {
                    return response()->json(['success' => 0, 'msg' => "le solde de ce compte est insuffisant veuillez d'abord effectué un dépot à ce compte solde disponible CDF: " . $soldeMembreCDF->soldeMembreCDF . " .00" . ""]);
                }
            } else if ($getPorteFeuilledata->CodeMonnaie == "USD") {
                $soldeMembreUSD = Transactions::select(
                    DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
                )->where("NumCompte", '=', $getPorteFeuilledata->NumCompteEpargne)
                    ->groupBy("NumCompte")
                    ->first();

                if ($soldeMembreUSD->soldeMembreUSD < $request->RemboursInteret) {
                    return response()->json(['success' => 0, 'msg' => "le solde de ce compte est insuffisant veuillez d'abord effectué un dépot à ce compte solde disponible USD: " . $soldeMembreUSD->soldeMembreUSD . " .00" . ""]);
                }
            }


            // ON VERIFIE SI LA PERSONNE N'A  PAS A RETARD EN INTERET
            $getNbrJrRetard = Remboursementcredit::where("NumDossie", "=", $request->NumDossier)->first();
            if ($getNbrJrRetard->JoursRetard > 0) {
                if ($getNbrJrRetard->InteretPaye + $request->RemboursInteret >= $getNbrJrRetard->InteretAmmorti) {
                    Remboursementcredit::where("NumDossie", "=", $request->NumDossier)->where("JoursRetard", ">", 0)->update([
                        "InteretPaye" => $getNbrJrRetard->InteretPaye + $request->RemboursInteret,
                        "JoursRetard" => 0,
                    ]);

                    //RECUPEPERE LA SOMME DE L'INTERET DEJA REMBOURSE
                    $totInteretPaye = Remboursementcredit::select(
                        DB::raw("SUM(remboursementcredits.InteretPaye) as  totInteretPaye"),
                    )->where("remboursementcredits.NumDossie", "=", $request->NumDossier)
                        ->groupBy("remboursementcredits.NumDossie")
                        ->first();

                    //RECUPEPERE LA SOMME DE L'INTERET DU
                    $totInteretDu = Echeancier::select(
                        DB::raw("SUM(echeanciers.Interet) as  totInteret"),
                    )->where("echeanciers.NumDossier", "=", $request->NumDossier)
                        ->groupBy("echeanciers.NumDossier")
                        ->first();



                    $getPorteFeuilledata = Portefeuille::where("NumDossier", "=", $request->NumDossier)->first();
                    //RENSEIGNE L'INTERET  REMBOURSE ET RESTANT
                    $InteretRestant = $totInteretDu->totInteret -  $totInteretPaye->totInteretPaye;
                    Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
                        "RemboursInteret" => $totInteretPaye->totInteretPaye,
                        "InteretRestant" => $InteretRestant,
                        "JourRetard" => 0,
                    ]);
                    //RENSEIGNE LE PAYEMENT
                    Echeancier::where("ReferenceEch", "=", $getNbrJrRetard->RefEcheance)
                        ->update([
                            "statutPayement" => "1",
                        ]);
                    // ->limit(1);

                } else {
                    Remboursementcredit::where("NumDossie", "=", $request->NumDossier)->where("JoursRetard", ">", 0)->update([
                        "InteretPaye" => $getNbrJrRetard->InteretPaye + $request->RemboursInteret,
                    ]);
                    //RECUPERE LE REMBOURSEMENT ATTENDU POUR CE MEMBRE EN INTERET

                    $getRoumboursement = Echeancier::where("echeanciers.NumDossier", "=", $request->NumDossier)->where("echeanciers.statutPayement", "=", 0)->where("echeanciers.CapAmmorti", ">", 0)
                        ->join('portefeuilles', 'portefeuilles.NumDossier', '=', 'echeanciers.NumDossier')
                        ->join('comptes', 'comptes.NumCompte', '=', 'portefeuilles.NumCompteEpargne')
                        ->join('remboursementcredits', 'remboursementcredits.RefEcheance', '=', 'echeanciers.ReferenceEch')
                        ->limit(1)->first();
                    $InteretEnRetard = $getRoumboursement->Interet - $getRoumboursement->InteretPaye;
                    $getPorteFeuilledata = Portefeuille::where("NumDossier", "=", $request->NumDossier)->first();

                    //RECUPEPERE LA SOMME DU CAPITAL RESTANT
                    $totInteretPaye = Remboursementcredit::select(
                        DB::raw("SUM(remboursementcredits.InteretPaye) as  totInteretPaye"),
                    )->where("remboursementcredits.NumDossie", "=", $request->NumDossier)
                        ->groupBy("remboursementcredits.NumDossie")
                        ->first();
                    //RENSEIGNE L'INTERET REMBOURSE ET L'INTERET RESTANT

                    //RECUPEPERE LA SOMME DE L'INTERET DU
                    $totInteretDu = Echeancier::select(
                        DB::raw("SUM(echeanciers.Interet) as  totInteret"),
                    )->where("echeanciers.NumDossier", "=", $request->NumDossier)
                        ->groupBy("echeanciers.NumDossier")
                        ->first();
                    $InteretRestant = $totInteretDu->totInteret -  $totInteretPaye->totInteretPaye;
                    Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
                        "RemboursInteret" => $totInteretPaye->totInteretPaye,
                        "InteretRestant" => $InteretRestant,
                        "InteretRetardIn" => $InteretEnRetard,
                        "JourRetard" => $getPorteFeuilledata->JourRetard + 1,
                    ]);
                }

                if ($getPorteFeuilledata->CodeMonnaie == "USD") {
                    //DEBITE LE COMPTE EPARGNE DU MEMBRE
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

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                        "NumComptecp" => $getPorteFeuilledata->NumCompteCredit,
                        "Debit" =>  $request->RemboursInteret,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" =>  $request->RemboursInteret,
                        "Debitfc" =>  $request->RemboursInteret * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement Intérêt de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE LE COMPTE INTERET
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteInteretUSD,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $request->RemboursInteret,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $request->RemboursInteret,
                        "Creditfc" =>  $request->RemboursInteret * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement Intérêt de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);


                    return response()->json(['success' => 1, 'msg' => 'Remboursement bien effectué.']);
                }
                if ($getPorteFeuilledata->CodeMonnaie == "CDF") {
                    //DEBITE LE COMPTE EPARGNE DU MEMBRE
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

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                        "NumComptecp" => $getPorteFeuilledata->NumCompteCredit,
                        "Debit" =>  $request->RemboursInteret,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" =>  $request->RemboursInteret * $tauxDuJour,
                        "Debitfc" =>  $request->RemboursInteret,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement Intérêt de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE LE COMPTE INTERET
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteInteretCDF,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $request->RemboursInteret,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $request->RemboursInteret * $tauxDuJour,
                        "Creditfc" =>  $request->RemboursInteret,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement Intérêt de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    return response()->json(['success' => 1, 'msg' => 'Remboursement bien effectué.']);
                }
            }
            //RECUPERE LE CREDIT CORRESPONDANT A CE MEMBRE

            $getPorteFeuilledata = Portefeuille::where("NumDossier", "=", $request->NumDossier)->first();

            //RECUPERE LE REMBOURSEMENT ATTENDU POUR CE MEMBRE


            $getRoumboursement = Echeancier::where("echeanciers.NumDossier", "=", $request->NumDossier)
                ->where("echeanciers.CapAmmorti", ">", 0)
                ->where("echeanciers.statutPayement", "=", 0)
                ->join('portefeuilles', 'portefeuilles.NumDossier', '=', 'echeanciers.NumDossier')
                ->join('comptes', 'comptes.NumCompte', '=', 'portefeuilles.NumCompteEpargne')
                ->join('remboursementcredits', 'remboursementcredits.RefEcheance', '=', 'echeanciers.ReferenceEch')
                ->limit(1)->first();

            // return response()->json(["data" => $getRoumboursement]);

            //Si le montant à rembourser equivaut au montant que le membre doit payer pour cette tranche cad intéret ammorti
            if ($request->RemboursInteret == $getRoumboursement->InteretPaye) {
                Remboursementcredit::where("RefEcheance", "=", $getRoumboursement->RefEcheance)->update([
                    "InteretAmmorti" => $getRoumboursement->Interet,
                    "InteretPaye"  => $getRoumboursement->InteretPaye + $request->RemboursInteret,
                ]);
                //RENSEIGNE LE CAPITAL  REMBOURSE ET LE CAPITAL RESTANT
                //RECUPEPERE LA SOMME DU CAPITAL RESTANT
                $totInteretPaye = Remboursementcredit::select(
                    DB::raw("SUM(remboursementcredits.InteretPaye) as  totInteretPaye"),
                )->where("remboursementcredits.NumDossie", "=", $request->NumDossier)
                    ->groupBy("remboursementcredits.NumDossie")
                    ->first();

                //RECUPEPERE LA SOMME DE L'INTERET DU
                $totInteretDu = Echeancier::select(
                    DB::raw("SUM(echeanciers.Interet) as  totInteret"),
                )->where("echeanciers.NumDossier", "=", $request->NumDossier)
                    ->groupBy("echeanciers.NumDossier")
                    ->first();
                $InteretRestant = $totInteretDu->totInteret -  $totInteretPaye->totInteretPaye;

                Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
                    "RemboursInteret" => $totInteretPaye->totInteretPaye,
                    "InteretRestant" => $InteretRestant,
                ]);
                //CONSTATE LE REMBOURSEMENT
                Echeancier::where("ReferenceEch", "=", $getRoumboursement->RefEcheance)
                    ->update([
                        "statutPayement" => "1",
                    ]);

                // ->limit(1);

                if ($getPorteFeuilledata->CodeMonnaie == "USD") {
                    //CREDITE LE COMPTE EPARGNE DU MEMBRE
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

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                        "NumComptecp" => $getPorteFeuilledata->NumCompteCredit,
                        "Debit" =>  $request->RemboursInteret,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" =>  $request->RemboursInteret,
                        "Debitfc" =>  $request->RemboursInteret * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement Intérêt de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE LE COMPTE INTERET
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteInteretUSD,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $request->RemboursInteret,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $request->RemboursInteret,
                        "Creditfc" =>  $request->RemboursInteret * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement Intérêt de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);
                } else if ($getPorteFeuilledata->CodeMonnaie == "CDF") {
                    //DEBITE LE COMPTE EPARGNE DU MEMBRE
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

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                        "NumComptecp" => $getPorteFeuilledata->NumCompteCredit,
                        "Debit" =>  $request->RemboursInteret,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" =>  $request->RemboursInteret * $tauxDuJour,
                        "Debitfc" =>  $request->RemboursInteret,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement Intérêt de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE LE COMPTE INTERET
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteInteretCDF,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $request->RemboursInteret,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $request->RemboursInteret * $tauxDuJour,
                        "Creditfc" =>  $request->RemboursInteret,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement Intérêt de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);
                }
                //RENSEIGNE LE PAYEMENT
                Echeancier::where("ReferenceEch", "=", $getRoumboursement->ReferenceEch)
                    // ->where("echeanciers.statutPayement", "=", 0)
                    // ->where("echeanciers.CapAmmorti", ">", 0)
                    ->update([
                        "statutPayement" => "1",
                    ]);
                // ->limit(1);

                return response()->json(['success' => 1, 'msg' => 'Remboursement bien effectué.']);

                //SI MONTANT REMBOURSER EST INFERIEUR L'INTERET ATENDU
            } else if ($request->RemboursInteret < $getRoumboursement->Interet) {

                $InteretEnRetard = $getRoumboursement->Interet - $request->RemboursInteret;
                Remboursementcredit::where("RefEcheance", "=", $getRoumboursement->ReferenceEch)->update([
                    "JoursRetard" => $getRoumboursement->JoursRetard + 1,
                    "InteretAmmorti" => $getRoumboursement->Interet,
                    "InteretPaye" => $getRoumboursement->InteretPaye + $request->RemboursInteret,
                ]);

                // $NbrJrRetard  = Remboursementcredit::orderBy('id', 'desc')->first()->JoursRetard;
                // Remboursementcredit::where()

                //RECUPEPERE LA SOMME DE l'INTERET RESTANT
                $totInteretPaye = Remboursementcredit::select(
                    DB::raw("SUM(remboursementcredits.InteretPaye) as  totInteretPaye"),
                )->where("remboursementcredits.NumDossie", "=", $request->NumDossier)
                    ->groupBy("remboursementcredits.NumDossie")
                    ->first();

                //RECUPERE LE REMBOURSEMENT ATTENDU POUR CE MEMBRE EN INTERET

                $getRoumboursement = Echeancier::where("echeanciers.NumDossier", "=", $request->NumDossier)->where("echeanciers.statutPayement", "=", 0)->where("echeanciers.CapAmmorti", ">", 0)
                    ->join('portefeuilles', 'portefeuilles.NumDossier', '=', 'echeanciers.NumDossier')
                    ->join('comptes', 'comptes.NumCompte', '=', 'portefeuilles.NumCompteEpargne')
                    ->join('remboursementcredits', 'remboursementcredits.RefEcheance', '=', 'echeanciers.ReferenceEch')
                    ->limit(1)->first();
                $InteretEnRetard = $getRoumboursement->Interet - $getRoumboursement->InteretPaye;
                //RECUPEPERE LA SOMME DE L'INTERET DU
                $totInteretDu = Echeancier::select(
                    DB::raw("SUM(echeanciers.Interet) as  totInteret"),
                )->where("echeanciers.NumDossier", "=", $request->NumDossier)
                    ->groupBy("echeanciers.NumDossier")
                    ->first();
                $InteretRestant = $totInteretDu->totInteret -  $totInteretPaye->totInteretPaye;
                //RENSEIGNE LE CAPITAL EN RETARD ET LE CAP REMBOURSE ET LE CAPITAL RESTANT
                $InteretRestant = $getPorteFeuilledata->MontantAccorde - $totInteretPaye->totCapitalPaye;

                Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
                    "RemboursInteret" => $totInteretPaye->totInteretPaye,
                    "InteretRestant" => $InteretRestant,
                    "InteretRetardIn" => $InteretEnRetard,
                ]);




                if ($getPorteFeuilledata->CodeMonnaie == "USD") {
                    //DEBITE LE COMPTE EPARGNE DU MEMBRE

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

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                        "NumComptecp" => $getPorteFeuilledata->NumCompteCredit,
                        "Debit" =>  $request->RemboursInteret,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" =>  $request->RemboursInteret,
                        "Debitfc" =>  $request->RemboursInteret * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement Intérêt de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE LE COMPTE INTERET
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteInteretUSD,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $request->RemboursInteret,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $request->RemboursInteret,
                        "Creditfc" =>  $request->RemboursInteret * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement Intérêt de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);




                    return response()->json(['success' => 1, 'msg' => 'Remboursement bien effectué.']);
                } else if ($getPorteFeuilledata->CodeMonnaie == "CDF") {
                    //DEBITE LE COMPTE EPARGNE DU MEMBRE
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

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                        "NumComptecp" => $getPorteFeuilledata->NumCompteCredit,
                        "Debit" =>  $request->RemboursInteret,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" =>  $request->RemboursInteret * $tauxDuJour,
                        "Debitfc" =>  $request->RemboursInteret,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement Intérêt de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE LE COMPTE INTERET 
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteInteretCDF,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $request->RemboursInteret,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $request->RemboursInteret * $tauxDuJour,
                        "Creditfc" =>  $request->RemboursInteret,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement intérêt de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);




                    return response()->json(['success' => 1, 'msg' => 'Remboursement bien effectué.']);
                } else {
                    return response()->json(['success' => 0, 'msg' => 'Ooops un problème est servenue veuillez contacter votre administrateur système.']);
                }
                //SI LE MONTANT REMBOURSER EST SUPERIEUR EN INTERET PREVISIONNEL CELA SIGNIFIE QUE LE MEMBRE EST EN AVANCE EN INTERET


            } else if ($request->RemboursInteret > $getRoumboursement->Interet) {
                //RECUPERE LE REMBOURSEMENT ATTENDU POUR CE MEMBRE

                $getRoumboursement = Echeancier::where("echeanciers.NumDossier", "=", $request->NumDossier)->where("echeanciers.statutPayement", "=", 0)->where("echeanciers.CapAmmorti", ">", 0)
                    ->join('portefeuilles', 'portefeuilles.NumDossier', '=', 'echeanciers.NumDossier')
                    ->join('comptes', 'comptes.NumCompte', '=', 'portefeuilles.NumCompteEpargne')
                    ->join('remboursementcredits', 'remboursementcredits.RefEcheance', '=', 'echeanciers.ReferenceEch')
                    ->limit(1)->first();
                $getPorteFeuilledata = Portefeuille::where("NumDossier", "=", $request->NumDossier)->first();

                //RECUPEPERE LA SOMME DU CAPITAL QU'IL DEVRAIT PAYE POUR CETTE TRANCHE
                $InteretAmmortie = $getRoumboursement->Interet;
                $InteretAvance = $request->RemboursInteret - $InteretAmmortie;



                Remboursementcredit::whre("RefEcheance", "=", $getRoumboursement->ReferenceEch)->update([
                    "JoursRetard" => 0,
                    "InteretAmmorti" => $getRoumboursement->Interet,
                    "InteretPaye"  => $getRoumboursement->InteretPaye + $request->RemboursInteret,
                ]);

                //RENSEIGNE LE CAPITAL  REMBOURSE ET LE CAPITAL RESTANT
                //RECUPEPERE LA SOMME DU CAPITAL RESTANT
                $totInteretPaye = Remboursementcredit::select(
                    DB::raw("SUM(remboursementcredits.CapitalPaye) as  totInteretPaye"),
                )->where("remboursementcredits.NumDossie", "=", $request->NumDossier)
                    ->groupBy("remboursementcredits.NumDossie")
                    ->first();

                $InteretRestant = $totInteretDu->totInteret -  $totInteretPaye->totInteretPaye;
                Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
                    "RemboursInteret" => $totInteretPaye->totInteretPaye,
                    "InteretRestant" => $InteretRestant,
                ]);
                //RENSEIGNE LE PAYEMENT
                Echeancier::where("ReferenceEch ", "=", $getRoumboursement->ReferenceEch)
                    ->update([
                        "statutPayement" => "1",
                    ]);

                //PASSE LES ECRITURES DE DEBIT ET CREDIT SUR COMPTE
                if ($getPorteFeuilledata->CodeMonnaie == "USD") {
                    //DEBITE LE COMPTE EPARGNE DU MEMBRE

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

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                        "NumComptecp" => $getPorteFeuilledata->NumCompteCredit,
                        "Debit" =>   $request->RemboursInteret,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" =>   $request->RemboursInteret,
                        "Debitfc" =>   $request->RemboursInteret * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement intérêt de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE LE COMPTE INTERET
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteInteretUSD,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>   $request->RemboursInteret,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>   $request->RemboursInteret,
                        "Creditfc" =>   $request->RemboursInteret * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement intéret de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);


                    return response()->json(['success' => 1, 'msg' => 'Remboursement bien effectué.']);
                } else if ($getPorteFeuilledata->CodeMonnaie == "CDF") {
                    //DEBITE LE COMPTE EPARGNE DU MEMBRE
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

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                        "NumComptecp" => $getPorteFeuilledata->NumCompteCredit,
                        "Debit" =>   $request->RemboursInteret,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" =>   $request->RemboursInteret * $tauxDuJour,
                        "Debitfc" =>   $request->RemboursInteret,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement Intérêt de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE LE COMPTE INTERET
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteInteretCDF,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>   $request->RemboursInteret,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>   $request->RemboursInteret * $tauxDuJour,
                        "Creditfc" =>   $request->RemboursInteret,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement intérêt de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    return response()->json(['success' => 1, 'msg' => 'Remboursement bien effectué.']);
                }

                //PUIS RENSEIGNE LE PAIEMENT SUR LA TRANCHE SUIVANTE



                //RECUPERE LE REMBOURSEMENT ATTENDU POUR CE MEMBRE

                $getRoumboursement = Echeancier::where("echeanciers.NumDossier", "=", $request->NumDossier)->where("echeanciers.statutPayement", "=", 0)->where("echeanciers.CapAmmorti", ">", 0)
                    ->join('portefeuilles', 'portefeuilles.NumDossier', '=', 'echeanciers.NumDossier')
                    ->join('comptes', 'comptes.NumCompte', '=', 'portefeuilles.NumCompteEpargne')
                    ->join('remboursementcredits', 'remboursementcredits.RefEcheance', '=', 'echeanciers.ReferenceEch')
                    ->limit(1)->first();
                $getPorteFeuilledata = Portefeuille::where("NumDossier", "=", $request->NumDossier)->first();

                //RECUPEPERE LA SOMME DU CAPITAL QU'IL DEVRAIT PAYE POUR CETTE TRANCHE
                $InteretAmmortie = $getRoumboursement->Interet;
                $InteretAvance =  $request->RemboursInteret - $InteretAmmortie;


                Remboursementcredit::whre("RefEcheance", "=", $getRoumboursement->ReferenceEch)->update([
                    "InteretAmmorti" => $InteretAmmortie,
                    "InteretPaye" => $getRoumboursement->InteretPaye + $InteretAvance,
                ]);

                //RENSEIGNE LE CAPITAL  REMBOURSE ET LE CAPITAL RESTANT
                //RECUPEPERE LA SOMME DU CAPITAL RESTANT
                //RECUPEPERE LA SOMME DU CAPITAL RESTANT
                //RECUPEPERE LA SOMME DE L'INTERET DU
                $totInteretDu = Echeancier::select(
                    DB::raw("SUM(echeanciers.Interet) as  totInteret"),
                )->where("echeanciers.NumDossier", "=", $request->NumDossier)
                    ->groupBy("echeanciers.NumDossier")
                    ->first();
                $totInteretPaye = Remboursementcredit::select(
                    DB::raw("SUM(remboursementcredits.CapitalPaye) as  totInteretPaye"),
                )->where("remboursementcredits.NumDossie", "=", $request->NumDossier)
                    ->groupBy("remboursementcredits.NumDossie")
                    ->first();

                $InteretRestant = $totInteretDu->totInteret -  $totInteretPaye->totInteretPaye;

                Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
                    "RemboursInteret" => $totInteretPaye->totInteretPaye,
                    "InteretRestant" => $InteretRestant,
                ]);

                Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
                    "RemboursInteretIn" => $totInteretPaye->totInteretPaye,
                    "InteretRestant" => $InteretRestant,
                ]);

                //RENSEIGNE LE PAYEMENT
                Echeancier::where("ReferenceEch ", "=", $getRoumboursement->ReferenceEch)
                    ->update([
                        "statutPayement" => "1",
                    ]);

                //PASSE LES ECRITURES DE DEBIT ET CREDIT SUR COMPTE



                if ($getPorteFeuilledata->CodeMonnaie == "USD") {
                    //CREDITE LE COMPTE EPARGNE DU MEMBRE
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

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                        "NumComptecp" => $getPorteFeuilledata->NumCompteCredit,
                        "Debit" =>  $InteretAvance,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" =>  $InteretAvance,
                        "Debitfc" => $InteretAvance * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement intéret tranche du capital en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE SON COMPTE CREDIT
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $compteInteretUSD,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $InteretAvance,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" =>  $InteretAvance,
                        "Creditfc" =>  $InteretAvance * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement  tranche intéret de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    return response()->json(['success' => 1, 'msg' => 'Remboursement bien effectué.']);
                } else if ($getPorteFeuilledata->CodeMonnaie == "CDF") {
                    //CREDITE LE COMPTE EPARGNE DU MEMBR

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

                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteEpargne,
                        "NumComptecp" => $getPorteFeuilledata->NumCompteCredit,
                        "Debit" =>  $InteretAvance,
                        "Operant" =>  Auth::user()->name,
                        "Debit$" =>  $InteretAvance * $tauxDuJour,
                        "Debitfc" =>  $InteretAvance,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement tranche intéret de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    //CREDITE SON COMPTE CREDIT
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $getPorteFeuilledata->NumCompteCredit,
                        "NumComptecp" =>  $getPorteFeuilledata->NumCompteEpargne,
                        "Credit" =>  $InteretAvance,
                        "Operant" =>  Auth::user()->name,
                        "Credit$" => $InteretAvance * $tauxDuJour,
                        "Creditfc" =>  $InteretAvance,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => "Remboursement tranche intérêt de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                        "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                    ]);

                    return response()->json(['success' => 1, 'msg' => 'Remboursement bien effectué.']);
                }
            }
        } else {
            return response()->json(['success' => 0, 'msg' => 'Veuillez renseigner le montant.']);
        }
    }
}
