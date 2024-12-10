<?php

namespace App\Http\Controllers;

use App\Models\Dummy;
use App\Models\Portefeuille;
use App\Models\Transactions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function getReportsPage()
    {

        // return view('reports', compact('data'));
        // return view('reports', with(compact('data')));
        return view('reports');
    }
    public function getPortefeuilleData(Request $request)
    {
        if (isset($request->dateDebut) and isset($request->dateFin)) {
            $data = DB::select('SELECT * FROM portefeuilles WHERE DateOctroi 
            BETWEEN "' . $request->dateDebut . '" AND "' . $request->dateFin . '"');
            if ($data) {
                $success = 1;
                return view('reports', with(compact('success', 'data')));
            } else {
                $success = 0;
                return view('reports', with(compact('data', 'success')));
            }
        } else {
            $success = 0;
            return view('reports', with(compact('success')));
        }

        //$data=Portefeuille::where("DateOctroi")
        //dd($request->dateDebut);


        // return $view->with(compact('persons', 'ms'));
    }


    //AFFICHE LA PAGE DE REMBOURSEMENT ATTENDU



    public function getRembousementAttenduPage()
    {
        return view('remboursement-attendu');
    }
    //RECUPERE LE BILAN POUR L'AFFICHER A L'UTILISATEUR

    public function getBilan(Request $request)
    {
    }
}
