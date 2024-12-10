<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RemboursementEntendu extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    //AFFICHE LA PAGE DE REMBOURSEMENT ATTENDU



    // public function getRembousementAttenduPage()
    // {
    //     return view('remboursement-attendu');
    // }
}
