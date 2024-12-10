<?php

namespace App\Http\Controllers;

use App\Models\Dummy;
use App\Mail\TestMail;
use App\Models\Comptes;
use Twilio\Rest\Client;
use App\Models\BilletageCdf;
use App\Models\BilletageUsd;
use App\Models\Portefeuille;
use App\Models\Transactions;
use Illuminate\Http\Request;
use App\Models\AdhesionMembre;
use App\Models\Positionnement;
use App\Models\TauxJournalier;
use App\Models\RemboursEttendu;
use App\Models\CompteurDocument;
use Illuminate\Support\Facades\DB;
use App\Models\CompteurTransaction;
use App\Models\SMSBanking;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;


class DepotEspeceController extends Controller
{
  public function __construct()
  {
    $this->middleware('auth');
  }

  // fuction to get searched accout

  public function getAccount($id)
  {

    //RECUPERE LES INFO DU MEMBRE RECHERCHE
    $data = AdhesionMembre::where('compteAbrege', '=', $id)->get();
    if (count($data) != 0) {
      //RECUPERE LE COMPTE EN CDF 

      //RECUPERE LE SOLDE DU MEMBRE EN FC EN CDF
      $compteMembreCDF = Comptes::where("NumAdherant", "=", $id)->where('CodeMonnaie', '=', 2)->first()->NumCompte;
      $soldeMembreCDF = Transactions::select(
        // DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
        DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeMembreCDF"),
      )->where("NumCompte", '=', $compteMembreCDF)
        ->groupBy("NumCompte")
        ->get();

      //RECUPERE LE SOLDE DU MEMBRE EN FC EN USD

      $compteDuMembreUSD = Comptes::where("NumAdherant", "=", $id)->where('CodeMonnaie', '=', 1)->first();
      if ($compteDuMembreUSD) {
        $compteMembreUSD = $compteDuMembreUSD->NumCompte;
        $soldeMembreUSD = Transactions::select(
          // DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
          DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
        )->where("NumCompte", '=', $compteMembreUSD)
          ->groupBy("NumCompte")
          ->get();
        if (count($soldeMembreUSD) != 0) {
          $soldeUSD = $soldeMembreUSD;
        } else {
          $soldeUSD = $compteMembreCDF;
        }
      } else {
        $soldeUSD = $compteMembreCDF;
      }

      //RECUPERE LE DERNIER ID POUR LA TABLE COMPTEUR DOCUMENT
      $lastId = [];
      $lastId = CompteurDocument::orderBy('id', 'desc')->first();
      $numDoc = $lastId->id;

      //RECUPERE LE MONTANT DE CREDIT EN RETARD SI LE MEMBRE EST EN RETARD DE PAYEMENT
      $checkRetardMembreData = Portefeuille::where("numAdherant", "=", $id)
        ->where("Cloture", "=", 0)
        ->first();
      if ($checkRetardMembreData) {
        $dataRetardRemboursementMembre = $checkRetardMembreData;
      } else {
        $dataRetardRemboursementMembre = null;
      }
      return response()->json([
        "success" => 1,
        'data' =>  $data,
        "soldeMembreCDF" => $soldeMembreCDF,
        "soldeMembreUSD" => $soldeUSD,
        "numdoc" => $numDoc,
        "dataRetardRemboursementMembre" => $dataRetardRemboursementMembre
      ]);
    } else {

      return response()->json([
        "success" => 0,
        'msg' =>  "Ce compte ne semble pas existé"
      ]);
    }
  }

  //FUNCTION QUI RECUPERE UNE SPECIFIQUE OPERATION QUI A ETE POSTIONNEE

