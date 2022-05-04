<?php

namespace App\Http\Controllers;

use App\Models\AdhesionMembre;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class updateMembre extends Controller
{
   function update(Request $request){
    try {
     
      
       return response()->json(["success" => 1, "num" =>  $request->All()]);
    }
   catch(Exception $e) 
   {
      Log::error($e);
   }

    // $request->getContent()
   //  $data=[];
   //  $data=$request->All().$request->toArray();
   //  $result=AdhesionMembre::findOrFail($request->get('numCompte'));
     
   //  $membre = AdhesionMembre::where('numCompte', '=', $data->numCompte)->first();
   //  $membre->numCompte = $data->numCompte;
   //  $membre->codeAgence = $data->codeAgence;
   //  $membre->codeMonaie = $data->codeMonaie;
   //  $membre->intituleCompte = $data->intituleCompte;
   //  $membre->produitEpargne = $data->produitEpargne;
   //  $membre->typeClient = $data->typeClient;
   //  $membre->guichetAdresse = $data->guichetAdresse;
   //  $membre->dateOuverture = $data->dateOuverture;
   //  $membre->lieuNaiss = $data->lieuNaiss;
   //  $membre->etatCivile = $data->etatCivile;
   //  $membre->conjoitName = $data->conjoitName;
   //  $membre->fatherName = $data->fatherName;
   //  $membre->motherName = $data->motherName;
   //  $membre->profession = $data->profession;
   //  $membre->workingPlace = $data->workingPlace;
   //  $membre->cilivilty = $data->cilivilty;
   //  $membre->sexe = $data->sexe;
   //  $membre->phone1 = $data->phone1;
   //  $membre->phone2 = $data->phone2;
   //  $membre->email = $data->email;
   //  $membre->typepiece = $data->typepiece;
   //  $membre->numpiece = $data->numpiece;
   //  $membre->delivrancePlace = $data->delivrancePlace;
   //  $membre->delivranceDate = $data->delivranceDate;
   //  $membre->gestionnaire = $data->gestionnaire;
   //  $membre->provinceOrigine = $data->provinceOrigine;
   //  $membre->territoireOrigine = $data->territoireOrigine;
   //  $membre->collectiviteOrigine = $data->collectiviteOrigine;
   //  $membre->provinceActuelle = $data->provinceActuelle;
   //  $membre->villeActuelle = $data->villeActuelle;
   //  $membre->CommuneActuelle = $data->CommuneActuelle;
   //  $membre->QuartierActuelle = $data->QuartierActuelle;
   //  $membre->parainAccount = $data->parainAccount;
   //  $membre->parainName = $data->parainName;
   //  $membre->typeGestion = $data->typeGestion;
   //  $membre->critere1 = $data->critere1;
   //  $membre->activationCompte = $data->activationCompte;
   //  $membre->save();

   //  $data=$request->all()
       

      
   }
}
