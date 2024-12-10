<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Delestage;
use App\Models\BilletageCdf;
use App\Models\BilletageUsd;
use App\Models\ChangeMonnaie;
use App\Models\Transactions;
use Illuminate\Http\Request;
use App\Models\TauxJournalier;
use App\Models\CompteurTransaction;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class EntreeTresorController extends Controller
{
    public function __construct()
    {
        $this->middleware("auth");
    }

    //RECUPERE TOUTES LES OPERATIONS DE DELESTAGE

    public function getDelestageRequest()
    {
        //RECUPERE LA DATE DU SYSTEME
        $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;

        //RECUPERE LE BILLETAGE EN CDF
        $dataCDF = Delestage::where("DateTransaction", "=", $date)->where("received", "=", 0)->where("CodeMonnaie", "=", 2)->first();

        //RECUPERE LE BILLETAGE EN USD
        $dataUSD = Delestage::where("DateTransaction", "=", $date)->where("received", "=", 0)->where("CodeMonnaie", "=", 1)->first();

        //RECUPERE TOUTES LES OPERATIONS DELESTAGE POUR CONFIRMATION CDF
        $getAllCDF = Delestage::where("DateTransaction", "=", $date)->where("received", "=", 0)->where("CodeMonnaie", "=", 2)->get();


        //RECUPERE TOUTES LES OPERATIONS DELESTAGE POUR CONFIRMATION USD
        $getAllUSD = Delestage::where("DateTransaction", "=", $date)->where("received", "=", 0)->where("CodeMonnaie", "=", 1)->get();


        return response()->json(["dataCDF" => $dataCDF, "dataUSD" => $dataUSD, "getAllCDF" => $getAllCDF, "getAllUSD" => $getAllUSD]);
    }


    //SUPPRIMER UN OPERATION DE DELESTAGE D'UN CAISSIER SPECIFIQUE CDF

    public function removeItemDeletstageCDF(Delestage $id)
    {
        try {
            return response()->json(["success" => 0, "msg" => "Seul l'Administrateur peux effacer un enregistrement"]);
            $id->delete();
            return response()->json(["success" => 1, "msg" => "La ligne a été supprimée aves succès"]);
        } catch (Exception $th) {
            Log::error($th);
        }
    }


    //SUPPRIMER UN OPERATION DE DELESTAGE D'UN CAISSIER SPECIFIQUE CDF

    public function removeItemDeletstageUSD(Delestage $id)
    {
        try {
            return response()->json(["success" => 0, "msg" => "Seul l'Administrateur peux effacer un enregistrement"]);
            $id->delete();
            return response()->json(["success" => 1, "msg" => "La ligne a été supprimée aves succès"]);
        } catch (Exception $th) {
            Log::error($th);
        }
    }


    //CONFIRME UNE OPERATION DE DELESTAGE
    public function confirmDeletstageRequestCDF($id)
    {
        CompteurTransaction::create([
            'fakevalue' => "0000",
        ]);
        $numOperation = [];
        $numOperation = CompteurTransaction::latest()->first();
        $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;


        //RECUPERE LE TAUX JOURNALIER
        $tauxDuJour = TauxJournalier::orderBy('id', 'desc')->first()->TauxEnFc;





        $numCompteCaissePrCDF = "5700000000202";
        $compteVirementInterGuichetCDF = "5900000000202";

        $data = Delestage::where("id", "=", $id)->first();

        //CREDITE LE COMPTE CAISSE TRANSFERT INTER GUICHET CDF
        Transactions::create([
            "NumTransaction" => $data->Reference,
            "DateTransaction" => $data->DateTransaction,
            "DateSaisie" => $data->DateTransaction,
            "Taux" => 1,
            "TypeTransaction" => "C",
            "CodeMonnaie" => 2,
            "CodeAgence" => "20",
            "NumDossier" => "DOS00" . $numOperation->id,
            "NumDemande" => "V00" . $numOperation->id,
            "NumCompte" => $compteVirementInterGuichetCDF,
            "NumComptecp" => $data->NumCompteCaissier,
            "Credit" =>  $data->montantCDF,
            "Operant" => $data->NomDemandeur,
            "Reduction" =>  $data->montantCDF,
            "Credit$" => $data->montantCDF / $tauxDuJour,
            "Creditfc" => $data->montantCDF,
            "NomUtilisateur" => Auth::user()->name,
            "Libelle" => "Retour au trésor de  " . $data->NomUtilisateur,
        ]);


        //DEBITE LE COMPTE CAISSE TRANSFERT INTER GUICHET
        Transactions::create([
            "NumTransaction" => $data->Reference,
            "DateTransaction" => $data->DateTransaction,
            "DateSaisie" => $data->DateTransaction,
            "Taux" => 1,
            "TypeTransaction" => "D",
            "CodeMonnaie" => 2,
            "CodeAgence" => "20",
            "NumDossier" => "DOS00" . $numOperation->id,
            "NumDemande" => "V00" . $numOperation->id,
            "NumCompte" => $compteVirementInterGuichetCDF,
            "NumComptecp" => $data->NumCompteCaissier,
            "Debit" =>  $data->montantCDF,
            "Operant" => $data->NomDemandeur,
            "Debit$" => $data->montantCDF / $tauxDuJour,
            "Debitfc" => $data->montantCDF,
            "NomUtilisateur" => Auth::user()->name,
            "Libelle" => "Retour au trésor de  " . $data->NomUtilisateur,
        ]);


        Transactions::create([
            "NumTransaction" => $data->Reference,
            "DateTransaction" => $data->DateTransaction,
            "DateSaisie" => $data->DateTransaction,
            "Taux" => 1,
            "TypeTransaction" => "C",
            "CodeMonnaie" => 2,
            "CodeAgence" => "20",
            "NumDossier" => "DOS00" . $numOperation->id,
            "NumDemande" => "V00" . $numOperation->id,
            "NumCompte" => $data->NumCompteCaissier,
            "NumComptecp" => $compteVirementInterGuichetCDF,
            "Credit" =>  $data->montantCDF,
            "Operant" => $data->NomDemandeur,
            "Reduction" =>  $data->montantCDF,
            "Credit$" => $data->montantCDF / $tauxDuJour,
            "Creditfc" => $data->montantCDF,
            "NomUtilisateur" => $data->NomUtilisateur,
            "Libelle" => "Délestage caisse " . $data->NomUtilisateur,
        ]);


        //DEBITE LE COMPTE PRINCIPALE CAISSE

        Transactions::create([
            "NumTransaction" => $data->Reference,
            "DateTransaction" => $data->DateTransaction,
            "DateSaisie" => $data->DateTransaction,
            "Taux" => 1,
            "TypeTransaction" => "D",
            "CodeMonnaie" => 2,
            "CodeAgence" => "20",
            "NumDossier" => "DOS00" . $numOperation->id,
            "NumDemande" => "V00" . $numOperation->id,
            "NumCompte" => $numCompteCaissePrCDF,
            "NumComptecp" => $data->NumCompteCaissier,
            "Debit" =>  $data->montantCDF,
            "Operant" => $data->NomDemandeur,
            "Reduction" =>  $data->montantCDF,
            "Debit$" => $data->montantCDF / $tauxDuJour,
            "Debitfc" => $data->montantCDF,
            "NomUtilisateur" => $data->NomUtilisateur,
            "Libelle" => "Entrée tresor",
        ]);



        //APRES ON RETRACHE CE MONTANT DE CES BILLETAGE

        BilletageCdf::create([
            "refOperation" => $data->Reference,
            "vightMilleFrancSortie" => $data->vightMilleFranc,
            "dixMilleFrancSortie" => $data->dixMilleFranc,
            "cinqMilleFrancSortie" => $data->cinqMilleFranc,
            "milleFrancSortie" => $data->milleFranc,
            "cinqCentFrancSortie" => $data->cinqCentFranc,
            "deuxCentFrancSortie" => $data->deuxCentFranc,
            "centFrancSortie" => $data->centFranc,
            "cinquanteFancSortie" => $data->cinquanteFanc,
            "NomUtilisateur" => $data->NomUtilisateur,
            "DateTransaction" => $data->DateTransaction,
            "delested" => 1
        ]);


        //PUIS MET A JOUR LA TABLE DE  DELESTAGE
        Delestage::where("id", "=", $id)->update([
            "received" => 1
        ]);

        //ACCEPTE LA COMMISSION 
        BilletageCdf::where("NomUtilisateur", "=", $data->NomUtilisateur)
            ->where("is_commision", "=", 1)
            ->update([
                "is_commision" => 0,
            ]);

        BilletageUsd::where("NomUtilisateur", "=", $data->NomUtilisateur)
            ->update([
                "delested" => 1
            ]);
        //MET A JOUR LA TABLE CHANGE MONAIE
        ChangeMonnaie::where("NomUtilisateur", "=", $data->NomUtilisateur)->update([
            "received" => 1
        ]);

        return response()->json(["success" => 1, "msg" => "Délestage bien effectué.", "data" => $data]);
    }

    public function confirmDeletstageRequestUSD($id)
    {
        CompteurTransaction::create([
            'fakevalue' => "0000",
        ]);
        $numOperation = [];
        $numOperation = CompteurTransaction::latest()->first();
        //   $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;


        //RECUPERE LE TAUX JOURNALIER
        $tauxDuJour = TauxJournalier::orderBy('id', 'desc')->first()->TauxEnFc;



        $compteVirementInterGuichet = "5900000000201";
        $numCompteCaissePr = "5700000000201";
        $data = Delestage::where("id", "=", $id)->first();

        //CREDITE LE COMPTE CAISSE TRANSFERT INTER GUICHET


        Transactions::create([
            "NumTransaction" => $data->Reference,
            "DateTransaction" => $data->DateTransaction,
            "DateSaisie" => $data->DateTransaction,
            "Taux" => 1,
            "TypeTransaction" => "C",
            "CodeMonnaie" => 1,
            "CodeAgence" => "20",
            "NumDossier" => "DOS00" . $numOperation->id,
            "NumDemande" => "V00" . $numOperation->id,
            "NumCompte" => $compteVirementInterGuichet,
            "NumComptecp" => $data->NumCompteCaissier,
            "Credit" =>  $data->montantUSD,
            "Operant" => $data->NomDemandeur,
            "Reduction" =>  $data->montantUSD,
            "Creditfc" => $data->montantUSD * $tauxDuJour,
            "Credit$" => $data->montantUSD,
            "NomUtilisateur" => Auth::user()->name,
            "Libelle" => "Retour au trésor de  " . $data->NomUtilisateur,
        ]);


        //DEBITE LE COMPTE CAISSE TRANSFERT INTER GUICHET


        Transactions::create([
            "NumTransaction" => $data->Reference,
            "DateTransaction" => $data->DateTransaction,
            "DateSaisie" => $data->DateTransaction,
            "Taux" => 1,
            "TypeTransaction" => "D",
            "CodeMonnaie" => 1,
            "CodeAgence" => "20",
            "NumDossier" => "DOS00" . $numOperation->id,
            "NumDemande" => "V00" . $numOperation->id,
            "NumCompte" => $compteVirementInterGuichet,
            "NumComptecp" => $data->NumCompteCaissier,
            "Debit" =>  $data->montantUSD,
            "Operant" => $data->NomDemandeur,
            "Debitfc" => $data->montantUSD * $tauxDuJour,
            "Debit$" => $data->montantUSD,
            "NomUtilisateur" => Auth::user()->name,
            "Libelle" => "Retour au trésor de  " . $data->NomUtilisateur,
        ]);


        Transactions::create([
            "NumTransaction" => $data->Reference,
            "DateTransaction" => $data->DateTransaction,
            "DateSaisie" => $data->DateTransaction,
            "Taux" => 1,
            "TypeTransaction" => "C",
            "CodeMonnaie" => 1,
            "CodeAgence" => "20",
            "NumDossier" => "DOS00" . $numOperation->id,
            "NumDemande" => "V00" . $numOperation->id,
            "NumCompte" => $data->NumCompteCaissier,
            "NumComptecp" => $compteVirementInterGuichet,
            "Credit" =>  $data->montantUSD,
            "Operant" => $data->NomDemandeur,
            "Reduction" =>  $data->montantUSD,
            "Creditfc" => $data->montantUSD * $tauxDuJour,
            "Credit$" => $data->montantUSD,
            "NomUtilisateur" => Auth::user()->name,
            "Libelle" => "Délestage caisse " . $data->NomUtilisateur,
        ]);


        //DEBITE LE COMPTE PRINCIPALE CAISSE

        Transactions::create([
            "NumTransaction" => $data->Reference,
            "DateTransaction" => $data->DateTransaction,
            "DateSaisie" => $data->DateTransaction,
            "Taux" => 1,
            "TypeTransaction" => "D",
            "CodeMonnaie" => 1,
            "CodeAgence" => "20",
            "NumDossier" => "DOS00" . $numOperation->id,
            "NumDemande" => "V00" . $numOperation->id,
            "NumCompte" => $numCompteCaissePr,
            "NumComptecp" => $data->NumCompteCaissier,
            "Debit" =>  $data->montantUSD,
            "Operant" => $data->NomDemandeur,
            "Reduction" =>  $data->montantUSD,
            "Debitfc" => $data->montantUSD * $tauxDuJour,
            "Debit$" => $data->montantUSD,
            "NomUtilisateur" => Auth::user()->name,
            "Libelle" => "Entrée tresor",
        ]);



        //APRES ON RETRACHE CE MONTANT DE CES BILLETAGE
        BilletageUsd::create([
            "refOperation" => $data->Reference,
            "centDollarsSortie" => $data->centDollars,
            "cinquanteDollarsSortie" => $data->cinquanteDollars,
            "vightDollarsSortie" => $data->vightDollars,
            "dixDollarsSortie" => $data->dixDollars,
            "cinqDollarsSortie" => $data->cinqDollars,
            "unDollarsSortie" => $data->unDollars,
            "NomUtilisateur" => $data->NomUtilisateur,
            "DateTransaction" => $data->DateTransaction,
            "delested" => 1
        ]);


        //PUIS MET A JOUR LA TABLE DE  DELESTAGE
        Delestage::where("id", "=", $id)->update([
            "received" => 1
        ]);

        //ACCEPTE LA COMMISSION 
        BilletageUsd::where("NomUtilisateur", "=", $data->NomUtilisateur)
            ->where("is_commision", "=", 1)
            ->update([
                "is_commision" => 0,
                "delested" => 1
            ]);

        BilletageUsd::where("NomUtilisateur", "=", $data->NomUtilisateur)
            ->update([
                "delested" => 1
            ]);
        //MET A JOUR LA TABLE CHANGE MONAIE
        ChangeMonnaie::where("NomUtilisateur", "=", $data->NomUtilisateur)->update([
            "received" => 1
        ]);

        return response()->json(["success" => 1, "msg" => "Délestage bien effectué.", "data" => $data]);
    }

    //RECUPERE LA PAGE PRINCIPALE 
    public function getEntreeTresorPage()
    {
        return view('entre-tresor');
    }
}
