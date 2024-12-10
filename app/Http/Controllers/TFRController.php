<?php

namespace App\Http\Controllers;

use App\Models\Comptes;
use App\Models\Tableautfr;
use App\Models\Transactions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TFRController extends Controller
{
    public function __construct()
    {
        $this->middleware("auth");
    }

    //RECUPERE LES DONNEES A AFFICHER SUR LE TFR

    public function getTFRData(Request $request)
    {
        // $data = Comptes::where("RefTypeCompte", "=", 7)
        //     ->leftJoin("transactions", "comptes.NumCompte", "=", "transactions.NumCompte")
        //     ->get();
        if (isset($request->devise)  and isset($request->dateToSearch2)) {
            // $firstdate = date('Y') . '-01-01';
            // $time1 = strtotime($request->dateToSearch1);
            // $time2 = strtotime($request->dateToSearch2);
            // $newdate1 = date("Y-m-d", strtotime("-1 month", $time1));
            // $newdate2 = date("Y-m-d", strtotime("-1 month", $time2));

            if ($request->devise == "CDF") {
                $reqGetSoldeCompte = DB::select('SELECT DISTINCT sum(transactions.Creditfc) AS soldeCDF,sum(transactions.Credit$) AS soldeUSD, comptes.NomCompte,comptes.RefTypeCompte 
                FROM transactions JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                WHERE (comptes.RefTypeCompte=7) AND (transactions.DateTransaction
                 BETWEEN "' . $request->dateToSearch1 . '" AND   "' . $request->dateToSearch2 . '" 
                 AND (transactions.Creditfc>0 OR transactions.Credit$>0) AND comptes.CodeMonnaie=2 AND transactions.extourner!=1)  GROUP BY transactions.NumCompte,comptes.NumAdherant 
                 UNION SELECT DISTINCT sum(transactions.Debitfc) AS soldeCDF,sum(transactions.Debit$) AS soldeUSD, comptes.NomCompte,comptes.RefTypeCompte 
                 FROM transactions JOIN comptes ON transactions.NumCompte=comptes.NumCompte
                  WHERE (comptes.RefTypeCompte=6) AND (transactions.DateTransaction BETWEEN "' . $request->dateToSearch1 . '" AND   "' . $request->dateToSearch2 . '" 
                  AND comptes.CodeMonnaie=2 AND transactions.extourner!=1) GROUP BY transactions.NumCompte,comptes.NumAdherant');
                //RECUPERE LA DIFFERENCE ENTRE LES DEUX COMPTES

                $reqGetSoldeProduit = DB::select('SELECT DISTINCT sum(transactions.Creditfc) AS soldeProduitCDF,sum(transactions.Credit$) AS soldeProduitUSD, comptes.NomCompte,comptes.RefTypeCompte 
                FROM transactions JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                WHERE (comptes.RefTypeCompte=7) AND (transactions.DateTransaction
                 BETWEEN "' . $request->dateToSearch1 . '" AND   "' . $request->dateToSearch2 . '" 
                  AND transactions.extourner!=1 AND comptes.CodeMonnaie=2)');

                $reqGetSoldeCharge = DB::select('SELECT DISTINCT sum(transactions.Debitfc) AS soldeChargeCDF,sum(transactions.Debit$) AS soldeChargeUSD, comptes.NomCompte,comptes.RefTypeCompte 
                FROM transactions JOIN comptes ON transactions.NumCompte=comptes.NumCompte
                 WHERE (comptes.RefTypeCompte=6) AND (transactions.DateTransaction BETWEEN "' . $request->dateToSearch1 . '" AND   "' . $request->dateToSearch2 . '" 
                 AND transactions.extourner!=1 AND comptes.CodeMonnaie=2)');

                return response()->json(["success" => 1, "data" => $reqGetSoldeCompte, "soldeProduit" => $reqGetSoldeProduit, "soldeCharge" => $reqGetSoldeCharge]);
            } else if ($request->devise == "USD") {
                $reqGetSoldeCompte = DB::select('SELECT DISTINCT sum(transactions.Creditfc) AS soldeCDF,sum(transactions.Credit$) AS soldeUSD, comptes.NomCompte,comptes.RefTypeCompte 
                FROM transactions JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                WHERE (comptes.RefTypeCompte=7) AND (transactions.DateTransaction
                 BETWEEN "' . $request->dateToSearch1 . '" AND   "' . $request->dateToSearch2 . '" 
                 AND (transactions.Creditfc>0 OR transactions.Credit$>0) AND comptes.CodeMonnaie=1 AND transactions.extourner!=1) GROUP BY transactions.NumCompte,comptes.NumAdherant 
                 UNION SELECT DISTINCT sum(transactions.Debitfc) AS soldeCDF,sum(transactions.Debit$) AS soldeUSD, comptes.NomCompte,comptes.RefTypeCompte 
                 FROM transactions JOIN comptes ON transactions.NumCompte=comptes.NumCompte
                  WHERE (comptes.RefTypeCompte=6) AND (transactions.DateTransaction BETWEEN "' . $request->dateToSearch1 . '" AND   "' . $request->dateToSearch2 . '" 
                  AND comptes.CodeMonnaie=1 AND transactions.extourner!=1) GROUP BY transactions.NumCompte,comptes.NumAdherant');
                //RECUPERE LA DIFFERENCE ENTRE LES DEUX COMPTES

                $reqGetSoldeProduit = DB::select('SELECT DISTINCT sum(transactions.Creditfc) AS soldeProduitCDF,sum(transactions.Credit$) AS soldeProduitUSD, comptes.NomCompte,comptes.RefTypeCompte 
                FROM transactions JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                WHERE (comptes.RefTypeCompte=7) AND (transactions.DateTransaction
                 BETWEEN "' . $request->dateToSearch1 . '" AND   "' . $request->dateToSearch2 . '" 
                  AND transactions.extourner!=1 AND comptes.CodeMonnaie=1)');

                $reqGetSoldeCharge = DB::select('SELECT DISTINCT sum(transactions.Debitfc) AS soldeChargeCDF,sum(transactions.Debit$) AS soldeChargeUSD, comptes.NomCompte,comptes.RefTypeCompte 
                FROM transactions JOIN comptes ON transactions.NumCompte=comptes.NumCompte
                 WHERE (comptes.RefTypeCompte=6) AND (transactions.DateTransaction BETWEEN "' . $request->dateToSearch1 . '" AND   "' . $request->dateToSearch2 . '"
                 AND transactions.extourner!=1 AND comptes.CodeMonnaie=1)');

                return response()->json(["success" => 1, "data" => $reqGetSoldeCompte, "soldeProduit" => $reqGetSoldeProduit, "soldeCharge" => $reqGetSoldeCharge]);
            }
        } else {
            return response()->json(["success" => 0, "msg" => "Veuillez sélectionnez la devise svp!"]);
        }
    }

    //AFFICHE LA PAGE POUR LE TFR

    public function getTfrPage()
    {
        return view('tfr');
    }
}
