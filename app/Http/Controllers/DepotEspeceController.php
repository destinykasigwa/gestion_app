<?php

namespace App\Http\Controllers;

use App\Models\BilletageCdf;
use App\Models\BilletageUsd;
use App\Models\Transactions;
use Illuminate\Http\Request;
use App\Models\AdhesionMembre;
use App\Models\Comptes;
use Illuminate\Support\Facades\DB;
use App\Models\CompteurTransaction;
use App\Models\Dummy;
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
  //RECUPERE LES INFO DU MEMBRE RECHERCHE
    $data = AdhesionMembre::where('numCompte', 'like', '%' . $id . '%')->first();

    //RECUPERE LE SOLDE DU MEMBRE EN FC EN CDF
    $soldeMembre= Transactions::select(
      DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
      DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeMembreCDF"),
    )->where("NumCompte",'like', '%' . $id . '%')
    ->groupBy("NumCompte")
    ->get();   


    if ($data) {

      return response()->json([
        "success" => 1, 'data' =>  $data
      ,"soldeMembre"=>$soldeMembre]);
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
              
              //RECUPERE LE COMPTE DU CAISSIER CONCERNE USD 
              $numCompteCaissierUSD=Comptes::where("NumAdherant","=",Auth::user()->id)->where("CodeMonnaie","=","1")->first();
              $CompteCaissierUSD=$numCompteCaissierUSD->NumCompte;

              //RECUPERE LE COMPTE DU CAISSIER CONCERNE CDF
              $numCompteCaissierCDF=Comptes::where("NumAdherant","=",Auth::user()->id)->where("CodeMonnaie","=","2")->first();
              $CompteCaissierCDF=$numCompteCaissierCDF->NumCompte;

            //  $numCompteContrePartie="5700003032202";
            //  $numCompteContrePartieUSD="5700003032201";
           if($request->devise=="CDF"){
                //RECUPERE LE NUMERO DE COMPTE CDF DU MEMBRE CONCERNE
                $getCompteMembreCDF=Transactions::where("refCompteMembre","=",$request->refCompte)->Where("CodeMonnaie","=","2")->first();
                $compteCDF=$getCompteMembreCDF->NumCompte;
    
                //CREDITE LE COMPTE DU MEMBRE SI C UNE OPERATION EN CDF
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
                "NumComptecp" => $CompteCaissierCDF,
                "Operant"=>$request->operant,
                "Creditfc" => $request->montantDepot,
                "NomUtilisateur" => Auth::user()->name,   
                "Libelle"=>$request->libelle,
              ]);
              //RECUPERE LA DERNIER ID DU L'OPERATION INSEREE
              $lastInsertedId = Transactions::latest()->first();
              //COMPLETE LE BILLETAGE
              
              BilletageCdf::create([
               "refOperation"=>$lastInsertedId->RéfTransaction,
              "vightMilleFranc"=>$request->vightMille,
              "dixMilleFranc"=>$request->dixMille,
              "cinqMilleFranc"=>$request->cinqMille,
              "milleFranc"=>$request->milleFranc,
              "cinqCentFranc"=>$request->cinqCentFr,
              "deuxCentFranc"=>$request->deuxCentFranc,
              "centFranc"=>$request->centFranc,
              "cinquanteFanc"=>$request->cinquanteFanc,
              "NomUtilisateur"=> Auth::user()->name, 
              "DateTransaction"=>$request->DateTransaction
              ]);
              //CREDITE LE COMPTE CONTRE PARTIE  
              Dummy::create([
                "NumTransaction" => $NumTransaction,
                "DateTransaction" => $request->DateTransaction,
                "DateSaisie" => $request->DateTransaction,
                "Taux" => 1,
                "TypeTransaction" => "C",
                "CodeMonnaie" => 2,
                "CodeAgence" => "20",
                "NumDossier" => "DOS00" . $numOperation->id,
                "NumDemande" => "V00" . $numOperation->id,
                "NumCompte" => $CompteCaissierCDF,
                "NumComptecp" =>$compteCDF,
                "Operant"=>$request->operant,
                "Debitfc" => $request->montantDepot,
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
                "NumCompte" => $request->numCompte,
                "NumComptecp" => $CompteCaissierUSD,
                "Credit" => $request->montantDepot,
                "Operant"=>$request->operant,
                "Credit$" => $request->montantDepot,
                "Creditcdf" => $request->montantDepot * $request->taux,
                "NomUtilisateur" => Auth::user()->name,   
                "Libelle"=>$request->libelle,
              ]);
              //RECUPERE LA DERNIER ID DU L'OPERATION INSEREE
              $lastInsertedId = Transactions::latest()->first();
              //COMPLETE LE BILLETAGE
              
              BilletageUsd::create([
               "refOperation"=>$lastInsertedId->RéfTransaction,
              "centDollars"=>$request->hundred,
              "cinquanteDollars"=>$request->fitfty,
              "vightDollars"=>$request->twenty,
              "dixDollars"=>$request->ten,
              "cinqDollars"=>$request->five,
              "unDollars"=>$request->oneDollar,
              "NomUtilisateur"=> Auth::user()->name,
              "DateTransaction"=>$request->DateTransaction
              ]);
              //CREDITE LE COMPTE CONTRE PARTIE  
              Dummy::create([
                "NumTransaction" => $NumTransaction,
                "DateTransaction" => $request->DateTransaction,
                "DateSaisie" => $request->DateTransaction,
                "Taux" => 1,
                "TypeTransaction" => "C",
                "CodeMonnaie" => 2,
                "CodeAgence" => "20",
                "NumDossier" => "DOS00" . $numOperation->id,
                "NumDemande" => "V00" . $numOperation->id,
                "NumCompte" => $CompteCaissierUSD,
                "NumComptecp" =>  $request->numCompte,
                "Debit" => $request->montantDepot,
                "Operant"=>$request->operant,
                "Debit$" => $request->montantDepot,
                "Debitfc"  => $request->montantDepot * $request->taux,
                "NomUtilisateur" => Auth::user()->name,   
                "Libelle"=>$request->libelle,
              ]);


           }
        }

        return response()->json(["success"=>1,"msg"=>"Opération bien effectuée."]);

    }

    public function getBilletage(){
   
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
$date=date("Y-m-d");
$billetageCDF = BilletageCdf::select(
        DB::raw("SUM(vightMilleFranc) as vightMilleFran"),
        DB::raw("SUM(dixMilleFranc) as dixMilleFran"),
        DB::raw("SUM(cinqMilleFranc) as cinqMilleFran"),
        DB::raw("SUM(milleFranc) as milleFran"),
        DB::raw("SUM(cinqCentFranc) as cinqCentFran"),
        DB::raw("SUM(deuxCentFranc) as deuxCentFran"),
        DB::raw("SUM(centFranc) as centFran"),
        DB::raw("SUM(cinquanteFanc) as cinquanteFan"),
    )->where("NomUtilisateur","=",Auth::user()->name)->where("DateTransaction","=",$date)
->groupBy("NomUtilisateur")
->get();
   
//RECUPERE LE BILLETAGE EN USD

$billetageUSD = BilletageUsd::select(
    DB::raw("SUM(centDollars) as centDollar"),
    DB::raw("SUM(cinquanteDollars) as cinquanteDollar"),
    DB::raw("SUM(vightDollars) as vightDollar"),
    DB::raw("SUM(dixDollars) as dixDollar"),
    DB::raw("SUM(cinqDollars) as cinqDollar"),
    DB::raw("SUM(unDollars) as unDollar"),
)->where("NomUtilisateur","=",Auth::user()->name)->where("DateTransaction","=",$date)
->groupBy("NomUtilisateur")
->get();

//RECUPERE 8 OPERATIONS RECENTES CDF


$operationCDF = Transactions::where("NomUtilisateur","=",Auth::user()->name)->where("DateTransaction","=",$date)->where("CodeMonnaie","=","2")
            ->paginate(8)->All();

   //RECUPERE 6 OPERATIONS RECENTES USD    
$operationUSD = Transactions::where("NomUtilisateur","=",Auth::user()->name)->where("DateTransaction","=",$date)->where("CodeMonnaie","=","1")
           ->paginate(6)->All();

$soldeOperationCDF= Transactions::select(
  DB::raw("SUM(Debitfc) as sommeDeDebitCDF"),
  DB::raw("SUM(Creditfc) as sommeDeCreditCDF"),
)->where("NomUtilisateur","=",Auth::user()->name)->where("DateTransaction","=",$date)
->groupBy("NomUtilisateur")
->get(); 

$soldeOperationUSD= Transactions::select(
  DB::raw("SUM(Debit$) as sommeDeDebitUSD"),
  DB::raw("SUM(Credit$) as sommeDeCreditUSD"),
)->where("NomUtilisateur","=",Auth::user()->name)->where("DateTransaction","=",$date)
->groupBy("NomUtilisateur")
->get();        

    return response()->json(["data"=>$billetageCDF,"data2"=>$billetageUSD,"data3"=>$operationCDF,"data4"=>$operationUSD,"data5"=>$soldeOperationCDF,"data6"=>$soldeOperationUSD]);
    }
    public function depot()
    {

        return view("depot-espece");
    }
}
