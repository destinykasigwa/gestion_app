<?php

namespace App\Http\Controllers;

use App\Models\Comptes;
use App\Models\LockedGarantie;
use App\Models\Transactions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class SoldeController extends Controller
{
    public function __construct()
    {
        $this->middleware("auth");
    }
    //RECUPERE LE RELEVE DU MEMBRE


    public function getReleveMembre(Request $request)
    {

        if (!$request->devise) {
            return response()->json(["success" => 0, "msg" => "Veuillez sélectionnez la dévise svp."]);
        }

        if ($request->devise == "CDF") {
            $nombreMois = 24;
            $firstdateOfYear = date('Y') . '-01-01';
            $NewDate1 = date('Y-m-d', strtotime("-" . $nombreMois . "month"));
            $date1 = $request->dateToSearch1;
            $date2 = $request->dateToSearch2;
            $dataCDF = Comptes::where("NumAdherant", "=", $request->refCompte)->where("CodeMonnaie", "=", 2)->first();
            if ($dataCDF ? $numCompte = $dataCDF->NumCompte : null) {

                //RECUPERE LE SOLDE d'ouverture
                //$getSoldeOuvertureCDF = DB::select('SELECT SUM(Creditfc)-SUM(Debitfc) as soldeOuvertureCDF FROM transactions WHERE transactions.NumCompte="'.$numCompte.'"  AND transactions.DateTransaction <= "'.$date1.'" GROUP BY transactions.NumCompte');
                $getSoldeOuvertureCDF = Transactions::select(
                    DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeOuvertureCDF"),
                )->where("NumCompte", "=", $numCompte)
                    ->where("CodeMonnaie", "=", 2)
                    ->whereBetween('transactions.DateTransaction', [$date1, $date2])
                    ->groupBy("NumCompte")
                    ->get();


                $getSoldeOfFistDayOfYear = Transactions::select(
                    DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeOfFirstYear"),
                )->where("NumCompte", "=", $numCompte)
                    ->where("CodeMonnaie", "=", 2)
                    ->where('transactions.DateTransaction', "<=", $firstdateOfYear)
                    ->groupBy("NumCompte")
                    ->get();


                //RECUPERE LE SOLDE DE CLOTURE
                $getSoldeClotureCDF = Transactions::select(
                    DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeClotureCDF"),
                )->where("NumCompte", "=", $numCompte)
                    ->where("CodeMonnaie", "=", 2)
                    // ->where('transactions.DateTransaction', "<=", $date2)
                    ->groupBy("NumCompte")
                    ->get();

                //RECUPERE LE SOLDE DU MEMBRE EN FC EN USD
                $soldeMembre = Transactions::select(
                    DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
                    DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeMembreCDF"),
                )->where("NumCompte", "=", $numCompte)
                    ->where("CodeMonnaie", "=", 2)
                    // ->whereBetween('transactions.DateTransaction', [$date1, $date2])
                    ->groupBy("NumCompte")
                    ->get();

                //PUIS RECULE LE RELEVE EN PRENANT COMPTE DE CuMULE DE SOLDE
                $dataReleve = DB::select('SELECT transactions.RéfTransaction,transactions.NumTransaction,transactions.DateTransaction,transactions.Libelle,transactions.Debitfc,transactions.Creditfc,comptes.NomCompte,comptes.CodeMonnaie, @cumul := @cumul + transactions.Creditfc-transactions.Debitfc 
            AS solde FROM ( SELECT @cumul := 0 ) AS C, transactions 
            INNER JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
             WHERE (transactions.NumCompte="' . $numCompte . '" AND transactions.DateTransaction BETWEEN "' . $date1 . '" AND "' . $date2 . '") AND (transactions.Credit!=0 OR transactions.Debit!=0)
            ORDER BY transactions.DateTransaction,transactions.RéfTransaction');

                //RECUPERE LE TOTAUX CDF

                $dataTot = Transactions::select(
                    DB::raw("SUM(Creditfc) as  totCredit"),
                    DB::raw("SUM(Debitfc) as totDebit"),

                )->where("NumCompte", '=', $numCompte)
                    ->where("CodeMonnaie", "=", 2)
                    ->whereBetween('transactions.DateTransaction', [$NewDate1, $date2])
                    ->groupBy("NumCompte")
                    ->get();


                //VERIFIE SI LA PERSONNE A UNE CREDIT ET QUE IL YA UNE EPARGNE BLOQUEE
                $getData = LockedGarantie::where("NumAbrege", $request->refCompte)->where("paidState", 0)->first();
                if ($getData) {
                    $montantGarantie = $getData->Montant;
                    return response()->json([
                        "success" => 1, "dataReleve"
                        => $dataReleve, "dataSolde" => $soldeMembre, "infoMembre"
                        => $dataCDF, "totCDF"
                        => $dataTot, "SoldeOuvertureCDF"
                        => $getSoldeOuvertureCDF, "SoldeClotureCDF"
                        => $getSoldeClotureCDF, "getSoldeOfFistDayOfYearCDF"
                        =>  $getSoldeOfFistDayOfYear, "dateFistDay"
                        =>  $firstdateOfYear,
                        "montantGarantie" => $montantGarantie,
                        "date1" => $date1,
                        "date2" => $date2,
                    ]);
                } else {
                    return response()->json([
                        "success" => 1, "dataReleve"
                        => $dataReleve, "dataSolde" => $soldeMembre, "infoMembre"
                        => $dataCDF, "totCDF"
                        => $dataTot, "SoldeOuvertureCDF"
                        => $getSoldeOuvertureCDF, "SoldeClotureCDF"
                        => $getSoldeClotureCDF, "getSoldeOfFistDayOfYearCDF"
                        =>  $getSoldeOfFistDayOfYear, "dateFistDay"
                        =>  $firstdateOfYear,
                        "date1" => $date1,
                        "date2" => $date2,

                    ]);
                }
            } else {
                if (Auth::user()->Role == 0) {
                    return response()->json(["success" => 0, "msg" => "Ce numéro compte ne semble pas existé veuillez contacter le service client."]);
                } else {
                    return response()->json(["success" => 0, "msg" => "Ce numéro compte ne semble pas existé."]);
                }
            }
        } else if ($request->devise == "USD") {

            $date1 = $request->dateToSearch1;
            $date2 = $request->dateToSearch2;
            $firstdateOfYear = date('Y') . '-01-01';
            $dataUSD = Comptes::where("NumAdherant", "=", $request->refCompte)->where("CodeMonnaie", "=", 1)->first();
            if ($dataUSD ?  $numCompte = $dataUSD->NumCompte : null) {
                //RECUPERE LE SOLDE D'OUVERTURE
                $getSoldeOuvertureUSD = Transactions::select(
                    DB::raw("SUM(Credit$)-SUM(Debit$) as soldeOuvertureUSD"),
                )->where("NumCompte", "=", $numCompte)
                    ->where("CodeMonnaie", "=", 1)
                    ->whereBetween('transactions.DateTransaction', [$date1, $date2])
                    ->groupBy("NumCompte")
                    ->get();

                //RECUPERE LE SOLDE DE CLOTURE
                $getSoldeClotureUSD = Transactions::select(
                    DB::raw("SUM(Credit$)-SUM(Debit$) as soldeClotureUSD"),
                )->where("NumCompte", "=", $numCompte)
                    ->where('transactions.DateTransaction', "<=", $date2)
                    ->where("CodeMonnaie", "=", 1)
                    ->groupBy("NumCompte")
                    ->get();

                $getSoldeOfFistDayOfYear = Transactions::select(
                    DB::raw("SUM(Credit$)-SUM(Debit$) as soldeOfFirstYear"),
                )->where("NumCompte", "=", $numCompte)
                    ->where("CodeMonnaie", "=", 1)
                    ->where('transactions.DateTransaction', "<=", $firstdateOfYear)
                    ->groupBy("NumCompte")
                    ->get();


                //RECUPERE LE SOLDE DU MEMBRE EN USD

                $soldeMembreUSD = Transactions::select(
                    DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
                )->where("NumCompte", '=', $numCompte)
                    ->where("CodeMonnaie", "=", 1)
                    // ->whereBetween('transactions.DateTransaction', [$date1, $date2])
                    ->groupBy("NumCompte")
                    ->get();

                $dataReleve = DB::select('SELECT transactions.RéfTransaction,transactions.NumTransaction,transactions.DateTransaction,transactions.Libelle,transactions.Debit$,transactions.Credit$,comptes.NomCompte,comptes.CodeMonnaie, @cumul := @cumul + transactions.Credit$-transactions.Debit$ 
            AS solde 
            FROM ( SELECT @cumul := 0 ) 
            AS C, transactions INNER JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
            WHERE (transactions.NumCompte="' . $numCompte . '" AND transactions.DateTransaction BETWEEN "' . $date1 . '" AND "' . $date2 . '") AND  (transactions.Credit!=0 OR transactions.Debit!=0)
            ORDER BY transactions.DateTransaction,transactions.RéfTransaction
            ');

                //RECUPERE LE TOTAUX USD
                $nombreMois = 24;
                $NewDate1 = date('Y-m-d', strtotime("-" . $nombreMois . "month"));
                $dataTot = Transactions::select(
                    DB::raw("SUM(Credit$) as  totCredit"),
                    DB::raw("SUM(Debit$) as totDebit")
                )->where("NumCompte", '=', $numCompte)
                    ->whereBetween('transactions.DateTransaction', [$NewDate1, $date2])
                    ->where("CodeMonnaie", "=", 1)
                    ->groupBy("NumCompte")
                    ->get();

                //VERIFIE SI LA PERSONNE A UNE CREDIT ET QUE IL YA UNE EPARGNE BLOQUEE

                $getData = LockedGarantie::where("NumAbrege", $request->refCompte)->where("paidState", 0)->first();



                if ($getData) {
                    $montantGarantie = $getData->Montant;
                    return response()->json([
                        "success" => 1, "dataReleve"
                        => $dataReleve, "dataSolde"
                        => $soldeMembreUSD, "infoMembre"
                        => $dataUSD, "totUSD" => $dataTot, "SoldeOuvertureUSD"
                        => $getSoldeOuvertureUSD, "SoldeClotureUSD"
                        => $getSoldeClotureUSD, "getSoldeOfFistDayOfYearUSD"
                        =>  $getSoldeOfFistDayOfYear, "dateFistDay"
                        =>  $firstdateOfYear,
                        "montantGarantie" => $montantGarantie

                    ]);
                } else {
                    return response()->json([
                        "success" => 1, "dataReleve"
                        => $dataReleve, "dataSolde"
                        => $soldeMembreUSD, "infoMembre"
                        => $dataUSD, "totUSD" => $dataTot, "SoldeOuvertureUSD"
                        => $getSoldeOuvertureUSD, "SoldeClotureUSD"
                        => $getSoldeClotureUSD, "getSoldeOfFistDayOfYearUSD"
                        =>  $getSoldeOfFistDayOfYear, "dateFistDay"
                        =>  $firstdateOfYear,


                    ]);
                }
            } else {
                return response()->json(["success" => 0, "msg" => "Ce numéro compte ne semble pas existé"]);
            }
        }
    }


    //RECUPERE LE COMPTE RECHERCHER PAR NOM

    public function searcheItem($item)
    {
        $data = Comptes::where("NomCompte", "LIKE", '%' . $item . '%')->get();
        if (count($data) != 0) {
            return response()->json(["success" => 1, "data" => $data]);
        } else {
            return response()->json(["success" => 0, "msg" => "Aucun élément trouvé"]);
        }
    }




    public function getSoldePage()
    {
        return view('solde');
    }
}