  public function getNumDocument($numDocument)
  {

    $dataRowExist = Positionnement::where("NumDocument", "=", $numDocument)->first();
    if ($dataRowExist) {
      $dataPostione = Positionnement::where("NumDocument", "=", $numDocument)->first();
      $numCompteMembre = $dataPostione->RefCompte;
      //RECUPERE LES INFO DU MEMBRE RECHERCHE POUR LE CDF
      $dataCDF = Comptes::where('comptes.NumAdherant', '=', $numCompteMembre)
        ->where("CodeMonnaie", "=", "2")
        ->first();
      //RECUPERE LES INFO DU MEMBRE RECHERCHE POUR LE USD
      $dataUSD = Comptes::where('comptes.NumAdherant', '=', $numCompteMembre)
        ->where("CodeMonnaie", "=", "1")
        ->first();

      $dataCDF ? $NumeroCompteCDF = $dataCDF->NumCompte : null;
      if ($dataUSD) {
        $dataUSD ? $NumeroCompteUSD = $dataUSD->NumCompte : null;
      } else {
        $NumeroCompteUSD = null;
      }
      //RECUPERE LE SOLDE DU MEMBRE EN FC 
      $soldeMembreCDF = Transactions::select(
        DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeMembreCDF"),
      )->where("NumCompte", '=', $NumeroCompteCDF)
        ->groupBy("NumCompte")
        ->first();

      //RECUPERE LE SOLDE DU MEMBRE EN USD
      $soldeMembreUSD = Transactions::select(
        DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
      )->where("NumCompte", '=', $NumeroCompteUSD)
        ->groupBy("NumCompte")
        ->first();



      return response()->json([
        "success" => 1,
        'data' => $dataUSD,
        "soldeMembreCDF" => $soldeMembreCDF,
        "soldeMembreUSD" => $soldeMembreUSD,
        "datapositionnement" => $dataPostione
      ]);
    } else {
      return response()->json([
        "success" => 0,
        'msg' =>  "Numéro de dossier invalide"
      ]);
    }
  }



  //function to store data in to data base when makeking deposit

