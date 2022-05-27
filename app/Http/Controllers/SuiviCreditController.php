<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SuiviCreditController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }

    public function getSuiviCreditPage()
    {
        return view('suivicredit');
    }
}
