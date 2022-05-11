<?php

namespace App\Http\Controllers;

use App\Models\BilletageCdf;
use App\Models\Transactions;
use Illuminate\Http\Request;
use App\Models\AdhesionMembre;
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
 
public function getAccount($id){
    $data = AdhesionMembre::where('numCompte', 'like', '%' . $id . '%')->first();
    if ($data) {

      return response()->json([
        "success" => 1, 'data' =>  $data
      ]);
    } else {

      return response()->json([
        "success" => 0, 'msg' =>  "Ce compte ne semble pas existé"
      ]);
    }
}



    //function to store data in to data base when makeking deposit
 
    public function depotEspece(Request $request)
    {
    
        $validator = validator::make($request->all(), [
            'devise' => 'required',
            'libelle' => 'required|max:50',
            'montantDepot' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validate_error' => $validator->errors()
            ]);
        }else{
            CompteurTransaction::create([
                'fakevalue' => "0000",
              ]);
              $numOperation = [];
              $numOperation = CompteurTransaction::latest()->first();
              $NumTransaction= Auth::user()->name[0]. Auth::user()->name[1]."D00".$numOperation->id;
        $numCompteContrePartie="5700003032202";
        $numCompteContrePartieUSD="5700003032201";
           if($request->devise=="CDF"){
                //RECUPERE LE NUMERO DE COMPTE CDF DU MEMBRE CONCERNE
                $getCompteMembreCDF=Transactions::where("refCompteMembre","=",$request->refCompte,"and","CodeMonnaie","=","2")->first();
                $compteCDF=$getCompteMembreCDF->NumCompte;

                //CREDIT LE COMPTE DU MEMBRE SI C UNE OPERATION EN CDF
            Transactions::create([
                "NumTransaction" => $NumTransaction,
                "DateTransaction" => $request->DateTransaction,
                "DateSaisie" => $request->DateTransaction,
                "Taux" => 1,
                "TypeTransaction" => "C",
                "CodeMonnaie" => 2,
                "CodeAgence" => "20",
                "NumDossier" => "DOS00" . $numOperation->id,
                "NumDemande" => "V00" . $numOperation->id,
                "NumCompte" => $compteCDF,
                "NumComptecp" => $numCompteContrePartie,
                "Creditfc" => $request->montantDepot,
                "NomUtilisateur" => Auth::user()->name,   
                "Libelle"=>$request->libelle,
              ]);
              //RECUPERE LA DERNIER ID DU L'OPERATION INSEREE
              $lastInsertedId = Transactions::latest()->first();
              //COMPLETE LE BILLETAGE
              
              BilletageCdf::create([
               "refOperation"=>$lastInsertedId->RéfTransaction,
              "vightMilleFranc"=>$lastInsertedId->vightMille,
              "dixMilleFranc"=>$lastInsertedId->dixMille,
              "cinqMilleFranc"=>$lastInsertedId->cinqMille,
              "milleFranc"=>$lastInsertedId->milleFranc,
              "cinqCentFranc"=>$lastInsertedId->cinqCentFr,
              "deuxCentFranc"=>$lastInsertedId->deuxCentFranc,
              "centFranc"=>$lastInsertedId->centFranc,
              "cinquanteFanc"=>$lastInsertedId->cinquanteFanc,
              ]);
              //CREDITE LE COMPTE CONTRE PARTIE  
              Transactions::create([
                "NumTransaction" => $NumTransaction,
                "DateTransaction" => $request->DateTransaction,
                "DateSaisie" => $request->DateTransaction,
                "Taux" => 1,
                "TypeTransaction" => "C",
                "CodeMonnaie" => 2,
                "CodeAgence" => "20",
                "NumDossier" => "DOS00" . $numOperation->id,
                "NumDemande" => "V00" . $numOperation->id,
                "NumCompte" => $numCompteContrePartie,
                "NumComptecp" =>$compteCDF,
                "Creditfc" => $request->montantDepot,
                "NomUtilisateur" => Auth::user()->name,   
                "Libelle"=>$request->libelle,
              ]);


           }else if($request->devise=="USD"){
             //CREDIT LE COMPTE DU MEMBRE SI C UNE OPERATION EN USD
             Transactions::create([
                "NumTransaction" => $NumTransaction,
                "DateTransaction" => $request->DateTransaction,
                "DateSaisie" => $request->DateTransaction,
                "Taux" => 1,
                "TypeTransaction" => "C",
                "CodeMonnaie" => 1,
                "CodeAgence" => "20",
                "NumDossier" => "DOS00" . $numOperation->id,
                "NumDemande" => "V00" . $numOperation->id,
                "NumCompte" => $request->numcompte,
                "NumComptecp" => $numCompteContrePartieUSD,
                "Credit" => $request->montantDepot,
                "Credit$" => $request->montantDepot,
                "Creditcdf" => $request->montantDepot * $request->taux,
                "NomUtilisateur" => Auth::user()->name,   
                "Libelle"=>$request->libelle,
              ]);
              //RECUPERE LA DERNIER ID DU L'OPERATION INSEREE
              $lastInsertedId = Transactions::latest()->first();
              //COMPLETE LE BILLETAGE
              
              BilletageCdf::create([
               "refOperation"=>$lastInsertedId->RéfTransaction,
              "centDollars"=>$lastInsertedId->hundred,
              "cinquanteDollars"=>$lastInsertedId->fitfty,
              "vightDollars"=>$lastInsertedId->twenty,
              "dixDollars"=>$lastInsertedId->ten,
              "cinqDollars"=>$lastInsertedId->five,
              "unDollars"=>$lastInsertedId->oneDollar,
              ]);
              //CREDITE LE COMPTE CONTRE PARTIE  
              Transactions::create([
                "NumTransaction" => $NumTransaction,
                "DateTransaction" => $request->DateTransaction,
                "DateSaisie" => $request->DateTransaction,
                "Taux" => 1,
                "TypeTransaction" => "C",
                "CodeMonnaie" => 2,
                "CodeAgence" => "20",
                "NumDossier" => "DOS00" . $numOperation->id,
                "NumDemande" => "V00" . $numOperation->id,
                "NumCompte" => $numCompteContrePartieUSD,
                "NumComptecp" =>  $request->numcompte,
                "Credit" => $request->montantDepot,
                "Credit$" => $request->montantDepot,
                "Creditfc"  => $request->montantDepot * $request->taux,
                "NomUtilisateur" => Auth::user()->name,   
                "Libelle"=>$request->libelle,
              ]);


           }
        }

        return response()->json(["success"=>1,"msg"=>"Opération bien effectuée."]);

    }


    public function depot()
    {

        return view("depot-espece");
    }
}
