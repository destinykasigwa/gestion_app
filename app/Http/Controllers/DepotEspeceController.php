<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DepotEspeceController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

//function to store data in to data base when makeking deposit

public function depotEspece(Request $request){


// return response()->json(["success"=>1,"msg"=>"great....."]);

}


public function depot(){
 
    return view("depot-espece");
}
}