  public function depotEspece(Request $request)
  {

    $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;

    //RECUPERE LE TAUX JOURNALIER
    $tauxDuJour = TauxJournalier::orderBy('id', 'desc')->first()->TauxEnFc;


    $validator = validator::make($request->all(), [
      'devise' => 'required',
      'libelle' => 'required|max:50',
      'montantDepot' => 'required',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'validate_error' => $validator->errors()
      ]);
    } else {


      CompteurTransaction::create([
        'fakevalue' => "0000",
      ]);
      $numOperation = [];
      $numOperation = CompteurTransaction::latest()->first();
      $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;

      //RECUPERE LE COMPTE DU CAISSIER CONCERNE USD 
      $numCompteCaissierUSD = Comptes::where("caissierId", "=", Auth::user()->id)->where("CodeMonnaie", "=", "1")->first();
      $CompteCaissierUSD = $numCompteCaissierUSD->NumCompte;
      $intituleCompteCaissierUSD = $numCompteCaissierUSD->NomCompte;
      //RECUPERE LE COMPTE DU CAISSIER CONCERNE CDF
      $numCompteCaissierCDF = Comptes::where("caissierId", "=", Auth::user()->id)->where("CodeMonnaie", "=", "2")->first();
      $CompteCaissierCDF = $numCompteCaissierCDF->NumCompte;
      $intituleCompteCaissierCDF = $numCompteCaissierCDF->NomCompte;
      //  $numCompteContrePartie="5700003032202";
      //  $numCompteContrePartieUSD="5700003032201";
      if ($request->devise == "CDF") {
        //RECUPERE LE NUMERO DE COMPTE CDF DU MEMBRE CONCERNE
        $getCompteMembreCDF = Comptes::where("NumAdherant", "=", $request->refCompte)->Where("CodeMonnaie", "=", "2")->first();
        $compteCDF = $getCompteMembreCDF->NumCompte;

        if (isset($request->commission) and $request->commission > 0) {
          //CREDITE LE COMPTE COMMISION CDF
          $compteCommissionCDF = "7270000000202";
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
            "NumCompte" => $compteCommissionCDF,
            "NumComptecp" => $compteCDF,
            "Operant" => "COMPTE COMMISSION CDF",
            "Credit"  => $request->commission,
            "Credit$"  => $request->commission / $tauxDuJour,
            "Creditfc" => $request->commission,
            "NomUtilisateur" => Auth::user()->name,
            "Libelle" => "PRISE COMMISSION",
          ]);

          //DEBITE LE COMPTE DU MEMBRE CDF

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
            "NumCompte" => $compteCDF,
            "NumComptecp" =>  $compteCommissionCDF,
            "Operant" => "COMPTE COMMISSION CDF",
            "Debit"  => $request->commission,
            "Debit$"  => $request->commission / $tauxDuJour,
            "Debitfc" => $request->commission,
            "NomUtilisateur" => Auth::user()->name,
            "Libelle" => "PRELEVEMENT DE COMMISSION SUR LE COMPTE " . $compteCDF . " par le caissier " . Auth::user()->name,
          ]);

          // BilletageCdf::create([
          //   "refOperation" => $NumTransaction,
          //   "montantEntre" => $request->commission,
          //   "NomUtilisateur" => Auth::user()->name,
          //   "DateTransaction" => $date,
          //   "is_commision" => 1
          // ]);



          // $numCompteCaissePrCDF = "5700000000202";
          // $compteVirementInterGuichetCDF = "5900000000202";

          // Transactions::create([
          //   "NumTransaction" => $NumTransaction,
          //   "DateTransaction" => $date,
          //   "DateSaisie" => $date,
          //   "Taux" => 1,
          //   "TypeTransaction" => "C",
          //   "CodeMonnaie" => 2,
          //   "CodeAgence" => "20",
          //   "NumDossier" => "DOS00" . $numOperation->id,
          //   "NumDemande" => "V00" . $numOperation->id,
          //   "NumCompte" => $compteVirementInterGuichetCDF,
          //   "NumComptecp" =>  $numCompteCaissePrCDF,
          //   "Credit"  => $request->commission,
          //   "Credit$"  => $request->commission / $tauxDuJour,
          //   "Creditfc" => $request->commission,
          //   "NomUtilisateur" => Auth::user()->name,
          //   "Libelle" => "PRELEVEMENT DE COMMISSION SUR LE COMPTE " . $compteCDF,
          // ]);

          //DEBITE LE COMPTE DE LA CAISSE PRINCIPALE
          // Transactions::create([
          //   "NumTransaction" => $NumTransaction,
          //   "DateTransaction" => $date,
          //   "DateSaisie" => $date,
          //   "Taux" => 1,
          //   "TypeTransaction" => "D",
          //   "CodeMonnaie" => 2,
          //   "CodeAgence" => "20",
          //   "NumDossier" => "DOS00" . $numOperation->id,
          //   "NumDemande" => "V00" . $numOperation->id,
          //   "NumCompte" =>   $numCompteCaissePrCDF,
          //   "NumComptecp" =>  $compteVirementInterGuichetCDF,
          //   "Debit"  => $request->commission,
          //   "Debit$"  => $request->commission / $tauxDuJour,
          //   "Debitfc" => $request->commission,
          //   "NomUtilisateur" => Auth::user()->name,
          //   "Libelle" => "PRELEVEMENT DE COMMISSION SUR LE COMPTE " . $compteCDF,
          // ]);
        }

        if ($request->montantDepot > 0) {

          //DEBITE LE COMPTE DU CAISSIER CONCERNE
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
            "NumCompte" => $CompteCaissierCDF,
            "NumComptecp" => $compteCDF,
            "Operant" => $intituleCompteCaissierCDF,
            "Debit"  => $request->montantDepot,
            "Debit$"  => $request->montantDepot / $tauxDuJour,
            "Debitfc" => $request->montantDepot,
            "NomUtilisateur" => Auth::user()->name,
            "Libelle" => $request->libelle,
          ]);
          //CREDITE LE COMPTE DU MEMBRE SI C UNE OPERATION EN CDF
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
            "NumCompte" => $compteCDF,
            "NumComptecp" => $CompteCaissierCDF,
            "Operant" => $request->operant,
            "Credit"  => $request->montantDepot,
            "Credit$"  => $request->montantDepot / $tauxDuJour,
            "Creditfc" => $request->montantDepot,
            "NomUtilisateur" => Auth::user()->name,
            "Libelle" => $request->libelle,
          ]);
        }

        //RECUPERE L DERNIER ID DU L'OPERATION INSEREE
        $lastInsertedId = Transactions::latest()->first();
        //COMPLETE LE BILLETAGE

        BilletageCdf::create([
          "refOperation" => $lastInsertedId->NumTransaction,
          "NumCompte" => $compteCDF,
          "NomMembre" => $request->operant,
          "NumAbrege" => $request->refCompte,
          "Beneficiaire" => $request->deposantName,
          "Motif" => $request->libelle,
          "Devise" => $request->devise,
          "vightMilleFranc" => $request->vightMille,
          "dixMilleFranc" => $request->dixMille,
          "cinqMilleFranc" => $request->cinqMille,
          "milleFranc" => $request->milleFranc,
          "cinqCentFranc" => $request->cinqCentFr,
          "deuxCentFranc" => $request->deuxCentFranc,
          "centFranc" => $request->centFranc,
          "montantEntre" => $request->montantDepot,
          "cinquanteFanc" => $request->cinquanteFanc,
          "NomUtilisateur" => Auth::user()->name,
          "DateTransaction" => $date
        ]);
        //CREDITE LE COMPTE CONTRE PARTIE  
        Dummy::create([
          "NumTransaction" => $NumTransaction,
          "DateTransaction" => $date,
          "DateSaisie" => $date,
          "Taux" => 1,
          "TypeTransaction" => "D",
          "CodeMonnaie" => 2,
          "CodeAgence" => "20",
          "NumDossier" => "DOS00" . $numOperation->id,
          "NumDemande" => "V00" . $numOperation->id,
          "NumCompte" => $CompteCaissierCDF,
          "NumComptecp" => $compteCDF,
          "Operant" => $request->operant,
          "Debitfc" => $request->montantDepot,
          "NomUtilisateur" => Auth::user()->name,
          "Libelle" => $request->libelle,
        ]);
      } else if ($request->devise == "USD") {
        //VERIFIE SI LE CLIENT A UN COMPTE EN USD
        $checkCompteExist = Comptes::where("NumAdherant", "=", $request->refCompte)
          ->where("CodeMonnaie", "=", 1)->first();
        if ($checkCompteExist) {
          $NumCompteUSD = $checkCompteExist->NumCompte;

          if (isset($request->commission) and $request->commission > 0) {
            //CREDITE LE COMPTE COMMISION USD
            $compteCommissionUSD = "7270000000201";
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
              "NumCompte" => $compteCommissionUSD,
              "NumComptecp" => $NumCompteUSD,
              "Operant" => "COMPTE COMMISSION CDF",
              "Credit"  => $request->commission,
              "Credit$"  => $request->commission,
              "Creditfc" => $request->commission * $tauxDuJour,
              "NomUtilisateur" => Auth::user()->name,
              "Libelle" => "PRELEVEMENT DE COMMISSION SUR LE COMPTE " . $NumCompteUSD . " par le caissier " . Auth::user()->name,
            ]);

            //DEBITE LE COMPTE DU MEMBRE DE LA COMMISSION
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
              "NumCompte" => $NumCompteUSD,
              "NumComptecp" =>  $compteCommissionUSD,
              "Debit"  => $request->commission,
              "Debit$"  => $request->commission,
              "Debitfc" => $request->commission * $tauxDuJour,
              "NomUtilisateur" => Auth::user()->name,
              "Libelle" => "PRISE COMMISSION",
            ]);

            // $numCompteCaissePrUSD = "5700000000201";
            // $compteVirementInterGuichetUSD = "5900000000201";

            // Transactions::create([
            //   "NumTransaction" => $NumTransaction,
            //   "DateTransaction" => $date,
            //   "DateSaisie" => $date,
            //   "Taux" => 1,
            //   "TypeTransaction" => "C",
            //   "CodeMonnaie" => 1,
            //   "CodeAgence" => "20",
            //   "NumDossier" => "DOS00" . $numOperation->id,
            //   "NumDemande" => "V00" . $numOperation->id,
            //   "NumCompte" => $compteVirementInterGuichetUSD,
            //   "NumComptecp" =>  $numCompteCaissePrUSD,
            //   "Credit"  => $request->commission,
            //   "Credit$"  => $request->commission,
            //   "Creditfc" => $request->commission * $tauxDuJour,
            //   "NomUtilisateur" => Auth::user()->name,
            //   "Libelle" => "PRELEVEMENT DE COMMISSION SUR LE COMPTE " . $NumCompteUSD,
            // ]);


            // Transactions::create([
            //   "NumTransaction" => $NumTransaction,
            //   "DateTransaction" => $date,
            //   "DateSaisie" => $date,
            //   "Taux" => 1,
            //   "TypeTransaction" => "D",
            //   "CodeMonnaie" => 1,
            //   "CodeAgence" => "20",
            //   "NumDossier" => "DOS00" . $numOperation->id,
            //   "NumDemande" => "V00" . $numOperation->id,
            //   "NumCompte" => $compteCommissionUSD,
            //   "NumComptecp" =>  $compteVirementInterGuichetUSD,
            //   "Debit"  => $request->commission,
            //   "Debit$"  => $request->commission,
            //   "Debitfc" => $request->commission * $tauxDuJour,
            //   "NomUtilisateur" => Auth::user()->name,
            //   "Libelle" => "PRELEVEMENT DE COMMISSION SUR LE COMPTE " . $NumCompteUSD,
            // ]);
            // BilletageUsd::create([
            //   "refOperation" => $NumTransaction,
            //   "montantEntre" => $request->commission,
            //   "NomUtilisateur" => Auth::user()->name,
            //   "DateTransaction" => $date,
            //   "is_commision" => 1
            // ]);
          }

          if ($request->montantDepot > 0) {
            //DEBITE LE COMPTE DU CAISSIER EN USD
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
              "NumCompte" => $CompteCaissierUSD,
              "NumComptecp" => $NumCompteUSD,
              "Debit" => $request->montantDepot,
              "Operant" => $intituleCompteCaissierUSD,
              "Debit$" => $request->montantDepot,
              "Debitfc" => $request->montantDepot *  $tauxDuJour,
              "NomUtilisateur" => Auth::user()->name,
              "Libelle" => $request->libelle,
            ]);

            //CREDIT LE COMPTE DU MEMBRE SI C UNE OPERATION EN USD
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
              "NumCompte" => $NumCompteUSD,
              "NumComptecp" => $CompteCaissierUSD,
              "Credit" => $request->montantDepot,
              // "Operant" => $request->operant,
              "Credit$" => $request->montantDepot,
              "Creditfc" => $request->montantDepot *  $tauxDuJour,
              "NomUtilisateur" => Auth::user()->name,
              "Libelle" => $request->libelle,
            ]);
          }

          //RECUPERE LE DERNIER ID DU L'OPERATION INSEREE
          $lastInsertedId = Transactions::latest()->first();
          //COMPLETE LE BILLETAGE

          BilletageUsd::create([
            "refOperation" => $lastInsertedId->NumTransaction,
            "NumCompte" => $NumCompteUSD,
            "NomMembre" => $request->operant,
            "NumAbrege" => $request->refCompte,
            "Beneficiaire" => $request->deposantName,
            "Motif" => $request->libelle,
            "Devise" => $request->devise,
            "centDollars" => $request->hundred,
            "cinquanteDollars" => $request->fitfty,
            "vightDollars" => $request->twenty,
            "dixDollars" => $request->ten,
            "cinqDollars" => $request->five,
            "unDollars" => $request->oneDollar,
            "montantEntre" => $request->montantDepot,
            "NomUtilisateur" => Auth::user()->name,
            "DateTransaction" => $date
          ]);
          //CREDITE LE COMPTE CONTRE PARTIE  
          Dummy::create([
            "NumTransaction" => $NumTransaction,
            "DateTransaction" => $date,
            "DateSaisie" => $date,
            "Taux" => 1,
            "TypeTransaction" => "D",
            "CodeMonnaie" => 2,
            "CodeAgence" => "20",
            "NumDossier" => "DOS00" . $numOperation->id,
            "NumDemande" => "V00" . $numOperation->id,
            "NumCompte" => $CompteCaissierUSD,
            "NumComptecp" =>  $NumCompteUSD,
            "Debit" => $request->montantDepot,
            // "Operant" => $request->operant,
            "Debit$" => $request->montantDepot,
            "Debitfc"  => $request->montantDepot * $tauxDuJour,
            "NomUtilisateur" => Auth::user()->name,
            "Libelle" => $request->libelle,
          ]);
        } else {
          return response()->json(["success" => 0, "msg" => "Le numéro de compte en USD n'existe pas pour ce client vous devez d'abord l'activer."]);
        }
      }
    }
    //RECUPERE LES INFORMATIONS DE LA PERSONNE QUI VENAIT D'EFFECTUER UN MOUVEMENT
    $getMembreInfo = SMSBanking::where("NumAbrege", "=", $request->refCompte)->first();
    $user = Auth::user();
    if ($getMembreInfo) {
      if ($getMembreInfo->Email != null and $getMembreInfo->ActivatedEmail == 1) {


        if ($request->devise == "CDF") {
          $getMembreInfo2 = Comptes::where("NumAdherant", "=", $request->refCompte)->where("CodeMonnaie", "=", 2)->first();
          //RECUPERE LE SOLDE DU MEMBRE EN FC 
          $compteCDF = $getMembreInfo2->NumCompte;
          $soldeMembreCDF = Transactions::select(
            DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeMembreCDF"),
          )->where("NumCompte", '=', $compteCDF)
            ->groupBy("NumCompte")
            ->first();


          $data = $getMembreInfo2->sexe == "M" ? " Bonjour Monsieur " : ($getMembreInfo2->sexe == "F" ? " Bonjour Madame " : " Bonjour ") .
            $getMembreInfo2->NomCompte . " Votre compte CDF " . $compteCDF . " est crédité de " . $request->montantDepot . " CDF  Votre nouveau solde est de " . $soldeMembreCDF->soldeMembreCDF . " CDF";
          Mail::to($getMembreInfo->Email)->send(new TestMail($user, $data));
          // return view('emails.test');
        } else if ($request->devise == "USD") {
          $getMembreInfo2 = Comptes::where("NumAdherant", "=", $request->refCompte)->where("CodeMonnaie", "=", 1)->first();
          $NumCompteUSD = $getMembreInfo2->NumCompte;
          //RECUPERE LE SOLDE DU MEMBRE EN USD
          $soldeMembreUSD = Transactions::select(
            DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
          )->where("NumCompte", '=', $NumCompteUSD)
            ->groupBy("NumCompte")
            ->first();

          $data = $getMembreInfo2->sexe == "M" ? "Bonjour Monsieur" : ($getMembreInfo2->sexe == "F" ? " Bonjour Madame " : " Bonjour ") .
            $getMembreInfo2->NomCompte . " Votre compte USD " . $NumCompteUSD . " est crédité de " . $request->montantDepot . " USD Votre nouveau solde est de  " . $soldeMembreUSD->soldeMembreUSD . "USD";
          Mail::to($getMembreInfo->Email)->send(new TestMail($user, $data));
          // return view('emails.test');
        }
      }


      if ($getMembreInfo->Telephone != null and $getMembreInfo->ActivatedSMS == 1) {

        if ($request->devise == "CDF") {
          try {
            $getMembreInfo2 = Comptes::where("NumAdherant", "=", $request->refCompte)->where("CodeMonnaie", "=", 2)->first();
            //RECUPERE LE SOLDE DU MEMBRE EN USD
            $NumCompteCDF = $getMembreInfo2->NumCompte;
            $soldeMembreCDF = Transactions::select(
              DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeMembreCDF"),
            )->where("NumCompte", '=', $NumCompteCDF)
              ->groupBy("NumCompte")
              ->first();

            $message = $getMembreInfo2->sexe == "M." ? " Bonjour " : ($getMembreInfo2->sexe == "F" ? " Bonjour Mdme" : " Bonjour ") .
              $getMembreInfo2->NomCompte . " Votre compte CDF " . $NumCompteCDF . " est credite de " . $request->montantDepot . " CDF  Votre nouveau solde est de " . $soldeMembreCDF->soldeMembreCDF . " CDF";

            $receiver_number = $getMembreInfo->Telephone;
            // $account_sid = getenv("TWILIO_SID");
            // $auth_token = getenv("TWILIO_TOKEN");
            // $twilio_number = getenv("TWILIO_FROM");
            // Récupérer les valeurs des variables d'environnement
            $account_sid = env('TWILIO_SID');
            $auth_token = env('TWILIO_TOKEN');
            $twilio_number = env('TWILIO_FROM');

            $client = new Client($account_sid, $auth_token);
            $client->messages->create($receiver_number, [
              'from' => $twilio_number,
              'body' => $message
            ]);
            // return redirect()->back();
          } catch (\Throwable $th) {
            throw $th;
          }
        } else if ($request->devise == "USD") {
          try {
            $getMembreInfo2 = Comptes::where("NumAdherant", "=", $request->refCompte)->where("CodeMonnaie", "=", 1)->first();
            //RECUPERE LE SOLDE DU MEMBRE EN USD
            $NumCompteUSD = $getMembreInfo2->NumCompte;
            $soldeMembreUSD = Transactions::select(
              DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
            )->where("NumCompte", '=', $NumCompteUSD)
              ->groupBy("NumCompte")
              ->first();

            $receiver_number = $getMembreInfo->Telephone;
            $message = $getMembreInfo2->sexe == "M" ? "Bonjour Monsieur" : ($getMembreInfo2->sexe == "F" ? " Bonjour Madame " : " Bonjour ") .
              $getMembreInfo2->NomCompte . " Votre compte USD " . $NumCompteUSD . " est credite de " . $request->montantDepot . " USD Votre nouveau solde est de  " . $soldeMembreUSD->soldeMembreUSD . "USD";
            // $account_sid = getenv("TWILIO_SID");
            // $auth_token = getenv("TWILIO_TOKEN");
            // $twilio_number = getenv("TWILIO_FROM");
            // Récupérer les valeurs des variables d'environnement
            $account_sid = env('TWILIO_SID');
            $auth_token = env('TWILIO_TOKEN');
            $twilio_number = env('TWILIO_FROM');

            $client = new Client($account_sid, $auth_token);
            $client->messages->create($receiver_number, [
              'from' => $twilio_number,
              'body' => $message
            ]);
            // return redirect()->back();
          } catch (\Throwable $th) {
            throw $th;
          }
        }
      }
    }




    return response()->json(["success" => 1, "msg" => "Opération bien effectuée."]);
  }

  public function getBilletage()
  {
    $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;

    //RECUPERE LE BILLETAGE EN FRANC CONGOLAIS
    $billetageCDF = BilletageCdf::select(
      DB::raw("SUM(vightMilleFranc)-SUM(vightMilleFrancSortie) as vightMilleFran"),
      DB::raw("SUM(dixMilleFranc)-SUM(dixMilleFrancSortie) as dixMilleFran"),
      DB::raw("SUM(cinqMilleFranc)-SUM(cinqMilleFrancSortie) as cinqMilleFran"),
      DB::raw("SUM(milleFranc)-SUM(milleFrancSortie) as milleFran"),
      DB::raw("SUM(cinqCentFranc)-SUM(cinqCentFrancSortie) as cinqCentFran"),
      DB::raw("SUM(deuxCentFranc)-SUM(deuxCentFrancSortie) as deuxCentFran"),
      DB::raw("SUM(centFranc)-SUM(centFrancSortie) as centFran"),
      DB::raw("SUM(cinquanteFanc)-SUM(cinquanteFancSortie) as cinquanteFan"),
    )->where("NomUtilisateur", "=", Auth::user()->name)->where("DateTransaction", "=", $date)
      ->groupBy("NomUtilisateur")
      ->get();

    //RECUPERE LE BILLETAGE EN USD

    $billetageUSD = BilletageUsd::select(
      DB::raw("SUM(centDollars)-SUM(centDollarsSortie) as centDollar"),
      DB::raw("SUM(cinquanteDollars)-SUM(cinquanteDollarsSortie) as cinquanteDollar"),
      DB::raw("SUM(vightDollars)-SUM(vightDollarsSortie) as vightDollar"),
      DB::raw("SUM(dixDollars)-SUM(dixDollarsSortie) as dixDollar"),
      DB::raw("SUM(cinqDollars)-SUM(cinqDollarsSortie) as cinqDollar"),
      DB::raw("SUM(unDollars)-SUM(unDollarsSortie) as unDollar"),
    )->where("NomUtilisateur", "=", Auth::user()->name)->where("DateTransaction", "=", $date)
      ->groupBy("NomUtilisateur")
      ->get();

    //RECUPERE 8 OPERATIONS RECENTES CDF


    $operationCDF = Transactions::where("NomUtilisateur", "=", Auth::user()->name)
      ->where("DateTransaction", "=", $date)->where("CodeMonnaie", "=", "2")
      ->groupBy("NumTransaction")
      ->paginate(12)->All();

    //RECUPERE 6 OPERATIONS RECENTES USD    
    $operationUSD = Transactions::where("NomUtilisateur", "=", Auth::user()->name)
      ->where("DateTransaction", "=", $date)->where("CodeMonnaie", "=", "1")
      ->groupBy("NumTransaction")
      ->paginate(12)->All();

    $soldeOperationCDF = Transactions::select(
      DB::raw("SUM(Debitfc) as sommeDeDebitCDF"),
      DB::raw("SUM(Creditfc) as sommeDeCreditCDF"),
    )->where("NomUtilisateur", "=", Auth::user()->name)->where("DateTransaction", "=", $date)
      ->groupBy("NomUtilisateur")
      ->get();

    $soldeOperationUSD = Transactions::select(
      DB::raw("SUM(Debit$) as sommeDeDebitUSD"),
      DB::raw("SUM(Credit$) as sommeDeCreditUSD"),
    )->where("NomUtilisateur", "=", Auth::user()->name)->where("DateTransaction", "=", $date)
      ->groupBy("NomUtilisateur")
      ->get();



    return response()->json(["data" => $billetageCDF, "data2" => $billetageUSD, "data3" => $operationCDF, "data4" => $operationUSD, "data5" => $soldeOperationCDF, "data6" => $soldeOperationUSD]);
  }

  public function getBilletageRepertoire(Request $request)
  {
    $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
    $dateDebut = $request->dateToSearch1;
    $dateFin = $request->dateToSearch2;
    //RECUPERE LE BILLETAGE EN FRANC CONGOLAIS
    $billetageCDF = BilletageCdf::select(
      DB::raw("SUM(vightMilleFranc)-SUM(vightMilleFrancSortie) as vightMilleFran"),
      DB::raw("SUM(dixMilleFranc)-SUM(dixMilleFrancSortie) as dixMilleFran"),
      DB::raw("SUM(cinqMilleFranc)-SUM(cinqMilleFrancSortie) as cinqMilleFran"),
      DB::raw("SUM(milleFranc)-SUM(milleFrancSortie) as milleFran"),
      DB::raw("SUM(cinqCentFranc)-SUM(cinqCentFrancSortie) as cinqCentFran"),
      DB::raw("SUM(deuxCentFranc)-SUM(deuxCentFrancSortie) as deuxCentFran"),
      DB::raw("SUM(centFranc)-SUM(centFrancSortie) as centFran"),
      DB::raw("SUM(cinquanteFanc)-SUM(cinquanteFancSortie) as cinquanteFan"),
    )->where("NomUtilisateur", "=", $request->userName)
      ->whereBetween('DateTransaction', [$dateDebut, $dateFin])
      ->groupBy("NomUtilisateur")
      ->get();

    //RECUPERE LE BILLETAGE EN USD

    $billetageUSD = BilletageUsd::select(
      DB::raw("SUM(centDollars)-SUM(centDollarsSortie) as centDollar"),
      DB::raw("SUM(cinquanteDollars)-SUM(cinquanteDollarsSortie) as cinquanteDollar"),
      DB::raw("SUM(vightDollars)-SUM(vightDollarsSortie) as vightDollar"),
      DB::raw("SUM(dixDollars)-SUM(dixDollarsSortie) as dixDollar"),
      DB::raw("SUM(cinqDollars)-SUM(cinqDollarsSortie) as cinqDollar"),
      DB::raw("SUM(unDollars)-SUM(unDollarsSortie) as unDollar"),
    )->where("NomUtilisateur", "=", $request->userName)
      ->whereBetween('DateTransaction', [$dateDebut, $dateFin])
      ->groupBy("NomUtilisateur")
      ->get();


    return response()->json(["data" => $billetageCDF, "data2" => $billetageUSD]);
  }



  public function depot()
  {

    if (Auth::user()->chefcaisse == 1 or Auth::user()->caissier == 1) {
      return view("depot-espece");
    } else {
      return view('home');
    }
  }
}
