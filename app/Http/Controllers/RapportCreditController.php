<?php

namespace App\Http\Controllers;

use App\Models\Echeancier;
use App\Models\Portefeuille;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RapportCreditController extends Controller
{
    public function __construct()
    {
        $this->middleware("auth");
    }

    //RECUPERE LES INFORMATION DU RAPPORT DE CREDIT
    public function getRapportCredit()
    {
        $data = Portefeuille::query()->orderBy('id', 'desc')->limit(20)->get();
        return response(["success" => 1, "data" => $data]);
    }

    //RECUPERE L'ECHEANCIER 

    public function getEcheancier(Request  $request)
    {
        //SI L'UTILISATEUR TANTE D'AFFICHER L'ECHEANCIER SANS FOUNIR UN NUMERO A RECHERCHER
        if (isset($request->NumCompteEpargne) or isset($request->NumCompteCredit)  or isset($request->NumDossier)) {
            $data = Portefeuille::where("portefeuilles.NumDossier", "=", $request->NumDossier)
                // ->where("echeanciers.CapAmmorti", ">", 0)
                ->orWhere("portefeuilles.NumCompteEpargne", "=", $request->NumCompteEpargne)
                ->orWhere("portefeuilles.NumCompteCredit", "=", $request->NumCompteCredit)
                ->join('echeanciers', 'echeanciers.NumDossier', '=', 'portefeuilles.NumDossier')
                ->join('comptes', 'comptes.NumCompte', '=', 'portefeuilles.NumCompteEpargne')
                // ->select('echeanciers.*')
                ->get();

            //RECUPERE LA SOMME DES INTERET A PAYER
            $dataSommeInter = Echeancier::select(
                DB::raw("SUM(echeanciers.Interet) as sommeInteret"),
            )->where("echeanciers.NumDossier", "=", $request->NumDossier)
                ->orWhere("portefeuilles.NumCompteEpargne", "=", $request->NumCompteEpargne)
                ->orWhere("portefeuilles.NumCompteCredit", "=", $request->NumCompteCredit)
                ->join('portefeuilles', 'portefeuilles.NumDossier', '=', 'echeanciers.NumDossier')
                ->first();

            return response()->json(["success" => 1, "data" => $data, "msg" => "Resultat trouvé", "sommeInteret" => $dataSommeInter]);
        } else {
            return response()->json(["success" => 0, "msg" => "Veuillez renseigner un numero de dossier, un compte epargne ou un numéro de compte crédit"]);
        }
    }
    //RECUPERE LE TABLEAU D'AMMORTISSEMENT

    public function getTableauAmmortissement(Request $request)
    {
        if (isset($request->NumCompteEpargne) or isset($request->NumCompteCredit)  or isset($request->NumDossier)) {

            $data = Portefeuille::where("portefeuilles.NumDossier", "=", $request->NumDossier)
                ->where("echeanciers.CapAmmorti", ">", 0)
                ->orWhere("portefeuilles.NumCompteEpargne", "=", $request->NumCompteEpargne)
                ->orWhere("portefeuilles.NumCompteCredit", "=", $request->NumCompteCredit)
                ->leftJoin('echeanciers', 'echeanciers.NumDossier', '=', 'portefeuilles.NumDossier')
                ->leftJoin('remboursementcredits', 'remboursementcredits.RefEcheance', '=', 'echeanciers.ReferenceEch')
                //   ->select('echeanciers.*')
                ->get();

            //RECUPERE LA SOMME DES INTERET A PAYER
            $dataSommeInter = Echeancier::select(
                DB::raw("SUM(echeanciers.Interet) as sommeInteret"),
            )->where("echeanciers.NumDossier", "=", $request->NumDossier)
                ->orWhere("portefeuilles.NumCompteEpargne", "=", $request->NumCompteEpargne)
                ->orWhere("portefeuilles.NumCompteCredit", "=", $request->NumCompteCredit)
                ->join('portefeuilles', 'portefeuilles.NumDossier', '=', 'echeanciers.NumDossier')
                ->first();

            return response()->json(["success" => 1, "data" => $data, "msg" => "Resultat trouvé", "sommeInteret" => $dataSommeInter]);
        } else {
            return response()->json(["success" => 0, "msg" => "Veuillez renseigner un numero de dossier, un compte epargne ou un numéro de compte crédit"]);
        }
    }

    public function getRapportCreditPage()
    {
        return view('rapport-credit');
    }
}
