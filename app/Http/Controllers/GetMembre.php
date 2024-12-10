<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AdhesionMembre;

class GetMembre extends Controller
{
  public function getrow($id)
  {

    $data = AdhesionMembre::where('compteAbrege', '=', $id)->first();
    //    dd(DB::getQueryLog());
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
}
