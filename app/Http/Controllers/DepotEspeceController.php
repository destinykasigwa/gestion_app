<?php

namespace App\Http\Controllers;

use App\Models\Dummy;
use App\Models\Comptes;
use App\Models\BilletageCdf;
use App\Models\BilletageUsd;
use App\Models\Transactions;
use Illuminate\Http\Request;
use App\Models\AdhesionMembre;
use App\Models\Positionnement;
use App\Models\TauxJournalier;
use App\Models\CompteurDocument;
use Illuminate\Support\Facades\DB;
use App\Models\CompteurTransaction;
use Illuminate\Support\Facades\Auth;
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
    $data = AdhesionMembre::where('compteAbrege', '=', $id)->first();

    //RECUPERE LE COMPTE EN CDF 

    //RECUPERE LE SOLDE DU MEMBRE EN FC EN CDF
    $compteMembreCDF = Comptes::where('NumAdherant', '=', $id)->where('CodeMonnaie', '=', 2)->first()->NumCompte;
    $soldeMembreCDF = Transactions::select(
      // DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
      DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeMembreCDF"),
    )->where("NumCompte", '=', $compteMembreCDF)
      ->groupBy("NumCompte")
      ->get();


    //RECUPERE LE SOLDE DU MEMBRE EN FC EN USD
    $compteMembreUSD = Comptes::where('NumAdherant', '=', $id)->where('CodeMonnaie', '=', 1)->first()->NumCompte;
    $soldeMembreUSD = Transactions::select(
      // DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
      DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
    )->where("NumCompte", '=', $compteMembreUSD)
      ->groupBy("NumCompte")
      ->get();

    //RECUPERE LE DERNIER ID POUR LA TABLE COMPTEUR DOCUMENT
    $lastId = [];
    $lastId = CompteurDocument::orderBy('id', 'desc')->first();
    $numDoc = $lastId->id;



    if ($data) {

      return response()->json([
        "success" => 1, 'data' =>  $data, "soldeMembreCDF" => $soldeMembreCDF, "soldeMembreUSD" => $soldeMembreUSD, "numdoc" => $numDoc
      ]);
    } else {

      return response()->json([
        "success" => 0, 'msg' =>  "Ce compte ne semble pas existé"
      ]);
    }
  }

  //FUNCTION QUI RECUPERE UNE SPECIFIQUE OPERATION QUI A ETE POSTIONNEE

  public function getNumDocument($numDocument)
  {

    $dataRowExist = Positionnement::where("NumDocument", "=", $numDocument)->first();
    if ($dataRowExist) {
      $dataPostione = Positionnement::where("NumDocument", "=", $numDocument)->get();
      $numCompteMembre = $dataPostione[0]->RefCompte;
      //RECUPERE LES INFO DU MEMBRE RECHERCHE POUR LE CDF
      $dataCDF = Transactions::where('transactions.refCompteMembre', '=', $numCompteMembre)
        ->join('adhesion_membres', 'transactions.refCompteMembre', '=', 'adhesion_membres.refCompte')->where("CodeMonnaie", "=", "2")
        ->get();
      //RECUPERE LES INFO DU MEMBRE RECHERCHE POUR LE USD
      $dataUSD = Transactions::where('transactions.refCompteMembre', '=', $numCompteMembre)
        ->join('adhesion_membres', 'transactions.refCompteMembre', '=', 'adhesion_membres.refCompte')->where("CodeMonnaie", "=", "1")
        ->get();

      $NumeroCompteCDF = $dataCDF[0]->NumCompte;
      $NumeroCompteUSD = $dataUSD[0]->NumCompte;
      //RECUPERE LE SOLDE DU MEMBRE EN FC 
      $soldeMembreCDF = Transactions::select(
        DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeMembreCDF"),
      )->where("NumCompte", '=', $NumeroCompteCDF)
        ->groupBy("NumCompte")
        ->get();

      //RECUPERE LE SOLDE DU MEMBRE EN USD
      $soldeMembreUSD = Transactions::select(
        DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
      )->where("NumCompte", '=', $NumeroCompteUSD)
        ->groupBy("NumCompte")
        ->get();



      return response()->json([
        "success" => 1, 'data' => $dataUSD, "soldeMembreCDF" => $soldeMembreCDF, "soldeMembreUSD" => $soldeMembreUSD, "datapositionnement" => $dataPostione
      ]);
    } else {
      return response()->json([
        "success" => 0, 'msg' =>  "Numéro de dossier invalide"
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
        $getCompteMembreCDF = Transactions::where("refCompteMembre", "=", $request->refCompte)->Where("CodeMonnaie", "=", "2")->first();
        $compteCDF = $getCompteMembreCDF->NumCompte;

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



        //RECUPERE LA DERNIER ID DU L'OPERATION INSEREE
        $lastInsertedId = Transactions::latest()->first();
        //COMPLETE LE BILLETAGE

        BilletageCdf::create([
          "refOperation" => $lastInsertedId->RéfTransaction,
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
          "NumCompte" => $request->numCompte,
          "NumComptecp" => $CompteCaissierUSD,
          "Credit" => $request->montantDepot,
          "Operant" => $request->operant,
          "Credit$" => $request->montantDepot,
          "Creditfc" => $request->montantDepot *  $tauxDuJour,
          "NomUtilisateur" => Auth::user()->name,
          "Libelle" => $request->libelle,
        ]);

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
          "NumComptecp" => $request->numCompte,
          "Debit" => $request->montantDepot,
          "Operant" => $intituleCompteCaissierUSD,
          "Debit$" => $request->montantDepot,
          "Debitfc" => $request->montantDepot *  $tauxDuJour,
          "NomUtilisateur" => Auth::user()->name,
          "Libelle" => $request->libelle,
        ]);

        //RECUPERE LA DERNIER ID DU L'OPERATION INSEREE
        $lastInsertedId = Transactions::latest()->first();
        //COMPLETE LE BILLETAGE

        BilletageUsd::create([
          "refOperation" => $lastInsertedId->RéfTransaction,
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
          "NumComptecp" =>  $request->numCompte,
          "Debit" => $request->montantDepot,
          "Operant" => $request->operant,
          "Debit$" => $request->montantDepot,
          "Debitfc"  => $request->montantDepot * $tauxDuJour,
          "NomUtilisateur" => Auth::user()->name,
          "Libelle" => $request->libelle,
        ]);
      }
    }

    return response()->json(["success" => 1, "msg" => "Opération bien effectuée."]);
  }

  public function getBilletage()
  {
    $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
    // $billetageCDF = Transactions::where("NomUtilisateur","=",Auth::user()->name)
    // ->join('billetage_cdfs', "transactions.RéfTransaction","=","billetage_cdfs.refOperation")
    //  ->select('billetage_cdfs.*')
    //  ->get();

    //  $billetageCDF = BilletageCdf::where("NomUtilisateur","=",Auth::user()->name)->sum("milleFranc")->sum("cinqCentFranc");
    // ->join('billetage_cdfs', "transactions.RéfTransaction","=","billetage_cdfs.refOperation")
    //  ->select('billetage_cdfs.*')
    //  ->get();
    //  $sum = Model::where('status', 'paid')->sum('sum_field');
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
      ->paginate(12)->All();

    //RECUPERE 6 OPERATIONS RECENTES USD    
    $operationUSD = Transactions::where("NomUtilisateur", "=", Auth::user()->name)
      ->where("DateTransaction", "=", $date)->where("CodeMonnaie", "=", "1")
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
  public function depot()
  {

    return view("depot-espece");
  }
}
