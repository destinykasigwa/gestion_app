<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RemboursementCredit extends Controller
{
    public function __construct()
    {
        $this->middleware("auth");
    }

    public function getRemboursementCreditPage()
    {
        return view('remboursement-credit');
    }
}
