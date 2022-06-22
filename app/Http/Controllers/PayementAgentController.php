<?php

namespace App\Http\Controllers;

use App\Models\Agents;
use Illuminate\Http\Request;

class PayementAgentController extends Controller
{
    public function __construct()
    {
        $this->middleware("auth");
    }

    //GET AGENT
    public function getAgent()
    {
        $data = Agents::where("Actif", "=", 1)->get();
        return response()->json(["success" => 1, "data" => $data]);
    }

    //PERMET DE PAYER LES AGENS

    public function savePayementAgent(Request $request)
    {
        return response()->json(["data" => $request->all()]);
    }

    public function getPayementAgentPage()
    {
        return view('payement-agent');
    }
}
