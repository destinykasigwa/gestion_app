<?php

namespace App\Http\Controllers;

use App\Models\Transactions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class RecuController extends Controller
{
    public function __construct()
    {
        $this->middleware("auth");
    }

    public function recuRetrait()
    {

        //RECUPERE LA DERNIERE LIGNE ENREGISTREE POUR VERIVIER LA DEVISE
        //SELECT * FROM `transactions` JOIN billetage_cdfs ON transactions.NumTransaction=billetage_cdfs.refOperation ORDER BY transactions.RéfTransaction DESC LIMIT 1;
        $userName = Auth::user()->name;
        $checkDevise = Transactions::where("NomUtilisateur", "=", $userName)->orderBy("RéfTransaction", "desc")->first();
        if ($checkDevise->CodeMonnaie == 2) {

            $dataRetraitCDF = DB::select('SELECT * FROM  billetage_cdfs   WHERE billetage_cdfs.Devise="CDF" AND billetage_cdfs.NomUtilisateur="' . $userName . '"  ORDER BY billetage_cdfs.id DESC LIMIT 1')[0];
            return response()->json(["success" => 1, "dataRetraitCDF" => $dataRetraitCDF, "devise" => 2]);
        } else if ($checkDevise->CodeMonnaie == 1) {
            $dataRetraitUSD = DB::select('SELECT * FROM  billetage_usds   WHERE billetage_usds.Devise="USD" AND billetage_usds.NomUtilisateur="' . $userName . '"  ORDER BY billetage_usds.id DESC LIMIT 1')[0];
            return response()->json(["success" => 1, "dataRetraitUSD" => $dataRetraitUSD, "devise" => 1]);
        }
    }

    public function recuDepot()
    {

        //RECUPERE LA DERNIERE LIGNE ENREGISTREE POUR VERIVIER LA DEVISE
        //SELECT * FROM `transactions` JOIN billetage_cdfs ON transactions.NumTransaction=billetage_cdfs.refOperation ORDER BY transactions.RéfTransaction DESC LIMIT 1;
        $userName = Auth::user()->name;
        $checkDevise = Transactions::where("NomUtilisateur", "=", $userName)->orderBy("RéfTransaction", "desc")->first();

        if ($checkDevise->CodeMonnaie == 2) {
            $dataDepotCDF = DB::select('SELECT * FROM  billetage_cdfs   WHERE billetage_cdfs.Devise="CDF" AND billetage_cdfs.NomUtilisateur="' . $userName . '"  ORDER BY billetage_cdfs.id DESC LIMIT 1')[0];
            return response()->json(["success" => 1, "dataDepotCDF" => $dataDepotCDF, "devise" => 2]);
        } else if ($checkDevise->CodeMonnaie == 1) {

            $dataDepotUSD = DB::select('SELECT * FROM  billetage_usds   WHERE billetage_usds.Devise="USD" AND billetage_usds.NomUtilisateur="' . $userName . '"  ORDER BY billetage_usds.id DESC LIMIT 1')[0];
            return response()->json(["success" => 1, "dataDepotUSD" => $dataDepotUSD, "devise" => 1]);
        }
    }


    //GET RECU PAGE RETRAIT

    public function getPrintPageRetrait()
    {
        return view('recu-retrait');
    }

    //GET RECU PAGE DEPOT

    public function getPrintPageDepot()
    {
        return view('recu-depot');
    }
}
