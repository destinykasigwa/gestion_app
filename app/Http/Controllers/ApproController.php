<?php

namespace App\Http\Controllers;

use App\Models\Comptes;
use Illuminate\Http\Request;

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


    //FUNCTION TO GET APPRO MAIN  PAGE
    
    public function getApproPage(){
    return view('appro');
    }
}
