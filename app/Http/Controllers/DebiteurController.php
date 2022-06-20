<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DebiteurController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function getDebiteurPage()
    {
        return view("debiteur");
    }
}
