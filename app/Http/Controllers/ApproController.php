<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use App\Models\Dummy;
use App\Models\Comptes;
use App\Models\BilletageCdf;
use App\Models\BilletageUsd;
use App\Models\Transactions;
use Illuminate\Http\Request;
use App\Models\TauxJournalier;
use App\Models\BilletageAppro_cdf;
use App\Models\BilletageAppro_usd;
use Illuminate\Support\Facades\DB;
use App\Models\CompteurTransaction;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class ApproController extends Controller
{

  //VERIFIE SI LA PERSONNE EST CONNECTEE
  public function __construct()
  {
    $this->middleware("auth");
  }
  //RECUPERE LA DATE DU JOUR

  //RECUPERE TOUS LES CAISSIERS

  public function getAllCaissier()
  {

    $dataCaissier = Comptes::where("isCaissier", "=", 1)->get();
    return response()->json(["data" => $dataCaissier]);
  }


  //SAVE NEW APPRO CAISSIER

  public function saveNewApproCaissier(Request $request)
  {
    //POUR RECUPERE LE NOM UTILISATEUR DU CAISSIER CONCERNE



    if ($request->devise == "CDF") {

      $dataCaissier = Comptes::where("NumCompte", "=", $request->caissierNumber)->where("CodeMonnaie", "=", 2)->first();
      //RECUPERE SUR LA TABLE USERS LE NOM QUI CORRESPOND A CE ID CDF
      $IdCaissier = $dataCaissier->caissierId;
      $numCompteCaissierCDF = $dataCaissier->NumCompte;
      $nomCaissier = User::where("id", "=", $IdCaissier)->first()->name;

      $numCompteCaissePrCDF = "5700000000202";
      $compteVirementInterGuichetCDF = "5900000000202";


      CompteurTransaction::create([
        'fakevalue' => "0000",
      ]);
      $numOperation = [];
      $numOperation = CompteurTransaction::latest()->first();
      $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;

      //RECUPERE LA DATE DU SYSTEME
      $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;

      BilletageAppro_cdf::create([
        "Reference" => $NumTransaction,
        "NumCompteCaissier" => $request->caissierNumber,
        "vightMilleFranc" => $request->vightMille,
        "dixMilleFranc" => $request->dixMille,
        "cinqMilleFranc" => $request->cinqMille,
        "milleFranc" => $request->milleFranc,
        "cinqCentFranc" => $request->cinqCentFr,
        "deuxCentFranc" => $request->deuxCentFranc,
        "centFranc" => $request->centFranc,
        "cinquanteFanc" => $request->cinquanteFanc,
        "NomUtilisateur" => Auth::user()->name,
        "NomDemandeur" => $nomCaissier,
        "DateTransaction" =>  $date,
        "montant" => $request->montant
      ]);
      //ECRITURE DE TRANSERT INTER GUICHET 

      //RECUPERE LE TAUX JOURNALIER
      $tauxDuJour = TauxJournalier::orderBy('id', 'desc')->first()->TauxEnFc;


      Dummy::create([
        "NumTransaction" => $NumTransaction,
        "DateTransaction" =>  $date,
        "DateSaisie" =>  $date,
        "Taux" => 1,
        "TypeTransaction" => "D",
        "CodeMonnaie" => 2,
        "CodeAgence" => "20",
        "NumDossier" => "DOS00" . $numOperation->id,
        "NumDemande" => "V00" . $numOperation->id,
        "NumCompte" => $compteVirementInterGuichetCDF,
        "NumComptecp" => $numCompteCaissePrCDF,
        "Debit" => $request->montant,
        "Operant" => $nomCaissier,
        // "Reduction" => $request->montant,
        "Debit$" => $request->montant / $tauxDuJour,
        "Debitfc" => $request->montant,
        "NomUtilisateur" => Auth::user()->name,
        "Libelle" => "Approvisionnement caisse secondaire de " . $nomCaissier,
      ]);

      //DEBITE LE COMPTE DE VIREMENT INTER GUICHET

      Dummy::create([
        "NumTransaction" => $NumTransaction,
        "DateTransaction" =>  $date,
        "DateSaisie" =>  $date,
        "Taux" => 1,
        "TypeTransaction" => "C",
        "CodeMonnaie" => 2,
        "CodeAgence" => "20",
        "NumDossier" => "DOS00" . $numOperation->id,
        "NumDemande" => "V00" . $numOperation->id,
        "NumCompte" =>  $numCompteCaissePrCDF,
        "NumComptecp" => $compteVirementInterGuichetCDF,
        "Credit" => $request->montant,
        "Operant" => $nomCaissier,
        "Reduction" => $request->montant,
        "Credit$" => $request->montant / $tauxDuJour,
        "Creditfc" => $request->montant,
        "NomUtilisateur" => Auth::user()->name,
        "Libelle" => "Approvisionnement caisse secondaire de " . $nomCaissier,
      ]);

      Dummy::create([
        "NumTransaction" => $NumTransaction,
        "DateTransaction" =>  $date,
        "DateSaisie" =>  $date,
        "Taux" => 1,
        "TypeTransaction" => "D",
        "CodeMonnaie" => 2,
        "CodeAgence" => "20",
        "NumDossier" => "DOS00" . $numOperation->id,
        "NumDemande" => "V00" . $numOperation->id,
        "NumCompte" =>  $numCompteCaissierCDF,
        "NumComptecp" => $numCompteCaissePrCDF,
        "Debit" => $request->montant,
        "Operant" => $nomCaissier,
        // "Reduction" => $request->montant,
        "Debit$" => $request->montant / $tauxDuJour,
        "Debitfc" => $request->montant,
        "NomUtilisateur" => Auth::user()->name,
        "Libelle" => "Approvisionnement caisse de " . $nomCaissier,
      ]);

      Dummy::create([
        "NumTransaction" => $NumTransaction,
        "DateTransaction" =>  $date,
        "DateSaisie" =>  $date,
        "Taux" => 1,
        "TypeTransaction" => "C",
        "CodeMonnaie" => 2,
        "CodeAgence" => "20",
        "NumDossier" => "DOS00" . $numOperation->id,
        "NumDemande" => "V00" . $numOperation->id,
        "NumCompte" =>  $compteVirementInterGuichetCDF,
        "NumComptecp" => $numCompteCaissePrCDF,
        "Credit" => $request->montant,
        "Operant" => $nomCaissier,
        // "Reduction" => $request->montant,
        "Credit$" => $request->montant / $tauxDuJour,
        "Creditfc" => $request->montant,
        "NomUtilisateur" => Auth::user()->name,
        "Libelle" => "Approvisionnement caisse de " . $nomCaissier,
      ]);
    } else if ($request->devise == "USD") {

      $dataCaissier = Comptes::where("NumCompte", "=", $request->caissierNumber)->where("CodeMonnaie", "=", 1)->first();
      //RECUPERE SUR LA TABLE USERS LE NOM QUI CORRESPOND A CE ID USD
      $IdCaissier = $dataCaissier->caissierId;
      $nomCaissier = User::where("id", "=", $IdCaissier)->first()->name;
      $numCompteCaissierUSD = $dataCaissier->NumCompte;

      $numCompteCaissePr = "5700000000201";
      $compteVirementInterGuichet = "5900000000201";
      CompteurTransaction::create([
        'fakevalue' => "0000",
      ]);
      $numOperation = [];
      $numOperation = CompteurTransaction::latest()->first();
      $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;

      //RECUPERE LA DATE DU SYSTEME
      $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;



      BilletageAppro_usd::create([
        "Reference" => $NumTransaction,
        "NumCompteCaissier" => $request->caissierNumber,
        "centDollars" => $request->hundred,
        "cinquanteDollars" => $request->fitfty,
        "vightDollars" => $request->twenty,
        "dixDollars" => $request->ten,
        "cinqDollars" => $request->five,
        "unDollars" => $request->oneDollar,
        "NomUtilisateur" => Auth::user()->name,
        "NomDemandeur" => $nomCaissier,
        "DateTransaction" =>  $date,
        "montant" => $request->montant
      ]);


      //ECRITURE DE TRANSERT INTER GUICHET 

      //RECUPERE LE TAUX JOURNALIER
      $tauxDuJour = TauxJournalier::orderBy('id', 'desc')->first()->TauxEnFc;


      Dummy::create([
        "NumTransaction" => $NumTransaction,
        "DateTransaction" => $date,
        "DateSaisie" =>  $date,
        "Taux" => 1,
        "TypeTransaction" => "D",
        "CodeMonnaie" => 1,
        "CodeAgence" => "20",
        "NumDossier" => "DOS00" . $numOperation->id,
        "NumDemande" => "V00" . $numOperation->id,
        "NumCompte" => $compteVirementInterGuichet,
        "NumComptecp" => $numCompteCaissePr,
        "Debit" => $request->montant,
        "Operant" => $nomCaissier,
        // "Reduction" => $request->montant,
        "Debit$" => $request->montant,
        "Debitfc" => $request->montant * $tauxDuJour,
        "NomUtilisateur" => Auth::user()->name,
        "Libelle" => "Approvisionnement caisse secondaire de " . $nomCaissier,
      ]);

      //DEBITE LE COMPTE DE VIREMENT INTER GUICHET

      Dummy::create([
        "NumTransaction" => $NumTransaction,
        "DateTransaction" =>  $date,
        "DateSaisie" =>  $date,
        "Taux" => 1,
        "TypeTransaction" => "C",
        "CodeMonnaie" => 1,
        "CodeAgence" => "20",
        "NumDossier" => "DOS00" . $numOperation->id,
        "NumDemande" => "V00" . $numOperation->id,
        "NumCompte" =>  $numCompteCaissePr,
        "NumComptecp" => $compteVirementInterGuichet,
        "Credit" => $request->montant,
        "Operant" => $nomCaissier,
        "Reduction" => $request->montant,
        "Credit$" => $request->montant,
        "Creditfc" => $request->montant * $tauxDuJour,
        "NomUtilisateur" => Auth::user()->name,
        "Libelle" => "Approvisionnement caisse secondaire de " . $nomCaissier,
      ]);

      Dummy::create([
        "NumTransaction" => $NumTransaction,
        "DateTransaction" =>  $date,
        "DateSaisie" =>  $date,
        "Taux" => 1,
        "TypeTransaction" => "D",
        "CodeMonnaie" => 1,
        "CodeAgence" => "20",
        "NumDossier" => "DOS00" . $numOperation->id,
        "NumDemande" => "V00" . $numOperation->id,
        "NumCompte" =>  $numCompteCaissierUSD,
        "NumComptecp" => $numCompteCaissePr,
        "Debit" => $request->montant,
        "Operant" => $nomCaissier,
        // "Reduction" => $request->montant,
        "Debit$" => $request->montant,
        "Debitfc" => $request->montant * $tauxDuJour,
        "NomUtilisateur" => Auth::user()->name,
        "Libelle" => "Approvisionnement caisse de " . $nomCaissier,
      ]);

      Dummy::create([
        "NumTransaction" => $NumTransaction,
        "DateTransaction" =>  $date,
        "DateSaisie" =>  $date,
        "Taux" => 1,
        "TypeTransaction" => "C",
        "CodeMonnaie" => 1,
        "CodeAgence" => "20",
        "NumDossier" => "DOS00" . $numOperation->id,
        "NumDemande" => "V00" . $numOperation->id,
        "NumCompte" =>  $compteVirementInterGuichet,
        "NumComptecp" => $numCompteCaissePr,
        "Credit" => $request->montant,
        "Operant" => $nomCaissier,
        // "Reduction" => $request->montant,
        "Credit$" => $request->montant,
        "Creditfc" => $request->montant * $tauxDuJour,
        "NomUtilisateur" => Auth::user()->name,
        "Libelle" => "Approvisionnement caisse de " . $nomCaissier,
      ]);
    }

    return response()->json(["success" => 1, "msg" => "Appro bien effectué"]);
  }

  //FUNCTION TO FETCH DAYLY APPRO
  public function getDaylyAppro()
  {
    //RECUPERE LA DATE JOURNALIER
    $DateTaux = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;


    //RECUPERE TOUTES LES APPRO JOURNALIERES CDF
    $data = BilletageAppro_cdf::where("DateTransaction", "=", $DateTaux)->where("received", "=", 0)->get();

    //RECUPERE TOUTES LES APPRO JOURNALIERES USD

    $dataUSD = BilletageAppro_usd::where("DateTransaction", "=", $DateTaux)->where("received", "=", 0)->get();

    $compteCaisseCDF = "5700000000202";
    $compteCaisseUSD = "5700000000201";

    $getSoldeCaisseCDF = Transactions::select(
      DB::raw("SUM(Debitfc)-SUM(Creditfc) as soldeCaisseCDF"),
    )->where("NumCompte", '=',  $compteCaisseCDF)
      ->where("CodeMonnaie", '=',  2)
      ->first();

    $getSoldeCaisseUSD = Transactions::select(
      DB::raw("SUM(Debit$)-SUM(Credit$) as soldeCaisseUSD"),
    )->where("NumCompte", '=',  $compteCaisseUSD)
      ->where("CodeMonnaie", '=',  1)
      ->first();

    return response()->json(['data' => $data, 'data2' => $dataUSD, "soldeCaisseCDF" => $getSoldeCaisseCDF, "soldeCaisseUSD" => $getSoldeCaisseUSD]);
  }

  //RECUPERE LES APPRO JOURNALIERE LIEES A UN UTILISATEUR SPECIFIQUE
  public function getDaylyApproUser()
  {
    //RECUPERE LA DATE JOURNALIER
    $DateTaux = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;

    //RECUPERE TOUTES LES APPRO JOURNALIERES CDF 
    $data = BilletageAppro_cdf::where("DateTransaction", "=", $DateTaux)->where("NomDemandeur", "=", Auth::user()->name)->where("received", "=", 0)->orderBy('id', 'desc')->first();

    //RECUPERE TOUTES LES APPRO JOURNALIERES USD

    $dataUSD = BilletageAppro_usd::where("DateTransaction", "=", $DateTaux)->where("NomDemandeur", "=", Auth::user()->name)->where("received", "=", 0)->orderBy('id', 'desc')->first();

    return response()->json(['data' => $data, 'data2' => $dataUSD]);
  }

  //REVOME SPECIFIC ELEMENT


  public function destroy(BilletageAppro_cdf $id)
  {
    try {
      $id->delete();
      return response()->json(["success" => 1, "msg" => "La ligne a été supprimée aves succès"]);
    } catch (Exception $th) {
      Log::error($th);
    }
  }

  public function destroyusd(BilletageAppro_usd $id)
  {
    try {
      $id->delete();
      return response()->json(["success" => 1, "msg" => "La ligne a été supprimée aves succès"]);
    } catch (Exception $th) {
      Log::error($th);
    }
  }

  //PERMET A LA CAISSIERE D'ACCEPTER L'APPRO QU'ON VENAIT DE LUI FAIRE CDF

  public function acceptApproCDF($id)
  {
    BilletageAppro_cdf::where("id", "=", $id)->update([
      "received" => 1
    ]);

    //RECUPERE LA LIGNE DE CE BILLETAGE POUR L'INSERER DANS LA VRAI TABLE DE BILLETAGE

    $billetageCDF = BilletageAppro_cdf::where("id", "=", $id)->first();

    //PUIS L'INSERT DANS LA TABLE DE VRAI BILLETAGE

    BilletageCdf::create([
      "refOperation" => $billetageCDF->id,
      "vightMilleFranc" => $billetageCDF->vightMilleFranc,
      "dixMilleFranc" => $billetageCDF->dixMilleFranc,
      "cinqMilleFranc" => $billetageCDF->cinqMilleFranc,
      "milleFranc" => $billetageCDF->milleFranc,
      "cinqCentFranc" => $billetageCDF->cinqCentFranc,
      "deuxCentFranc" => $billetageCDF->deuxCentFranc,
      "centFranc" => $billetageCDF->centFranc,
      "cinquanteFanc" => $billetageCDF->cinquanteFanc,
      "montantEntre" => $billetageCDF->montant,
      "NomUtilisateur" => $billetageCDF->NomDemandeur,
      "DateTransaction" => $billetageCDF->DateTransaction,

    ]);

    //ECRITURE DE TRANSERT INTER GUICHET 
    CompteurTransaction::create([
      'fakevalue' => "0000",
    ]);
    $numOperation = [];
    $numOperation = CompteurTransaction::latest()->first();


    //RECUPERE LA LIGNE POUR CREDITER LE COMPTE PRINCIPALE DANS LA TABLE DUMMY
    $operationInterGuichet = Dummy::where("NumTransaction", "=", $billetageCDF->Reference)->get();

    for ($i = 0; $i < sizeof($operationInterGuichet); $i++) {

      Transactions::create([
        "NumTransaction" => $operationInterGuichet[$i]->NumTransaction,
        "DateTransaction" => $operationInterGuichet[$i]->DateTransaction,
        "DateSaisie" => $operationInterGuichet[$i]->DateTransaction,
        "Taux" => 1,
        "TypeTransaction" => $operationInterGuichet[$i]->TypeTransaction,
        "CodeMonnaie" => $operationInterGuichet[$i]->CodeMonnaie,
        "CodeAgence" => "20",
        "NumDossier" => $operationInterGuichet[$i]->NumDossier,
        "NumDemande" => "V00" . $numOperation->id,
        "NumCompte" => $operationInterGuichet[$i]->NumCompte,
        "NumComptecp" => $operationInterGuichet[$i]->NumComptecp,
        "Debit" =>  $operationInterGuichet[$i]->Debit,
        "Credit" =>  $operationInterGuichet[$i]->Credit,
        "Operant" => $operationInterGuichet[$i]->Operant,
        "Reduction" => $operationInterGuichet[$i]->Reduction,
        "Debit$" => $operationInterGuichet[$i]->Debit,
        "Credit$" => $operationInterGuichet[$i]->Credit,
        "Creditfc" => $operationInterGuichet[$i]->Creditfc,
        "Debitfc" => $operationInterGuichet[$i]->Debitfc,
        "NomUtilisateur" => $operationInterGuichet[$i]->NomUtilisateur,
        "Libelle" => $operationInterGuichet[$i]->Libelle,
      ]);
    }

    return response()->json(["success" => 1, "msg" => "Validation réussie."]);
  }

  //PERMET A LA CAISSIERE D'ACCEPTER L'APPRO QU'ON VENAIT DE LUI FAIRE USD

  public function acceptApproUSD($id)

  {
    BilletageAppro_usd::where("id", "=", $id)->update([
      "received" => 1
    ]);

    //RECUPERE LA LIGNE DE CE BILLETAGE POUR L'INSERER DANS LA VRAI TABLE DE BILLETAGE
    $billetageUSD = BilletageAppro_usd::where("id", "=", $id)->first();

    BilletageUsd::create([
      "refOperation" => $billetageUSD->id,
      "centDollars" => $billetageUSD->centDollars,
      "cinquanteDollars" => $billetageUSD->cinquanteDollars,
      "vightDollars" => $billetageUSD->vightDollars,
      "dixDollars" => $billetageUSD->dixDollars,
      "cinqDollars" => $billetageUSD->cinqDollars,
      "unDollars" => $billetageUSD->unDollars,
      "montantEntre" => $billetageUSD->montant,
      "NomUtilisateur" => $billetageUSD->NomDemandeur,
      "DateTransaction" => $billetageUSD->DateTransaction
    ]);




    CompteurTransaction::create([
      'fakevalue' => "0000",
    ]);
    $numOperation = [];
    $numOperation = CompteurTransaction::latest()->first();


    //RECUPERE LA LIGNE POUR CREDITER LE COMPTE PRINCIPALE DANS LA TABLE DUMMY
    $operationInterGuichet = Dummy::where("NumTransaction", "=", $billetageUSD->Reference)->get();

    for ($i = 0; $i < sizeof($operationInterGuichet); $i++) {

      Transactions::create([
        "NumTransaction" => $operationInterGuichet[$i]->NumTransaction,
        "DateTransaction" => $operationInterGuichet[$i]->DateTransaction,
        "DateSaisie" => $operationInterGuichet[$i]->DateTransaction,
        "Taux" => 1,
        "TypeTransaction" => "C",
        "CodeMonnaie" => 1,
        "CodeAgence" => "20",
        "NumDossier" => "DOS00" . $numOperation->id,
        "NumDemande" => "V00" . $numOperation->id,
        "NumCompte" => $operationInterGuichet[$i]->NumCompte,
        "NumComptecp" => $operationInterGuichet[$i]->NumComptecp,
        "Debit" =>  $operationInterGuichet[$i]->Debit,
        "Credit" =>  $operationInterGuichet[$i]->Credit,
        "Operant" => $operationInterGuichet[$i]->Operant,
        "Reduction" => $operationInterGuichet[$i]->Reduction,
        "Credit$" => $operationInterGuichet[$i]->Credit,
        "Debit$" => $operationInterGuichet[$i]->Debit,
        "Debitfc" => $operationInterGuichet[$i]->Debitfc,
        "Creditfc" => $operationInterGuichet[$i]->Creditfc,
        "NomUtilisateur" => $operationInterGuichet[$i]->NomUtilisateur,
        "Libelle" => $operationInterGuichet[$i]->Libelle,
      ]);
    }





    return response()->json(["success" => 1, "msg" => "Validation réussie."]);
  }

  public function getApproPage()
  {
    if (Auth::user()->chefcaisse == 1) {
      return view('appro');
    } else {
      return view('home');
    }
  }
}
