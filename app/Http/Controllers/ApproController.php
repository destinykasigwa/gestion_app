<?php

namespace App\Http\Controllers;

use App\Models\BilletageAppro_cdf;
use App\Models\BilletageAppro_usd;
use App\Models\Comptes;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApproController extends Controller
{

//VERIFIE SI LA PERSONNE EST CONNECTEE
public function __construct()
{
$this->middleware("auth");
}

//RECUPERE TOUS LES CAISSIERS

public function getAllCaissier(){
$dataCaissier=Comptes::where("isCaissier","=",1)->get();

return response()->json(["data"=>$dataCaissier]);
}


//SAVE NEW APPRO CAISSIER

public function saveNewApproCaissier(Request $request){
  //POUR RECUPERE LE NOM UTILISATEUR DU CAISSIER CONCERNE
  
  $IdCaissier=Comptes::where("NumCompte","=",$request->caissier)->first()->NumAdherant;
  //RECUPERE SUR LA TABLE USERS LE NOM QUI CORRESPOND A CE ID

  
  $nomCaissier=User::where("id","=",$IdCaissier)->first()->name;
    if($request->devise=="CDF"){
   

      BilletageAppro_cdf::create([

        "NumCompteCaissier"=>$request->caissier,
        "vightMilleFranc"=>$request->vightMille,     
        "dixMilleFranc" =>$request->dixMille,
        "cinqMilleFranc"=>$request->cinqMille,
        "milleFranc"=>$request->milleFranc,
        "cinqCentFranc"=>$request->cinqCentFr,
        "deuxCentFranc"=>$request->deuxCentFranc,
        "centFranc"=>$request->centFranc,
        "cinquanteFanc"=>$request->cinquanteFanc,
        "NomUtilisateur"=>Auth::user()->name,
        "NomDemandeur"=>$nomCaissier,
        "DateTransaction"=>$request->DateTransaction
      ]);
      
    


    }else if($request->devise=="USD"){
      BilletageAppro_usd::create([
      "NumCompteCaissier"=>$request->caissier,
      "centDollars" =>$request->hundred,
      "cinquanteDollars"=>$request->fitfty,
      "vightDollars" =>$request->twenty,
      "dixDollars" =>$request->ten,
      "cinqDollars"=>$request->five,
      "unDollars" =>$request->oneDollar,
      "NomUtilisateur"=>Auth::user()->name,
      "NomDemandeur"=>$nomCaissier,
      "DateTransaction"=>$request->DateTransaction,
    ]);
  }

  return response()->json(["success"=>1,"msg"=>"Appro bien effectué"]);
}
    //FUNCTION TO GET APPRO MAIN  PAGE
    
    public function getApproPage(){
    return view('appro');
    }
}
