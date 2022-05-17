<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use App\Models\Comptes;
use App\Models\BilletageCdf;
use App\Models\BilletageUsd;
use Illuminate\Http\Request;
use App\Models\BilletageAppro_cdf;
use App\Models\BilletageAppro_usd;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class ApproController extends Controller
{

  //VERIFIE SI LA PERSONNE EST CONNECTEE
  public function __construct()
  {
    $this->middleware("auth");
  }

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

    $IdCaissier = Comptes::where("NumCompte", "=", $request->caissier)->first()->NumAdherant;
    //RECUPERE SUR LA TABLE USERS LE NOM QUI CORRESPOND A CE ID


    $nomCaissier = User::where("id", "=", $IdCaissier)->first()->name;
    if ($request->devise == "CDF") {


      BilletageAppro_cdf::create([

        "NumCompteCaissier" => $request->caissier,
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
        "DateTransaction" => $request->DateTransaction,
        "montant" => $request->montant
      ]);
    } else if ($request->devise == "USD") {
      BilletageAppro_usd::create([
        "NumCompteCaissier" => $request->caissier,
        "centDollars" => $request->hundred,
        "cinquanteDollars" => $request->fitfty,
        "vightDollars" => $request->twenty,
        "dixDollars" => $request->ten,
        "cinqDollars" => $request->five,
        "unDollars" => $request->oneDollar,
        "NomUtilisateur" => Auth::user()->name,
        "NomDemandeur" => $nomCaissier,
        "DateTransaction" => $request->DateTransaction,
        "montant" => $request->montant
      ]);
    }

    //FUNCTION TO FETCH DAYLY APPRO



    return response()->json(["success" => 1, "msg" => "Appro bien effectué"]);
  }

  public function getDaylyAppro()
  {
    $todayDate = date('Y-m-d');
    //RECUPERE TOUTES LES APPRO JOURNALIERES CDF
    $data = BilletageAppro_cdf::where("DateTransaction", "=", $todayDate)->get();

    //RECUPERE TOUTES LES APPRO JOURNALIERES USD

    $dataUSD = BilletageAppro_usd::where("DateTransaction", "=", $todayDate)->get();

    return response()->json(['data' => $data, 'data2' => $dataUSD]);
  }

  //RECUPERE LES APPRO JOURNALIERE LIEES A UN UTILISATEUR SPECIFIQUE
  public function getDaylyApproUser()
  {
    $todayDate = date('Y-m-d');
    //RECUPERE TOUTES LES APPRO JOURNALIERES CDF 
    $data = BilletageAppro_cdf::where("DateTransaction", "=", $todayDate)->where("NomDemandeur", "=", Auth::user()->name)->where("received", "=", 0)->orderBy('id', 'desc')->first();

    //RECUPERE TOUTES LES APPRO JOURNALIERES USD

    $dataUSD = BilletageAppro_usd::where("DateTransaction", "=", $todayDate)->where("NomDemandeur", "=", Auth::user()->name)->where("received", "=", 0)->orderBy('id', 'desc')->first();

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
      "NomUtilisateur" => $billetageCDF->NomDemandeur,
      "DateTransaction" => $billetageCDF->DateTransaction,
    ]);

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
      "NomUtilisateur" => $billetageUSD->NomDemandeur,
      "DateTransaction" => $billetageUSD->DateTransaction
    ]);

    return response()->json(["success" => 1, "msg" => "Validation réussie."]);
  }

  public function getApproPage()
  {
    return view('appro');
  }
}
