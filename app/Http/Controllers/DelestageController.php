<?php

namespace App\Http\Controllers;

use App\Models\Comptes;
use App\Models\Delestage;
use App\Models\BilletageCdf;
use App\Models\BilletageUsd;
use Illuminate\Http\Request;
use App\Models\ChangeMonnaie;
use App\Models\TauxJournalier;
use Illuminate\Support\Facades\DB;
use App\Models\CompteurTransaction;
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
            DB::raw("SUM(montantEntre)-SUM(montantSortie) as sommeMontantUSD"),
        )->where("NomUtilisateur", "=", Auth::user()->name)->where("DateTransaction", "=", $date)
            ->where("delested", "=", 0)
            ->groupBy("NomUtilisateur")
            ->get();

        $getCommissionUSD = BilletageUsd::select(
            DB::raw("SUM(montantEntre)-SUM(montantSortie) as sommeCommissionUSD"),
        )->where("NomUtilisateur", "=", Auth::user()->name)->where("DateTransaction", "=", $date)
            ->where("delested", "=", 0)
            ->where("is_commision", "=", 1)
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
            DB::raw("SUM(montantEntre)-SUM(montantSortie) as sommeMontantCDF"),
        )->where("NomUtilisateur", "=", Auth::user()->name)->where("DateTransaction", "=", $date)
            ->where("delested", "=", 0)
            ->groupBy("NomUtilisateur")
            ->get();
        //RECUPERE LA COMMISSION PRISE

        $getCommissionCDF = BilletageCdf::select(
            DB::raw("SUM(montantEntre)-SUM(montantSortie) as sommeCommissionCDF"),
        )->where("NomUtilisateur", "=", Auth::user()->name)->where("DateTransaction", "=", $date)
            ->where("delested", "=", 0)
            ->where("is_commision", "=", 1)
            ->groupBy("NomUtilisateur")
            ->first();


        return response()->json([
            "dataCDF" => $billetageCDF,
            "dataUSD" => $billetageUSD,
            "sommeCommissionCDF" => $getCommissionCDF,
            "sommeCommissionUSD" => $getCommissionUSD
        ]);
    }

    //RECUPERE LES BILLETAGE SI L'UTILISATEUR A FAITE L'ECHANCE DE MONNAIE

    public function getNewBilletage()
    {
        $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;

        $NewbilletageCDF = ChangeMonnaie::where("NomUtilisateur", "=", Auth::user()->name)->where("DateTransaction", "=", $date)->where("received", "=", 0)->where("CodeMonnaie", "=", 2)
            ->first();

        $NewbilletageUSD = ChangeMonnaie::where("NomUtilisateur", "=", Auth::user()->name)->where("DateTransaction", "=", $date)->where("received", "=", 0)->where("CodeMonnaie", "=", 1)
            ->first();

        return response()->json(["dataCDF" => $NewbilletageCDF, "dataUSD" => $NewbilletageUSD]);
    }


    //MET A JOUR LES BILLETAGE POUR CDF

    public function upDateBilletageCDF(Request $request)
    {



        //RECUPERE LA DATE DU SYSTEME
        $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;

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
            DB::raw("SUM(montantEntre)-SUM(montantSortie) as sommeMontantCDF"),
        )->where("NomUtilisateur", "=", Auth::user()->name)->where("DateTransaction", "=", $date)
            ->groupBy("NomUtilisateur")
            ->first();

        //RECUPERE LE COMPTE DU CAISSIER CONCERNE CDF
        $numCompteCaissierCDF = Comptes::where("caissierId", "=", Auth::user()->id)->where("CodeMonnaie", "=", "2")->first();
        $CompteCaissierCDF = $numCompteCaissierCDF->NumCompte;

        ChangeMonnaie::create([
            "NumCompteCaissier" => $CompteCaissierCDF,
            "vightMilleFranc" => $request->vightMille,
            "dixMilleFranc" => $request->dixMille,
            "cinqMilleFranc" => $request->cinqMille,
            "milleFranc" => $request->milleFranc,
            "cinqCentFranc" => $request->cinqCentFr,
            "deuxCentFranc" => $request->deuxCentFranc,
            "centFranc" => $request->centFranc,
            "cinquanteFanc" => $request->cinquanteFanc,
            "montantCDF" => $billetageCDF->sommeMontantCDF,
            "NomUtilisateur" => Auth::user()->name,
            "DateTransaction" => $date,
            "CodeMonnaie" => 2,
        ]);


        return response()->json(["success" => 1, "msg" => "Opération bien enregistrée"]);
    }

    //MET A JOUR LES BILLETAGE POUR USD

    public function upDateBilletageUSD(Request $request)

    {
        //RECUPERE LA DATE DU SYSTEME
        $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;

        //RECUPERE LE BILLETAGE EN DOLLARS
        $billetageUSD = BilletageUsd::select(
            DB::raw("SUM(centDollars)-SUM(centDollarsSortie) as centDollars"),
            DB::raw("SUM(cinquanteDollars)-SUM(cinquanteDollarsSortie) as cinquanteDollars"),
            DB::raw("SUM(vightDollars)-SUM(vightDollarsSortie) as vightDollars"),
            DB::raw("SUM(dixDollars)-SUM(dixDollarsSortie) as dixDollars"),
            DB::raw("SUM(cinqDollars)-SUM(cinqDollarsSortie) as cinqDollars"),
            DB::raw("SUM(unDollars)-SUM(unDollarsSortie) as unDollars"),
            DB::raw("SUM(montantEntre)-SUM(montantSortie) as sommeMontantUSD"),
        )->where("NomUtilisateur", "=", Auth::user()->name)->where("DateTransaction", "=", $date)
            ->groupBy("NomUtilisateur")
            ->first();

        //RECUPERE LE COMPTE DU CAISSIER CONCERNE USD 
        $numCompteCaissierUSD = Comptes::where("caissierId", "=", Auth::user()->id)->where("CodeMonnaie", "=", "1")->first();
        $CompteCaissierUSD = $numCompteCaissierUSD->NumCompte;

        ChangeMonnaie::create([
            "NumCompteCaissier" => $CompteCaissierUSD,
            "centDollars" => $request->hundred,
            "cinquanteDollars" => $request->fitfty,
            "vightDollars" => $request->twenty,
            "dixDollars" => $request->ten,
            "cinqDollars" => $request->five,
            "unDollars" => $request->oneDollar,
            "montantUSD" => $billetageUSD->sommeMontantUSD,
            "NomUtilisateur" => Auth::user()->name,
            "DateTransaction" => $date,
            "CodeMonnaie" => 1,
        ]);


        return response()->json(["success" => 1, "msg" => "Opération bien enregistrée"]);
    }

    //POUR LE DELESTAGE EN CDF

    public function delestageCDF(Request $request)
    {

        CompteurTransaction::create([
            'fakevalue' => "0000",
        ]);
        $numOperation = [];
        $numOperation = CompteurTransaction::latest()->first();
        $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;

        //RECUPERE LA DATE DU SYSTEME
        $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;

        //RECUPERE LE COMPTE DU CAISSIER CONCERNE CDF
        $numCompteCaissierCDF = Comptes::where("caissierId", "=", Auth::user()->id)->where("CodeMonnaie", "=", "2")->first();
        $CompteCaissierCDF = $numCompteCaissierCDF->NumCompte;

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
            DB::raw("SUM(montantEntre)-SUM(montantSortie) as sommeMontantCDF"),
        )->where("NomUtilisateur", "=", Auth::user()->name)->where("DateTransaction", "=", $date)
            ->where("delested", "=", 0)
            ->groupBy("NomUtilisateur")
            ->first();
        //RENSEINE LE DELESTAGE
        BilletageCdf::where("NomUtilisateur", "=", Auth::user()->name)->where("DateTransaction", "=", $date)->update([
            "delested" => 1
        ]);

        Delestage::create([
            "Reference" => $NumTransaction,
            "NumCompteCaissier" => $CompteCaissierCDF,
            "vightMilleFranc" => $billetageCDF->vightMilleFranc,
            "dixMilleFranc" => $billetageCDF->dixMilleFranc,
            "cinqMilleFranc" => $billetageCDF->cinqMilleFranc,
            "milleFranc" => $billetageCDF->milleFranc,
            "cinqCentFranc" => $billetageCDF->cinqCentFranc,
            "deuxCentFranc" => $billetageCDF->deuxCentFranc,
            "centFranc" => $billetageCDF->centFranc,
            "cinquanteFanc" => $billetageCDF->cinquanteFanc,
            "montantCDF" => $billetageCDF->sommeMontantCDF,
            "NomUtilisateur" => Auth::user()->name,
            "NomDemandeur" => Auth::user()->name,
            "DateTransaction" => $date,
            "CodeMonnaie" => 2,
        ]);

        return response()->json([
            "success" => 1,
            "msg" => "Délestage éffectué avec succès votre requête est en cours de validation..."
        ]);
    }


    public function delestageUSD(Request $request)
    {

        CompteurTransaction::create([
            'fakevalue' => "0000",
        ]);
        $numOperation = [];
        $numOperation = CompteurTransaction::latest()->first();
        $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;


        //RECUPERE LA DATE DU SYSTEME
        $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;

        //RECUPERE LE COMPTE DU CAISSIER CONCERNE USD
        $numCompteCaissierUSD = Comptes::where("caissierId", "=", Auth::user()->id)->where("CodeMonnaie", "=", "1")->first();
        $CompteCaissierUSD = $numCompteCaissierUSD->NumCompte;

        //RECUPERE LE BILLETAGE EN DOLLARS
        $billetageUSD = BilletageUsd::select(
            DB::raw("SUM(centDollars)-SUM(centDollarsSortie) as centDollars"),
            DB::raw("SUM(cinquanteDollars)-SUM(cinquanteDollarsSortie) as cinquanteDollars"),
            DB::raw("SUM(vightDollars)-SUM(vightDollarsSortie) as vightDollars"),
            DB::raw("SUM(dixDollars)-SUM(dixDollarsSortie) as dixDollars"),
            DB::raw("SUM(cinqDollars)-SUM(cinqDollarsSortie) as cinqDollars"),
            DB::raw("SUM(unDollars)-SUM(unDollarsSortie) as unDollars"),
            DB::raw("SUM(montantEntre)-SUM(montantSortie) as sommeMontantUSD"),
        )->where("NomUtilisateur", "=", Auth::user()->name)->where("DateTransaction", "=", $date)
            ->where("delested", "=", 0)
            ->groupBy("NomUtilisateur")
            ->first();

        //RENSEINE LE DELESTAGE
        BilletageUsd::where("NomUtilisateur", "=", Auth::user()->name)->where("DateTransaction", "=", $date)->update([
            "delested" => 1
        ]);

        Delestage::create([
            "Reference" => $NumTransaction,
            "NumCompteCaissier" => $CompteCaissierUSD,
            "centDollars" => $billetageUSD->centDollars,
            "cinquanteDollars" => $billetageUSD->cinquanteDollars,
            "vightDollars" => $billetageUSD->vightDollars,
            "dixDollars" => $billetageUSD->dixDollars,
            "cinqDollars" => $billetageUSD->cinqDollars,
            "unDollars" => $billetageUSD->unDollars,
            "montantUSD" => $billetageUSD->sommeMontantUSD,
            "NomUtilisateur" => Auth::user()->name,
            "NomDemandeur" => Auth::user()->name,
            "DateTransaction" => $date,
            "CodeMonnaie" => 1,
        ]);

        return response()->json([
            "success" => 1,
            "msg" => "Délestage éffectué avec succès votre requête est en cours de validation..."
        ]);
    }

    //AU CAS OU L'UTILSATEUR A MIS A JOUR LE BILLETAGE CDF

    public function delestageChangeMCDF()
    {

        CompteurTransaction::create([
            'fakevalue' => "0000",
        ]);
        $numOperation = [];
        $numOperation = CompteurTransaction::latest()->first();
        $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;


        //RECUPERE LA DATE DU SYSTEME
        $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;

        $dataCDF = ChangeMonnaie::where("NomUtilisateur", "=", Auth::user()->name)->where("DateTransaction", "=", $date)->where("CodeMonnaie", "=", 2)->where("received", "=", 0)->first();

        Delestage::create([
            "Reference" => $NumTransaction,
            "NumCompteCaissier" => $dataCDF->NumCompteCaissier,
            "vightMilleFranc" => $dataCDF->vightMilleFranc,
            "dixMilleFranc" => $dataCDF->dixMilleFranc,
            "cinqMilleFranc" => $dataCDF->cinqMilleFranc,
            "milleFranc" => $dataCDF->milleFranc,
            "cinqCentFranc" => $dataCDF->cinqCentFranc,
            "deuxCentFranc" => $dataCDF->deuxCentFranc,
            "centFranc" => $dataCDF->centFranc,
            "cinquanteFanc" => $dataCDF->cinquanteFanc,
            "montantCDF" => $dataCDF->montantCDF,
            "NomUtilisateur" => Auth::user()->name,
            "NomDemandeur" => Auth::user()->name,
            "DateTransaction" => $date,
            "CodeMonnaie" => 2,
        ]);


        return response()->json([
            "success" => 1,
            "msg" => "Délestage éffectué avec succès votre requête est en cours de validation..."
        ]);
    }

    //AU CAS OU L'UTILSATEUR A MIS A JOUR LE BILLETAGE USD

    public function delestageChangeMUSD()
    {

        CompteurTransaction::create([
            'fakevalue' => "0000",
        ]);
        $numOperation = [];
        $numOperation = CompteurTransaction::latest()->first();
        $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;


        //RECUPERE LA DATE DU SYSTEME
        $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;

        $dataUSD = ChangeMonnaie::where("NomUtilisateur", "=", Auth::user()->name)->where("DateTransaction", "=", $date)->where("CodeMonnaie", "=", 1)->where("received", "=", 1)->first();

        Delestage::create([
            "Reference" => $NumTransaction,
            "NumCompteCaissier" => $dataUSD->NumCompteCaissier,
            "centDollars" => $dataUSD->centDollars,
            "cinquanteDollars" => $dataUSD->cinquanteDollars,
            "vightDollars" => $dataUSD->vightDollars,
            "dixDollars" => $dataUSD->dixDollars,
            "cinqDollars" => $dataUSD->cinqDollars,
            "unDollars" => $dataUSD->unDollars,
            "montantUSD" => $dataUSD->montantUSD,
            "NomUtilisateur" => Auth::user()->name,
            "NomDemandeur" => Auth::user()->name,
            "DateTransaction" => $date,
            "CodeMonnaie" => 1,
        ]);


        return response()->json([
            "success" => 1,
            "msg" => "Délestage éffectué avec succès votre requête est en cours de validation..."
        ]);
    }
    //GET MAIN PAGE

    public function getDelestagePage()
    {
        return view('delestage');
    }
}
