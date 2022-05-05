<?php

namespace App\Http\Controllers;

use App\Models\AdhesionMembre;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class updateMembre extends Controller
{
   function updatingmembre(Request $request){
    try {
     
      $idMembre=$request->get('idMembre');
      $intituleCompte=$request->get('intituleCompte');
      $lieuNaiss=$request->get('lieuNaiss');
      $dateNaiss=$request->get('dateNaiss');
      $etatCivile=$request->get('etatCivile');
      $conjoitName=$request->get('conjoitName');
      $fatherName=$request->get('fatherName');
      $motherName=$request->get('motherName');
      $profession=$request->get('profession');
      $workingPlace=$request->get('workingPlace');
      $workingPlace=$request->get('workingPlace');
      $cilivilty=$request->get('cilivilty');
      $sexe=$request->get('sexe');
      $phone1=$request->get('phone1');
      $phone2=$request->get('phone2');
      $email=$request->get('email');
      $typepiece=$request->get('typepiece');
      $numpiece=$request->get('numpiece');
      $delivrancePlace=$request->get('delivrancePlace');
      $delivranceDate=$request->get('delivranceDate');
      $gestionnaire=$request->get('gestionnaire');
      $provinceOrigine=$request->get('provinceOrigine');
      $territoireOrigine=$request->get('territoireOrigine');
      $collectiviteOrigine=$request->get('collectiviteOrigine');
      $provinceActuelle=$request->get('provinceActuelle');
      $villeActuelle=$request->get('villeActuelle');
      $CommuneActuelle=$request->get('CommuneActuelle');
      $QuartierActuelle=$request->get('QuartierActuelle');
      $parainAccount=$request->get('parainAccount');
      $parainName=$request->get('parainName');
      $typeGestion=$request->get('typeGestion');
      $critere1=$request->get('critere1');
      $otherMention=$request->get('otherMention');

      AdhesionMembre::where('refCompte',$idMembre)->update([
         "intituleCompte"=>$intituleCompte,
         "lieuNaiss"=>$lieuNaiss,
         "dateNaiss"=>$dateNaiss,
         "etatCivile"=>$etatCivile,
         "conjoitName"=>$conjoitName,
         "fatherName"=>$fatherName,
         "motherName"=>$motherName,
         "profession"=>$profession,
         "workingPlace"=>$workingPlace,
         "cilivilty"=>$cilivilty,
         "sexe"=>$sexe,
         "phone1"=>$phone1,
         "phone2"=>$phone2,
         "email"=>$email,
         "typepiece"=>$typepiece,
         "numpiece"=>$numpiece,
         "delivrancePlace"=>$delivrancePlace,
         "delivranceDate"=>$delivranceDate,
         "gestionnaire"=>$gestionnaire,
         "provinceOrigine"=>$provinceOrigine,
         "territoireOrigine"=>$territoireOrigine,
         "collectiviteOrigine"=>$collectiviteOrigine,
         "provinceActuelle"=>$provinceActuelle,
         "villeActuelle"=>$villeActuelle,
         "CommuneActuelle"=>$CommuneActuelle,
         "QuartierActuelle"=>$QuartierActuelle,
         "parainAccount"=>$parainAccount,
         "parainName"=>$parainName,
         "typeGestion"=>$typeGestion,
         "critere1"=>$critere1,
         "otherMention"=>$otherMention,
     ]);
      
     return response()->json(["success"=>1, "msg" => "Le membre a bien été mise à jour !"]);
    }
   catch(Exception $e) 
   {
      Log::error($e);
   }

    

      
   }
}
