<?php

namespace App\Http\Controllers;

use App\Models\BilletageCdf;
use App\Models\BilletageUsd;
use Illuminate\Http\Request;
use App\Models\TauxJournalier;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class DelestageController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }


    //RECUPERE LA SOMME DE BILLETAGE
    public function getAllBilletage()
    {
        $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;

        $billetageUSD = BilletageUsd::select(
            DB::raw("SUM(centDollars)-SUM(centDollarsSortie) as centDollars"),
            DB::raw("SUM(cinquanteDollars)-SUM(cinquanteDollarsSortie) as cinquanteDollars"),
            DB::raw("SUM(vightDollars)-SUM(vightDollarsSortie) as vightDollars"),
            DB::raw("SUM(dixDollars)-SUM(dixDollarsSortie) as dixDollars"),
            DB::raw("SUM(cinqDollars)-SUM(cinqDollarsSortie) as cinqDollars"),
            DB::raw("SUM(unDollars)-SUM(unDollarsSortie) as unDollars"),
        )->where("NomUtilisateur", "=", Auth::user()->name)->where("DateTransaction", "=", $date)
            ->groupBy("NomUtilisateur")
            ->first();


        //RECUPERE LE BILLETAGE EN FRANC CONGOLAIS
        $billetageCDF = BilletageCdf::select(
            DB::raw("SUM(vightMilleFranc)-SUM(vightMilleFrancSortie) as vightMilleFranc"),
            DB::raw("SUM(dixMilleFranc)-SUM(dixMilleFrancSortie) as dixMilleFranc"),
            DB::raw("SUM(cinqMilleFranc)-SUM(cinqMilleFrancSortie) as cinqMilleFranc"),
            DB::raw("SUM(milleFranc)-SUM(milleFrancSortie) as milleFranc"),
            DB::raw("SUM(cinqCentFranc)-SUM(cinqCentFrancSortie) as cinqCentFranc"),
            DB::raw("SUM(deuxCentFranc)-SUM(deuxCentFrancSortie) as deuxCentFranc"),
            DB::raw("SUM(centFranc)-SUM(centFrancSortie) as centFranc"),
            DB::raw("SUM(cinquanteFanc)-SUM(cinquanteFancSortie) as cinquanteFanc"),
        )->where("NomUtilisateur", "=", Auth::user()->name)->where("DateTransaction", "=", $date)
            ->groupBy("NomUtilisateur")
            ->first();

        return response()->json(["dataCDF" => $billetageCDF, "dataUSD" => $billetageUSD]);
    }
    //GET MAIN PAGE

    public function getDelestagePage()
    {
        return view('delestage');
    }
}
