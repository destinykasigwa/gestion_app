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

        //RECUPERE TOUT LES MEMBRES QUI ONT UN CREDIT
        $dateDuJour = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
        $tauxDuJour =  TauxJournalier::orderBy('id', 'desc')->first()->TauxEnFc;
        $dataMembre = Portefeuille::where("portefeuilles.Cloture", "=", 0)
            ->where("portefeuilles.Octroye", "=", 1)
            ->join('echeanciers', 'echeanciers.NumDossier', '=', 'portefeuilles.NumDossier')
            ->where("echeanciers.DateTranch", "=", $dateDuJour)
            ->where("echeanciers.statutPayement", "=", 0)
            ->where("echeanciers.CapAmmorti", ">", 0)->get();
        // return response()->json([$dataMembre]);


        if (count($dataMembre) != 0) {

            // return response()->json([$dataMembre]);

            for ($i = 0; $i < sizeof($dataMembre); $i++) {


                $capitalAccorde = $dataMembre[$i]->MontantAccorde;
                // ON VERIFIE SI LA PERSONNE NE PAS A RETARD DE REMBOURSEMENT

                $getRetard =  Remboursementcredit::where("NumDossie", "=", $dataMembre[$i]->NumDossier)->get();
                if (count($getRetard) != 0) {
                    if ($getRetard[0]->JoursRetard > 0) {
                        $getPorteFeuilledata = Portefeuille::where("NumDossier", "=", $dataMembre[$i]->NumDossier)->first();
                        if ($getPorteFeuilledata->CodeMonnaie == "USD") {
                            $soldeMembreUSD = Transactions::select(
                                DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
                            )->where("NumCompte", '=', $dataMembre[$i]->NumCompteEpargne)
                                ->groupBy("NumCompte")
                                ->get();
                            if ($soldeMembreUSD[0]->soldeMembreUSD > 0) {

                                if ($getRetard[0]->CapitalPaye + $capitalAccorde >= $getRetard[0]->CapitalAmmortie) {
                                    Remboursementcredit::where("NumDossie", "=", $dataMembre[$i]->NumDossier)->where("JoursRetard", ">", 0)->update([
                                        "CapitalPaye" => $getRetard[0]->CapitalPaye + $capitalAccorde,
                                        "JoursRetard" => 0,
                                    ]);
                                    //RECUPERE LE CREDIT CORRESPONDANT A CE MEMBRE

                                    //RECUPEPERE LA SOMME DU CAPITAL RESTANT
                                    $totCapPaye = Remboursementcredit::select(
                                        DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                    )->where("remboursementcredits.NumDossie", "=", $dataMembre[$i]->NumDossier)
                                        ->groupBy("remboursementcredits.NumDossie")
                                        ->first();

                                    $getPorteFeuilledata = Portefeuille::where("NumDossier", "=", $dataMembre[$i]->NumDossier)->first();
                                    //RENSEIGNE LE CAPITAL  REMBOURSE ET LE CAPITAL RESTANT
                                    $capRestant = $getPorteFeuilledata->MontantAccorde - $totCapPaye->totCapitalPaye;
                                    Portefeuille::where("NumDossier", "=", $dataMembre[$i]->NumDossier)->update([
                                        "RemboursCapital" => $totCapPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "JourRetard" => 0,
                                    ]);
                                } else {
                                    Remboursementcredit::where("NumDossie", "=", $dataMembre[$i]->NumDossier)->where("JoursRetard", ">", 0)->update([
                                        "CapitalPaye" => $getRetard[0]->CapitalPaye +  $capitalAccorde,
                                    ]);
                                    //RECUPERE LE REMBOURSEMENT ATTENDU POUR CE MEMBRE

                                    $getRoumboursement = Echeancier::where("echeanciers.NumDossier", "=", $dataMembre[$i]->NumDossier)->where("echeanciers.statutPayement", "=", 0)->where("echeanciers.CapAmmorti", ">", 0)
                                        ->join('portefeuilles', 'portefeuilles.NumDossier', '=', 'echeanciers.NumDossier')
                                        ->join('comptes', 'comptes.NumCompte', '=', 'portefeuilles.NumCompteEpargne')
                                        // ->join('remboursementcredits', 'remboursementcredits.RefEcheance', '=', 'echeanciers.ReferenceEch')
                                        ->limit(1)->first();
                                    $capitalEnRetard = $getRoumboursement->CapitalAmmortie - $getRoumboursement->CapitalPaye;


                                    //RECUPEPERE LA SOMME DU CAPITAL RESTANT
                                    $totCapPaye = Remboursementcredit::select(
                                        DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                    )->where("remboursementcredits.NumDossie", "=", $dataMembre[$i]->NumDossier)
                                        ->groupBy("remboursementcredits.NumDossie")
                                        ->first();
                                    //RENSEIGNE LE CAPITAL  REMBOURSE ET LE CAPITAL RESTANT
                                    $capRestant = $getPorteFeuilledata->MontantAccorde - $totCapPaye->totCapitalPaye;
                                    Portefeuille::where("NumDossier", "=", $dataMembre[$i]->NumDossier)->update([
                                        "RemboursCapital" => $totCapPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "JourRetard" => $getPorteFeuilledata->JourRetard + 1,
                                        "CapitalRetard" => $capitalEnRetard,
                                    ]);
                                }
                                //PASSE LES ECRITURE DE DEBIT ET CREDIT SUR LE COMPTE

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
                                    "Debit" =>  $capitalAccorde,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $capitalAccorde,
                                    "Debitfc" =>  $capitalAccorde * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
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
                                    "Credit" =>  $capitalAccorde,
                                    // "Operant" =>  Auth::user()->name,
                                    "Credit$" =>  $capitalAccorde,
                                    "Creditfc" =>  $capitalAccorde * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                                    "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                                ]);

                                return response()->json(['success' => 1, 'msg' => 'Remboursement bien effectué.']);
                            }
                        } else if ($getPorteFeuilledata->CodeMonnaie == "CDF") {
                            $soldeMembreUSD = Transactions::select(
                                DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeMembreCDF"),
                            )->where("NumCompte", '=', $dataMembre[$i]->NumCompteEpargne)
                                ->groupBy("NumCompte")
                                ->get();

                            if ($soldeMembreUSD[0]->soldeMembreCDF > 0) {
                                if ($getRetard[0]->CapitalPaye + $capitalAccorde >= $getRetard[0]->CapitalAmmortie) {
                                    Remboursementcredit::where("NumDossie", "=", $dataMembre[$i]->NumDossier)->where("JoursRetard", ">", 0)->update([
                                        "CapitalPaye" => $getRetard[0]->CapitalPaye + $capitalAccorde,
                                        "JoursRetard" => 0,
                                    ]);
                                    //RECUPERE LE CREDIT CORRESPONDANT A CE MEMBRE

                                    //RECUPEPERE LA SOMME DU CAPITAL RESTANT
                                    $totCapPaye = Remboursementcredit::select(
                                        DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                    )->where("remboursementcredits.NumDossie", "=", $dataMembre[$i]->NumDossier)
                                        ->groupBy("remboursementcredits.NumDossie")
                                        ->first();

                                    $getPorteFeuilledata = Portefeuille::where("NumDossier", "=", $dataMembre[$i]->NumDossier)->first();
                                    //RENSEIGNE LE CAPITAL  REMBOURSE ET LE CAPITAL RESTANT
                                    $capRestant = $getPorteFeuilledata->MontantAccorde - $totCapPaye->totCapitalPaye;
                                    Portefeuille::where("NumDossier", "=", $dataMembre[$i]->NumDossier)->update([
                                        "RemboursCapital" => $totCapPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "JourRetard" => 0,
                                    ]);
                                } else {
                                    Remboursementcredit::where("NumDossie", "=", $dataMembre[$i]->NumDossier)->where("JoursRetard", ">", 0)->update([
                                        "CapitalPaye" => $getRetard[0]->CapitalPaye +  $capitalAccorde,
                                    ]);
                                    //RECUPERE LE REMBOURSEMENT ATTENDU POUR CE MEMBRE

                                    $getRoumboursement = Echeancier::where("echeanciers.NumDossier", "=", $dataMembre[$i]->NumDossier)->where("echeanciers.statutPayement", "=", 0)->where("echeanciers.CapAmmorti", ">", 0)
                                        ->join('portefeuilles', 'portefeuilles.NumDossier', '=', 'echeanciers.NumDossier')
                                        ->join('comptes', 'comptes.NumCompte', '=', 'portefeuilles.NumCompteEpargne')
                                        // ->join('remboursementcredits', 'remboursementcredits.RefEcheance', '=', 'echeanciers.ReferenceEch')
                                        ->limit(1)->first();
                                    $capitalEnRetard = $getRoumboursement->CapitalAmmortie - $getRoumboursement->CapitalPaye;


                                    //RECUPEPERE LA SOMME DU CAPITAL RESTANT
                                    $totCapPaye = Remboursementcredit::select(
                                        DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                    )->where("remboursementcredits.NumDossie", "=", $dataMembre[$i]->NumDossier)
                                        ->groupBy("remboursementcredits.NumDossie")
                                        ->first();
                                    //RENSEIGNE LE CAPITAL  REMBOURSE ET LE CAPITAL RESTANT
                                    $capRestant = $getPorteFeuilledata->MontantAccorde - $totCapPaye->totCapitalPaye;
                                    Portefeuille::where("NumDossier", "=", $dataMembre[$i]->NumDossier)->update([
                                        "RemboursCapital" => $totCapPaye->totCapitalPaye,
                                        "CapitalRestant" => $capRestant,
                                        "JourRetard" => $getPorteFeuilledata->JourRetard + 1,
                                        "CapitalRetard" => $capitalEnRetard,
                                    ]);
                                }




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
                                    "Debit" =>  $capitalAccorde,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" => $capitalAccorde * $tauxDuJour,
                                    "Debitfc" =>  $capitalAccorde,
                                    "NomUtilisateur" => "AUTO",
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
                                    "Credit" =>  $capitalAccorde,
                                    // "Operant" =>  Auth::user()->name,
                                    "Credit$" =>  $capitalAccorde * $tauxDuJour,
                                    "Creditfc" =>  $capitalAccorde,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital de votre crédit en date du " . $date . " Numéro dossier " . $getPorteFeuilledata->NumDossier,
                                    "refCompteMembre" => $getPorteFeuilledata->numAdherant,
                                ]);



                                return response()->json(['success' => 1, 'msg' => 'Remboursement bien effectué.']);
                            }
                        }
                    }
                }
                //FIN DU SCRIPT POUR LES MEMBRES QUI AVAIT UN REMBOURSEMENT EN RETARD



                //RECUPERE TOUS LES MEMBRES DONT LEURS ECHEANCES TOMBE A CE JOURS%
                // $getEcheanceMembre = Echeancier::where("echeanciers.NumDossier", "=", $dataMembre[$i]->NumDossier)
                //     ->where("echeanciers.DateTranch", "=", $dateDuJour)
                //     ->where("echeanciers.statutPayement", "=", 0)
                //     ->where("echeanciers.CapAmmorti", ">", 0)
                //     ->join('portefeuilles', 'portefeuilles.NumDossier', '=', 'echeanciers.NumDossier')
                //     ->join('comptes', 'comptes.NumCompte', '=', 'portefeuilles.NumCompteEpargne')
                //     ->leftJoin('remboursementcredits', 'remboursementcredits.RefEcheance', '=', 'echeanciers.ReferenceEch')
                //     ->where("echeanciers.CapAmmorti", ">", 0)->get();
                $soldeMembreCDF = Transactions::select(
                    DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeMembreCDF"),
                )->where("NumCompte", '=', $dataMembre[$i]->NumCompteEpargne)
                    ->groupBy("NumCompte")
                    ->get();

                //RECUPERE LE SOLDE DU MEMBRE CDF
                if ($dataMembre[$i]->CodeMonnaie == "CDF") {


                    $soldeMembreCDF = Transactions::select(
                        DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeMembreCDF"),
                    )->where("NumCompte", '=', $dataMembre[$i]->NumCompteEpargne)
                        ->groupBy("NumCompte")
                        ->get();

                    if ($soldeMembreCDF[0]->soldeMembreCDF > 0) {
                        if (count($dataMembre) != 0 and count($soldeMembreCDF)  != 0) {

                            $montantSoldeCDF = $soldeMembreCDF[0]->soldeMembreCDF;
                            $capitalAmmorti = $dataMembre[$i]->CapAmmorti;
                            $interetAmmorti = $dataMembre[$i]->Interet;
                            $capitalAccorde = $dataMembre[$i]->MontantAccorde;

                            //VERIFIE SI LE MONTANT SE TROUVANT SUR LE COMPTE DU MEMBRE EST EGAL A LA DETTE QU'IL DOIT PAYE
                            if ($montantSoldeCDF == $capitalAmmorti + $interetAmmorti) {
                                $interetPaye = $interetAmmorti;
                                $capitalApaye = $capitalAmmorti;
                                Remboursementcredit::create([
                                    "RefEcheance" => $dataMembre[$i]->ReferenceEch,
                                    "NumCompte" => $dataMembre[$i]->NumCompteEpargne,
                                    "NumCompteCredit" => $dataMembre[$i]->NumCompteCredit,
                                    "NumDossie" => $dataMembre[$i]->NumDossier,
                                    "RefTypCredit" => $dataMembre[$i]->RefTypeCredit,
                                    "NomCompte" => $dataMembre[$i]->NomCompte,
                                    "DateTranche" => $dataMembre[$i]->DateTranch,
                                    "CapitalAmmortie" => $capitalAmmorti,
                                    "CapitalPaye"  => $capitalApaye,
                                    "InteretAmmorti" => $interetPaye,
                                    "InteretPaye" => $interetPaye,
                                    "CodeGuichet" => $dataMembre[$i]->CodeGuichet,
                                    "NumAdherent" => $dataMembre[$i]->numAdherant,
                                ]);
                                // return response()->json(["success" => $dataMembre[$i]->CapAmmorti]);
                                //RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE
                                $totCapPaye = Remboursementcredit::select(
                                    DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                )->where("remboursementcredits.NumDossie", "=", $dataMembre[$i]->NumDossier)
                                    ->groupBy("remboursementcredits.NumDossie")
                                    ->get();
                                //RECUPEPERE LA SOMME DU CAPITAL RESTANT
                                $capRestant =  $capitalAccorde - $totCapPaye[0]->totCapitalPaye;
                                Portefeuille::where("NumDossier", "=", $dataMembre[$i]->NumDossier)->update([
                                    "RemboursCapital" => $totCapPaye[0]->totCapitalPaye,
                                    "CapitalRestant" => $dataMembre[$i]->CapitalRestant + $capRestant,
                                ]);



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
                                    "NumCompte" => $dataMembre[$i]->NumCompteEpargne,
                                    "NumComptecp" => $dataMembre[$i]->NumCompteCredit,
                                    "Debit" =>  $capitalApaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $capitalApaye / $tauxDuJour,
                                    "Debitfc" =>  $capitalApaye,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                    "refCompteMembre" => $dataMembre[$i]->numAdherant,
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
                                    "NumCompte" => $dataMembre[$i]->NumCompteCredit,
                                    "NumComptecp" =>  $dataMembre[$i]->NumCompteEpargne,
                                    "Credit" =>  $capitalApaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $capitalApaye / $tauxDuJour,
                                    "Creditfc" =>  $capitalApaye,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                    "refCompteMembre" => $dataMembre[$i]->numAdherant,
                                ]);

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
                                    "NumCompte" => $dataMembre[$i]->NumCompteEpargne,
                                    "NumComptecp" => $dataMembre[$i]->NumCompteCredit,
                                    "Debit" =>  $interetPaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $interetPaye / $tauxDuJour,
                                    "Debitfc" =>  $interetPaye,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                    "refCompteMembre" => $dataMembre[$i]->numAdherant,
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
                                    "NumCompte" => $dataMembre[$i]->NumCompteCredit,
                                    "NumComptecp" =>  $dataMembre[$i]->NumCompteEpargne,
                                    "Credit" =>  $interetPaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $interetPaye / $tauxDuJour,
                                    "Creditfc" =>  $interetPaye,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                    "refCompteMembre" => $dataMembre[$i]->numAdherant,
                                ]);


                                //CONFIRME LE REMBOURSEMENT
                                Echeancier::where("echeanciers.ReferenceEch", "=", $dataMembre[$i]->ReferenceEch)
                                    ->update([
                                        "statutPayement" => "1",
                                    ]);


                                return response()->json(["success" => 1, "msg" => "Clôture bien effectuée."]);
                                //SI LE SOLDE DU MEMBRE EST INFERIEUR AU CAPITAL AMORTI+INTERET AMORTI


                            } else if ($montantSoldeCDF < $capitalAmmorti + $interetAmmorti) {

                                //ON PREND B'ABORD LE CAPITAL
                                $solde = $soldeMembreCDF[0]->soldeMembreCDF;
                                if ($solde > $dataMembre[$i]->CapAmmorti) {
                                    $capitalApaye = $dataMembre[$i]->CapAmmorti;
                                } else if ($solde < $dataMembre[$i]->CapAmmorti) {
                                    $capitalApaye = $dataMembre[$i]->CapAmmorti - $solde;
                                } else if ($solde == $dataMembre[$i]->CapAmmorti) {
                                    $capitalApaye = $solde;
                                }


                                $interetAmmorti = $dataMembre[$i]->Interet;
                                Remboursementcredit::create([
                                    "RefEcheance" => $dataMembre[$i]->ReferenceEch,
                                    "NumCompte" => $dataMembre[$i]->NumCompteEpargne,
                                    "NumCompteCredit" => $dataMembre[$i]->NumCompteCredit,
                                    "NumDossie" => $dataMembre[$i]->NumDossier,
                                    "RefTypCredit" => $dataMembre[$i]->RefTypeCredit,
                                    "NomCompte" => $dataMembre[$i]->NomCompte,
                                    "DateTranche" => $dataMembre[$i]->DateTranch,
                                    "CapitalAmmortie" => $capitalAmmorti,
                                    "CapitalPaye"  => $capitalApaye,
                                    "InteretAmmorti" => $interetAmmorti,
                                    // "InteretPaye" => $interetPaye,
                                    "CodeGuichet" => $dataMembre[$i]->CodeGuichet,
                                    "NumAdherent" => $dataMembre[$i]->numAdherant,
                                ]);

                                //RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE
                                $totCapPaye = Remboursementcredit::select(
                                    DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                )->where("remboursementcredits.NumDossie", "=", $dataMembre[$i]->NumDossier)
                                    ->groupBy("remboursementcredits.NumDossie")
                                    ->get();
                                //RECUPEPERE LA SOMME DU CAPITAL RESTANT
                                $capRestant =  $capitalAccorde - $totCapPaye[0]->totCapitalPaye;
                                Portefeuille::where("NumDossier", "=", $dataMembre[$i]->NumDossier)->update([
                                    "RemboursCapital" => $totCapPaye[0]->totCapitalPaye,
                                    "CapitalRestant" => $dataMembre[$i]->CapitalRestant + $capRestant,
                                ]);

                                //DEBITE LE COMPTE EPARGNE DU MEMBRE (REMBOURSEMENT EN CAPITAL)

                                CompteurTransaction::create([
                                    'fakevalue' => "0000",
                                ]);
                                $numOperation = [];
                                $numOperation = CompteurTransaction::latest()->first();
                                $NumTransaction = "AT00" . $numOperation->id;
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "D",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembre[$i]->NumCompteEpargne,
                                    "NumComptecp" => $dataMembre[$i]->NumCompteCredit,
                                    "Debit" =>  $capitalApaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $capitalApaye / $tauxDuJour,
                                    "Debitfc" =>  $capitalApaye,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                    "refCompteMembre" => $dataMembre[$i]->numAdherant,
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
                                    "NumCompte" => $dataMembre[$i]->NumCompteCredit,
                                    "NumComptecp" =>  $dataMembre[$i]->NumCompteEpargne,
                                    "Credit" =>  $capitalApaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $capitalApaye / $tauxDuJour,
                                    "Creditfc" =>  $capitalApaye,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                    "refCompteMembre" => $dataMembre[$i]->numAdherant,
                                ]);
                                //RECUPERE LE NOUVEAU SOLDE

                                $soldeMembreCDF = Transactions::select(
                                    DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeMembreCDF"),
                                )->where("NumCompte", '=', $dataMembre[$i]->NumCompteEpargne)
                                    ->groupBy("NumCompte")
                                    ->get();
                                if ($soldeMembreCDF[0]->soldeMembreCDF > 0) {
                                    $interetPaye = $soldeMembreCDF[0]->soldeMembreCDF;
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
                                        "NumCompte" => $dataMembre[$i]->NumCompteEpargne,
                                        "NumComptecp" => $dataMembre[$i]->NumCompteCredit,
                                        "Debit" =>  $interetPaye,
                                        // "Operant" =>  Auth::user()->name,
                                        "Debit$" =>  $interetPaye / $tauxDuJour,
                                        "Debitfc" =>  $interetPaye,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement tranche intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                        "refCompteMembre" => $dataMembre[$i]->numAdherant,
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
                                        "NumCompte" => $dataMembre[$i]->NumCompteCredit,
                                        "NumComptecp" =>  $dataMembre[$i]->NumCompteEpargne,
                                        "Credit" =>  $interetPaye,
                                        // "Operant" =>  Auth::user()->name,
                                        "Debit$" =>  $interetPaye / $tauxDuJour,
                                        "Creditfc" =>  $interetPaye,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement tranche intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                        "refCompteMembre" => $dataMembre[$i]->numAdherant,
                                    ]);
                                    //RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE
                                    $totCapPaye = Remboursementcredit::select(
                                        DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                    )->where("remboursementcredits.NumDossie", "=", $dataMembre[$i]->NumDossier)
                                        ->groupBy("remboursementcredits.NumDossie")
                                        ->get();
                                    //RECUPEPERE LA SOMME DU CAPITAL RESTANT
                                    $capRestant =  $capitalAccorde - $totCapPaye[0]->totCapitalPaye;
                                    Portefeuille::where("NumDossier", "=", $dataMembre[$i]->NumDossier)->update([
                                        "RemboursCapital" => $totCapPaye[0]->totCapitalPaye,
                                        "CapitalRestant" => $dataMembre[$i]->CapitalRestant + $capRestant,
                                    ]);
                                }
                                return response()->json(["success" => 1, "msg" => "Clôture bien effectuée."]);
                            }

                            //SI LE SOLDE DU MEMBRE EST SUPERIEUR AU CAPITAL AMMORTI + INTERET AMMORTI
                            if ($montantSoldeCDF > $capitalAmmorti + $interetAmmorti) {
                                $interetAmmorti = $dataMembre[$i]->Interet;
                                $capitalAmmorti = $dataMembre[$i]->CapAmmorti;
                                $capitalApaye = $capitalAmmorti;
                                $interetPaye =  $interetAmmorti;
                                //DEBITE LE COMPTE EPARGNE DU MEMBRE (REMBOURSEMENT EN CAPITAL)

                                CompteurTransaction::create([
                                    'fakevalue' => "0000",
                                ]);
                                $numOperation = [];
                                $numOperation = CompteurTransaction::latest()->first();
                                $NumTransaction = "AT00" . $numOperation->id;
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "D",
                                    "CodeMonnaie" => 2,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembre[$i]->NumCompteEpargne,
                                    "NumComptecp" => $dataMembre[$i]->NumCompteCredit,
                                    "Debit" =>  $capitalApaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $capitalApaye / $tauxDuJour,
                                    "Debitfc" =>  $capitalApaye,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                    "refCompteMembre" => $dataMembre[$i]->numAdherant,
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
                                    "NumCompte" => $dataMembre[$i]->NumCompteCredit,
                                    "NumComptecp" =>  $dataMembre[$i]->NumCompteEpargne,
                                    "Credit" =>  $capitalApaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $capitalApaye / $tauxDuJour,
                                    "Creditfc" =>  $capitalApaye,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                    "refCompteMembre" => $dataMembre[$i]->numAdherant,
                                ]);


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
                                    "NumCompte" => $dataMembre[$i]->NumCompteEpargne,
                                    "NumComptecp" => $dataMembre[$i]->NumCompteCredit,
                                    "Debit" =>  $interetPaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $interetPaye / $tauxDuJour,
                                    "Debitfc" =>  $interetPaye,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement tranche intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                    "refCompteMembre" => $dataMembre[$i]->numAdherant,
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
                                    "NumCompte" => $dataMembre[$i]->NumCompteCredit,
                                    "NumComptecp" =>  $dataMembre[$i]->NumCompteEpargne,
                                    "Credit" =>  $interetPaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $interetPaye / $tauxDuJour,
                                    "Creditfc" =>  $interetPaye,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement tranche intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                    "refCompteMembre" => $dataMembre[$i]->numAdherant,
                                ]);
                                //RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE
                                $totCapPaye = Remboursementcredit::select(
                                    DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                )->where("remboursementcredits.NumDossie", "=", $dataMembre[$i]->NumDossier)
                                    ->groupBy("remboursementcredits.NumDossie")
                                    ->get();
                                //RECUPEPERE LA SOMME DU CAPITAL RESTANT
                                $capRestant =  $capitalAccorde - $totCapPaye[0]->totCapitalPaye;
                                Portefeuille::where("NumDossier", "=", $dataMembre[$i]->NumDossier)->update([
                                    "RemboursCapital" => $totCapPaye[0]->totCapitalPaye,
                                    "CapitalRestant" => $dataMembre[$i]->CapitalRestant + $capRestant,
                                ]);

                                //CONFIRME LE REMBOURSEMENT
                                Echeancier::where("echeanciers.ReferenceEch", "=", $dataMembre[$i]->ReferenceEch)
                                    ->update([
                                        "statutPayement" => "1",
                                    ]);

                                return response()->json(["success" => 1, "msg" => "Clôture bien effectuée."]);
                            }
                        }
                        // else{
                        //     return response()->json(["success" => 1, "msg" => "Clôture bien effectuée."]);  
                        // }
                    }
                } else if ($dataMembre[$i]->CodeMonnaie == "USD") {


                    //SOLDE EN USD
                    $soldeMembreUSD = Transactions::select(
                        DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
                    )->where("NumCompte", '=', $dataMembre[$i]->NumCompteEpargne)
                        ->groupBy("NumCompte")
                        ->get();
                    if (count($dataMembre) != 0 and count($soldeMembreUSD)  != 0) {
                        if ($soldeMembreUSD[0]->soldeMembreUSD > 0) {
                            $montantSoldeUSD = $soldeMembreUSD[0]->soldeMembreUSD;
                            $capitalAmmorti = $dataMembre[$i]->CapAmmorti;
                            $interetAmmorti = $dataMembre[$i]->Interet;
                            $capitalAccorde = $dataMembre[$i]->MontantAccorde;

                            //VERIFIE SI LE MONTANT SE TROUVANT SUR LE COMPTE DU MEMBRE EST EGAL A LA DETTE QU'IL DOIT PAYE
                            if ($montantSoldeUSD == $capitalAmmorti + $interetAmmorti) {
                                $interetPaye = $interetAmmorti;
                                $capitalApaye = $capitalAmmorti;
                                Remboursementcredit::create([
                                    "RefEcheance" => $dataMembre[$i]->ReferenceEch,
                                    "NumCompte" => $dataMembre[$i]->NumCompteEpargne,
                                    "NumCompteCredit" => $dataMembre[$i]->NumCompteCredit,
                                    "NumDossie" => $dataMembre[$i]->NumDossier,
                                    "RefTypCredit" => $dataMembre[$i]->RefTypeCredit,
                                    "NomCompte" => $dataMembre[$i]->NomCompte,
                                    "DateRetard"  => $dateDuJour,
                                    "JoursRetard" => 1,
                                    "DateTranche" => $dataMembre[$i]->DateTranch,
                                    "CapitalAmmortie" => $capitalAmmorti,
                                    "CapitalPaye"  => $capitalApaye,
                                    "InteretAmmorti" => $interetPaye,
                                    "InteretPaye" => $interetPaye,
                                    "CodeGuichet" => $dataMembre[$i]->CodeGuichet,
                                    "NumAdherent" => $dataMembre[$i]->numAdherant,
                                ]);
                                //RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE
                                $totCapPaye = Remboursementcredit::select(
                                    DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                )->where("remboursementcredits.NumDossie", "=", $dataMembre[$i]->NumDossier)
                                    ->groupBy("remboursementcredits.NumDossie")
                                    ->get();
                                //RECUPEPERE LA SOMME DU CAPITAL RESTANT
                                $capRestant =  $capitalAccorde - $totCapPaye[0]->totCapitalPaye;
                                Portefeuille::where("NumDossier", "=", $dataMembre[$i]->NumDossier)->update([
                                    "RemboursCapital" => $totCapPaye[0]->totCapitalPaye,
                                    "CapitalRestant" => $dataMembre[$i]->CapitalRestant + $capRestant,
                                ]);



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
                                    "NumCompte" => $dataMembre[$i]->NumCompteEpargne,
                                    "NumComptecp" => $dataMembre[$i]->NumCompteCredit,
                                    "Debit" =>  $capitalApaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $capitalApaye,
                                    "Debitfc" =>  $capitalApaye * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                    "refCompteMembre" => $dataMembre[$i]->numAdherant,
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
                                    "NumCompte" => $dataMembre[$i]->NumCompteCredit,
                                    "NumComptecp" =>  $dataMembre[$i]->NumCompteEpargne,
                                    "Credit" =>  $capitalApaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $capitalApaye,
                                    "Creditfc" =>  $capitalApaye * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                    "refCompteMembre" => $dataMembre[$i]->numAdherant,
                                ]);

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
                                    "NumCompte" => $dataMembre[$i]->NumCompteEpargne,
                                    "NumComptecp" => $dataMembre[$i]->NumCompteCredit,
                                    "Debit" =>  $interetPaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $interetPaye,
                                    "Debitfc" =>  $interetPaye * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                    "refCompteMembre" => $dataMembre[$i]->numAdherant,
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
                                    "NumCompte" => $dataMembre[$i]->NumCompteCredit,
                                    "NumComptecp" =>  $dataMembre[$i]->NumCompteEpargne,
                                    "Credit" =>  $interetPaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $interetPaye,
                                    "Creditfc" =>  $interetPaye * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                    "refCompteMembre" => $dataMembre[$i]->numAdherant,
                                ]);


                                //CONFIRME LE REMBOURSEMENT
                                Echeancier::where("echeanciers.ReferenceEch", "=", $dataMembre[$i]->ReferenceEch)
                                    ->update([
                                        "statutPayement" => "1",
                                    ]);


                                return response()->json(["success" => 1, "msg" => "Clôture bien effectuée."]);
                                //SI LE SOLDE DU MEMBRE EST INFERIEUR AU CAPITAL AMORTI+INTERET AMORTI


                            } else if ($montantSoldeUSD < $capitalAmmorti + $interetAmmorti) {
                                //ON PREND B'ABORD LE CAPITAL
                                $solde = $soldeMembreCDF[0]->soldeMembreUSD;
                                if ($solde > $dataMembre[$i]->CapAmmorti) {
                                    $capitalApaye = $dataMembre[$i]->CapAmmorti;
                                } else if ($solde < $dataMembre[$i]->CapAmmorti) {
                                    $capitalApaye = $dataMembre[$i]->CapAmmorti - $solde;
                                } else if ($solde == $dataMembre[$i]->CapAmmorti) {
                                    $capitalApaye = $solde;
                                }
                                //DEBITE LE COMPTE EPARGNE DU MEMBRE (REMBOURSEMENT EN CAPITAL)

                                CompteurTransaction::create([
                                    'fakevalue' => "0000",
                                ]);
                                $numOperation = [];
                                $numOperation = CompteurTransaction::latest()->first();
                                $NumTransaction = "AT00" . $numOperation->id;
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "D",
                                    "CodeMonnaie" => 1,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembre[$i]->NumCompteEpargne,
                                    "NumComptecp" => $dataMembre[$i]->NumCompteCredit,
                                    "Debit" =>  $capitalApaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $capitalApaye,
                                    "Debitfc" =>  $capitalApaye * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                    "refCompteMembre" => $dataMembre[$i]->numAdherant,
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
                                    "NumCompte" => $dataMembre[$i]->NumCompteCredit,
                                    "NumComptecp" =>  $dataMembre[$i]->NumCompteEpargne,
                                    "Credit" =>  $capitalApaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $capitalApaye,
                                    "Creditfc" =>  $capitalApaye * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                    "refCompteMembre" => $dataMembre[$i]->numAdherant,
                                ]);
                                //RECUPERE LE NOUVEAU SOLDE

                                $soldeMembreCDF = Transactions::select(
                                    DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeMembreCDF"),
                                )->where("NumCompte", '=', $dataMembre[$i]->NumCompteEpargne)
                                    ->groupBy("NumCompte")
                                    ->get();
                                if ($soldeMembreCDF[0]->soldeMembreCDF > 0) {
                                    $interetPaye = $soldeMembreCDF[0]->soldeMembreCDF;
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
                                        "NumCompte" => $dataMembre[$i]->NumCompteEpargne,
                                        "NumComptecp" => $dataMembre[$i]->NumCompteCredit,
                                        "Debit" =>  $interetPaye,
                                        // "Operant" =>  Auth::user()->name,
                                        "Debit$" =>  $interetPaye,
                                        "Debitfc" =>  $interetPaye * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement tranche intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                        "refCompteMembre" => $dataMembre[$i]->numAdherant,
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
                                        "NumCompte" => $dataMembre[$i]->NumCompteCredit,
                                        "NumComptecp" =>  $dataMembre[$i]->NumCompteEpargne,
                                        "Credit" =>  $interetPaye,
                                        // "Operant" =>  Auth::user()->name,
                                        "Debit$" =>  $interetPaye,
                                        "Creditfc" =>  $interetPaye * $tauxDuJour,
                                        "NomUtilisateur" => "AUTO",
                                        "Libelle" => "Remboursement tranche intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                        "refCompteMembre" => $dataMembre[$i]->numAdherant,
                                    ]);
                                    //RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE
                                    $totCapPaye = Remboursementcredit::select(
                                        DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                    )->where("remboursementcredits.NumDossie", "=", $dataMembre[$i]->NumDossier)
                                        ->groupBy("remboursementcredits.NumDossie")
                                        ->get();
                                    //RECUPEPERE LA SOMME DU CAPITAL RESTANT
                                    $capRestant =  $capitalAccorde - $totCapPaye[0]->totCapitalPaye;
                                    Portefeuille::where("NumDossier", "=", $dataMembre[$i]->NumDossier)->update([
                                        "RemboursCapital" => $totCapPaye[0]->totCapitalPaye,
                                        "CapitalRestant" => $dataMembre[$i]->CapitalRestant + $capRestant,
                                    ]);
                                }
                                return response()->json(["success" => 1, "msg" => "Clôture bien effectuée."]);
                            }

                            //SI LE SOLDE DU MEMBRE EST SUPERIEUR AU CAPITAL AMMORTI + INTERET AMMORTI
                            if ($montantSoldeUSD > $capitalAmmorti + $interetAmmorti) {
                                $interetAmmorti = $dataMembre[$i]->Interet;
                                $capitalAmmorti = $dataMembre[$i]->CapAmmorti;
                                $capitalApaye = $capitalAmmorti;
                                $interetPaye =  $interetAmmorti;
                                //DEBITE LE COMPTE EPARGNE DU MEMBRE (REMBOURSEMENT EN CAPITAL)

                                CompteurTransaction::create([
                                    'fakevalue' => "0000",
                                ]);
                                $numOperation = [];
                                $numOperation = CompteurTransaction::latest()->first();
                                $NumTransaction = "AT00" . $numOperation->id;
                                Transactions::create([
                                    "NumTransaction" => $NumTransaction,
                                    "DateTransaction" => $dateDuJour,
                                    "DateSaisie" => $dateDuJour,
                                    "TypeTransaction" => "D",
                                    "CodeMonnaie" => 1,
                                    "CodeAgence" => "20",
                                    "NumDossier" => "DOS00" . $numOperation->id,
                                    "NumDemande" => "V00" . $numOperation->id,
                                    "NumCompte" => $dataMembre[$i]->NumCompteEpargne,
                                    "NumComptecp" => $dataMembre[$i]->NumCompteCredit,
                                    "Debit" =>  $capitalApaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $capitalApaye,
                                    "Debitfc" =>  $capitalApaye * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                    "refCompteMembre" => $dataMembre[$i]->numAdherant,
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
                                    "NumCompte" => $dataMembre[$i]->NumCompteCredit,
                                    "NumComptecp" =>  $dataMembre[$i]->NumCompteEpargne,
                                    "Credit" =>  $capitalApaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $capitalApaye,
                                    "Creditfc" =>  $capitalApaye * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement capital de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                    "refCompteMembre" => $dataMembre[$i]->numAdherant,
                                ]);


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
                                    "NumCompte" => $dataMembre[$i]->NumCompteEpargne,
                                    "NumComptecp" => $dataMembre[$i]->NumCompteCredit,
                                    "Debit" =>  $interetPaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $interetPaye,
                                    "Debitfc" =>  $interetPaye * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement tranche intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                    "refCompteMembre" => $dataMembre[$i]->numAdherant,
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
                                    "NumCompte" => $dataMembre[$i]->NumCompteCredit,
                                    "NumComptecp" =>  $dataMembre[$i]->NumCompteEpargne,
                                    "Credit" =>  $interetPaye,
                                    // "Operant" =>  Auth::user()->name,
                                    "Debit$" =>  $interetPaye,
                                    "Creditfc" =>  $interetPaye * $tauxDuJour,
                                    "NomUtilisateur" => "AUTO",
                                    "Libelle" => "Remboursement tranche intérêt de votre crédit en date du " . $dateDuJour . " Numéro dossier " . $dataMembre[$i]->NumDossier,
                                    "refCompteMembre" => $dataMembre[$i]->numAdherant,
                                ]);
                                //RECUPERE LE TOTAL DU MONTANT DEJA REMBOURSE
                                $totCapPaye = Remboursementcredit::select(
                                    DB::raw("SUM(remboursementcredits.CapitalPaye) as  totCapitalPaye"),
                                )->where("remboursementcredits.NumDossie", "=", $dataMembre[$i]->NumDossier)
                                    ->groupBy("remboursementcredits.NumDossie")
                                    ->get();
                                //RECUPEPERE LA SOMME DU CAPITAL RESTANT
                                $capRestant =  $capitalAccorde - $totCapPaye[0]->totCapitalPaye;
                                Portefeuille::where("NumDossier", "=", $dataMembre[$i]->NumDossier)->update([
                                    "RemboursCapital" => $totCapPaye[0]->totCapitalPaye,
                                    "CapitalRestant" => $dataMembre[$i]->CapitalRestant + $capRestant,
                                ]);

                                //CONFIRME LE REMBOURSEMENT
                                Echeancier::where("echeanciers.ReferenceEch", "=", $dataMembre[$i]->ReferenceEch)
                                    ->update([
                                        "statutPayement" => "1",
                                    ]);

                                return response()->json(["success" => 1, "msg" => "Clôture bien effectuée."]);
                            }
                        }
                    }
                }
            }
        } else {
            return response()->json(["success" => 1, "msg" => "Clôture bien effectuée."]);
        }


        // return  response()->json(["data" => $dataMembre]);
    }

    //AFFICHE LA PAGE POUR POSTER
    public function getPostagePage()
    {
        return view('postage');
    }
}
