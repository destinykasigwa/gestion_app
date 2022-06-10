<?php

namespace App\Http\Controllers;

use App\Models\Echeancier;
use App\Models\Portefeuille;
use App\Models\Transactions;
use Illuminate\Http\Request;
use App\Models\TauxJournalier;
use Illuminate\Support\Facades\DB;
use App\Models\CompteurTransaction;
use App\Models\Remboursementcredit;
use Illuminate\Support\Facades\Auth;

class PostageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    //PERMET DE CLOTURER LA JOURNEE EN COURS

    public function clotureJournee()
    {
    }
}
