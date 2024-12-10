<?php

namespace App\Http\Controllers;

use App\Models\Transactions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SommaireCompteController extends Controller
{
    public function __construct()
    {
        $this->middleware("auth");
    }

    //RECUPERE LE SOMMAIRE DE COMPTE SELON UN CRITERE DONNEE

    public function getSommaireCompte(Request $request)
    {

        if (isset($request->DateDebut) and isset($request->DateFin)) {
            //ON VERIFIE SI LE MEMBRE A RENSEIGNER LE S GROUPE COMPTE ET LA DEVISE
            if (isset($request->SGCompte) and isset($request->Devise)) {
                //ON VERIFIE SI L'UTILISATEUR A RENSEIGNER LE CRITERE
                if (isset($request->Critere)) {
                    if ($request->Devise == "CDF") {
                        if ($request->Critere == "=") {
                            $data = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde,transactions.NumCompte,comptes.NomCompte FROM transactions 
                        JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                        WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=2) 
                        AND transactions.DateTransaction BETWEEN "' . $request->DateDebut . '"  AND "' . $request->DateFin . '" GROUP BY transactions.NumCompte HAVING SUM(transactions.Creditfc)-SUM(transactions.Debitfc)="' . $request->valeur . '"');

                            //RECUPERE LE SOLDE DE TOUS LE COMPTES RECHERCHER
                            $dataSoldeSearched = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde FROM transactions 
                         JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                         WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=2)')[0];
                            return response(["success" => 1, "data" => $data, "soldesearched" => $dataSoldeSearched]);
                        } else if ($request->Critere == ">") {
                            $data = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde,transactions.NumCompte,comptes.NomCompte FROM transactions 
                            JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                            WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=2) 
                            AND transactions.DateTransaction BETWEEN "' . $request->DateDebut . '"  AND "' . $request->DateFin . '" GROUP BY transactions.NumCompte HAVING SUM(transactions.Creditfc)-SUM(transactions.Debitfc)>"' . $request->valeur . '" ');

                            //RECUPERE LE SOLDE DE TOUS LE COMPTES RECHERCHER
                            $dataSoldeSearched = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde FROM transactions 
                             JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                             WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=2)')[0];
                            return response(["success" => 1, "data" => $data, "soldesearched" => $dataSoldeSearched]);
                        } else if ($request->Critere == "<") {
                            $data = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde,transactions.NumCompte,comptes.NomCompte FROM transactions 
                            JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                            WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=2) 
                            AND transactions.DateTransaction BETWEEN "' . $request->DateDebut . '"  AND "' . $request->DateFin . '" GROUP BY transactions.NumCompte HAVING SUM(transactions.Creditfc)-SUM(transactions.Debitfc)<"' . $request->valeur . '" ');

                            //RECUPERE LE SOLDE DE TOUS LE COMPTES RECHERCHER
                            $dataSoldeSearched = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde FROM transactions 
                             JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                             WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=2)')[0];
                            return response(["success" => 1, "data" => $data, "soldesearched" => $dataSoldeSearched]);
                        } else if ($request->Critere == ">=") {
                            $data = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde,transactions.NumCompte,comptes.NomCompte FROM transactions 
                            JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                            WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=2) 
                            AND transactions.DateTransaction BETWEEN "' . $request->DateDebut . '"  AND "' . $request->DateFin . '" GROUP BY transactions.NumCompte HAVING SUM(transactions.Creditfc)-SUM(transactions.Debitfc)>="' . $request->valeur . '"');

                            //RECUPERE LE SOLDE DE TOUS LE COMPTES RECHERCHER
                            $dataSoldeSearched = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde FROM transactions 
                             JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                             WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=2)')[0];
                            return response(["success" => 1, "data" => $data, "soldesearched" => $dataSoldeSearched]);
                        } else if ($request->Critere == "<=") {
                            $data = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde,transactions.NumCompte,comptes.NomCompte FROM transactions 
                            JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                            WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=2) 
                            AND transactions.DateTransaction BETWEEN "' . $request->DateDebut . '"  AND "' . $request->DateFin . '" GROUP BY transactions.NumCompte HAVING SUM(transactions.Creditfc)-SUM(transactions.Debitfc)<="' . $request->valeur . '"');

                            //RECUPERE LE SOLDE DE TOUS LE COMPTES RECHERCHER
                            $dataSoldeSearched = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde FROM transactions 
                             JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                             WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=2)')[0];
                            return response(["success" => 1, "data" => $data, "soldesearched" => $dataSoldeSearched]);
                        } else if ($request->Critere == "<>") {
                            $data = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde,transactions.NumCompte,comptes.NomCompte FROM transactions 
                            JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                            WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=2) 
                            AND transactions.DateTransaction BETWEEN "' . $request->DateDebut . '"  AND "' . $request->DateFin . '" GROUP BY transactions.NumCompte HAVING SUM(transactions.Creditfc)-SUM(transactions.Debitfc)!="' . $request->valeur . '" ');

                            //RECUPERE LE SOLDE DE TOUS LE COMPTES RECHERCHER
                            $dataSoldeSearched = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde FROM transactions 
                             JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                             WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=2)')[0];
                            return response(["success" => 1, "data" => $data, "soldesearched" => $dataSoldeSearched]);
                        }
                    } else if ($request->Devise == "USD") {

                        if ($request->Critere == "=") {
                            $data = DB::select('SELECT SUM(transactions.Credit$)-SUM(transactions.Debit$) as Solde,transactions.NumCompte,comptes.NomCompte FROM transactions 
                        JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                        WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=1) 
                        AND transactions.DateTransaction BETWEEN "' . $request->DateDebut . '"  AND "' . $request->DateFin . '" GROUP BY transactions.NumCompte HAVING SUM(transactions.Credit$)-SUM(transactions.Debit$)="' . $request->valeur . '"');

                            //RECUPERE LE SOLDE DE TOUS LE COMPTES RECHERCHER
                            $dataSoldeSearched = DB::select('SELECT SUM(transactions.Credit$)-SUM(transactions.Debit$) as Solde FROM transactions 
                         JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                         WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=1)')[0];
                            return response(["success" => 1, "data" => $data, "soldesearched" => $dataSoldeSearched]);
                        } else if ($request->Critere == ">") {
                            $data = DB::select('SELECT SUM(transactions.Credit$)-SUM(transactions.Debit$) as Solde,transactions.NumCompte,comptes.NomCompte FROM transactions 
                            JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                            WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=1) 
                            AND transactions.DateTransaction BETWEEN "' . $request->DateDebut . '"  AND "' . $request->DateFin . '" GROUP BY transactions.NumCompte HAVING SUM(transactions.Credit$)-SUM(transactions.Debit$)>"' . $request->valeur . '"');

                            //RECUPERE LE SOLDE DE TOUS LE COMPTES RECHERCHER
                            $dataSoldeSearched = DB::select('SELECT SUM(transactions.Credit$)-SUM(transactions.Debit$) as Solde FROM transactions 
                             JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                             WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=1)')[0];
                            return response(["success" => 1, "data" => $data, "soldesearched" => $dataSoldeSearched]);
                        } else if ($request->Critere == "<") {
                            $data = DB::select('SELECT SUM(transactions.Credit$)-SUM(transactions.Debit$) as Solde,transactions.NumCompte,comptes.NomCompte FROM transactions 
                            JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                            WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=1) 
                            AND transactions.DateTransaction BETWEEN "' . $request->DateDebut . '"  AND "' . $request->DateFin . '" GROUP BY transactions.NumCompte HAVING SUM(transactions.Credit$)-SUM(transactions.Debit$)<"' . $request->valeur . '"');

                            //RECUPERE LE SOLDE DE TOUS LE COMPTES RECHERCHER
                            $dataSoldeSearched = DB::select('SELECT SUM(transactions.Credit$)-SUM(transactions.Debit$) as Solde FROM transactions 
                             JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                             WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=1)')[0];
                            return response(["success" => 1, "data" => $data, "soldesearched" => $dataSoldeSearched]);
                        } else if ($request->Critere == ">=") {
                            $data = DB::select('SELECT SUM(transactions.Credit$)-SUM(transactions.Debit$) as Solde,transactions.NumCompte,comptes.NomCompte FROM transactions 
                            JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                            WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=1) 
                            AND transactions.DateTransaction BETWEEN "' . $request->DateDebut . '"  AND "' . $request->DateFin . '" GROUP BY transactions.NumCompte HAVING SUM(transactions.Credit$)-SUM(transactions.Debit$)>="' . $request->valeur . '"');

                            //RECUPERE LE SOLDE DE TOUS LE COMPTES RECHERCHER
                            $dataSoldeSearched = DB::select('SELECT SUM(transactions.Credit$)-SUM(transactions.Debit$) as Solde FROM transactions 
                             JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                             WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=1)')[0];
                            return response(["success" => 1, "data" => $data, "soldesearched" => $dataSoldeSearched]);
                        } else if ($request->Critere == "<=") {
                            $data = DB::select('SELECT SUM(transactions.Credit$)-SUM(transactions.Debit$) as Solde,transactions.NumCompte,comptes.NomCompte FROM transactions 
                            JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                            WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=1) 
                            AND transactions.DateTransaction BETWEEN "' . $request->DateDebut . '"  AND "' . $request->DateFin . '" GROUP BY transactions.NumCompte HAVING SUM(transactions.Credit$)-SUM(transactions.Debit$)<="' . $request->valeur . '"');

                            //RECUPERE LE SOLDE DE TOUS LE COMPTES RECHERCHER
                            $dataSoldeSearched = DB::select('SELECT SUM(transactions.Credit$)-SUM(transactions.Debit$) as Solde FROM transactions 
                             JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                             WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=1)')[0];
                            return response(["success" => 1, "data" => $data, "soldesearched" => $dataSoldeSearched]);
                        } else if ($request->Critere == "<>") {
                            $data = DB::select('SELECT SUM(transactions.Credit$)-SUM(transactions.Debit$) as Solde,transactions.NumCompte,comptes.NomCompte FROM transactions 
                            JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                            WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=1) 
                            AND transactions.DateTransaction BETWEEN "' . $request->DateDebut . '"  AND "' . $request->DateFin . '" GROUP BY transactions.NumCompte HAVING SUM(transactions.Credit$)-SUM(transactions.Debit$)!="' . $request->valeur . '"');

                            //RECUPERE LE SOLDE DE TOUS LE COMPTES RECHERCHER
                            $dataSoldeSearched = DB::select('SELECT SUM(transactions.Credit$)-SUM(transactions.Debit$) as Solde FROM transactions 
                             JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
                             WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=1)')[0];
                            return response(["success" => 1, "data" => $data, "soldesearched" => $dataSoldeSearched]);
                        }
                    }
                } else {
                    return response(["success" => 0, "msg" => "Le critère n'a pas été definie"]);
                }
            } else {
                return response(["success" => 0, "msg" => "Veuillez renseigner la dévise et le sous groupe de compte"]);
            }
        } else {
            return response(["success" => 0, "msg" => "Veuillez renseigner la date début et la date fin"]);
        }
    }

    public function getSommaireComptePage()
    {
        return view("sommaire-compte");
    }
}













                   
                    //RECUPERE LE SOLDE DE TOUS LE COMPTES 
            //         $dataSoldeAllCompte = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde FROM transactions 
            // JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
            // WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=2)')[0];

            //         return response(["success" => 1, "data" => $data, "soldesearched" => $dataSoldeSearched, "dataencours" => $dataSoldeAllCompte]);
            //     } else if (isset($request->Critere3) and isset($request->Critere4) and $request->Devise == "CDF") {

            //         $data = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde,transactions.NumCompte,comptes.NomCompte FROM transactions 
            //         JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
            //         WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=2) 
            //         AND (transactions.DateTransaction BETWEEN "' . $request->DateDebut . '"  AND "' . $request->DateFin . '")  GROUP BY transactions.NumCompte HAVING SUM(transactions.Creditfc)-SUM(transactions.Debitfc)="' . $request->Critere3 . '" 
            //         OR SUM(transactions.Creditfc)-SUM(transactions.Debitfc) = "' . $request->Critere4 . '"');


            //         //RECUPERE LE SOLDE DE TOUS LE COMPTES RECHERCHER
            //         $dataSoldeSearched = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde FROM transactions 
            //         JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
            //         WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=2) 
            //         AND (transactions.DateTransaction BETWEEN "' . $request->DateDebut . '"  AND "' . $request->DateFin . '")
            //         ')[0];


            //         //RECUPERE LE SOLDE DE TOUS LE COMPTES 
            //         $dataSoldeAllCompte = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde FROM transactions 
            // JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
            // WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=2)')[0];
            //         return response(["success" => 1, "data" => $data, "soldesearched" => $dataSoldeSearched, "dataencours" => $dataSoldeAllCompte]);
            //     } else if (isset($request->Critere5) and isset($request->Critere6) and $request->Devise == "CDF") {



            //         $data = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde,transactions.NumCompte,comptes.NomCompte FROM transactions 
            //         JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
            //         WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=2)
            //         AND (transactions.DateTransaction BETWEEN "' . $request->DateDebut . '"  AND "' . $request->DateFin . '")
            //           GROUP BY transactions.NumCompte HAVING SUM(transactions.Creditfc)-SUM(transactions.Debitfc)<="' . $request->Critere5 . '" 
            //         OR SUM(transactions.Creditfc)-SUM(transactions.Debitfc) >= "' . $request->Critere6 . '"');


            //         //RECUPERE LE SOLDE DE TOUS LE COMPTES RECHERCHER
            //         $dataSoldeSearched = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde FROM transactions 
            // JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
            // WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=2) 
            // AND (transactions.DateTransaction BETWEEN "' . $request->DateDebut . '"  AND "' . $request->DateFin . '")
            // ')[0];



            //         //RECUPERE LE SOLDE DE TOUS LE COMPTES 
            //         $dataSoldeAllCompte = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde FROM transactions 
            // JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
            // WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=2)')[0];
            //         return response(["success" => 1, "data" => $data, "soldesearched" => $dataSoldeSearched, "dataencours" => $dataSoldeAllCompte]);
            //         //POUR LE USD
            //     } else if (isset($request->Critere1) and isset($request->Critere2) and $request->Devise == "USD") {


            //         $data = DB::select('SELECT SUM(transactions.Credit$)-SUM(transactions.Debit$) as Solde,transactions.NumCompte,comptes.NomCompte FROM transactions 
            // JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
            // WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=1)
            // AND (transactions.DateTransaction BETWEEN "' . $request->DateDebut . '"  AND "' . $request->DateFin . '")
            // GROUP BY transactions.NumCompte HAVING SUM(transactions.Credit$)-SUM(transactions.Debit$)="' . $request->Critere1 . '" 
            // OR SUM(transactions.Credit$)-SUM(transactions.Debit$) > "' . $request->Critere2 . '"');


            //         //RECUPERE LE SOLDE DE TOUS LE COMPTES RECHERCHER
            //         $dataSoldeSearched = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde FROM transactions 
            // JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
            // WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=1)
            // AND (transactions.DateTransaction BETWEEN "' . $request->DateDebut . '"  AND "' . $request->DateFin . '")
            // ')[0];



            //         //RECUPERE LE SOLDE DE TOUS LE COMPTES 
            //         $dataSoldeAllCompte = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde FROM transactions 
            //   JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
            //   WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=1)')[0];
            //         return response(["success" => 1, "data" => $data, "soldesearched" => $dataSoldeSearched, "dataencours" => $dataSoldeAllCompte]);
            //     } else if (isset($request->Critere3) and isset($request->Critere4) and $request->Devise == "USD") {


            //         $data = DB::select('SELECT SUM(transactions.Credit$)-SUM(transactions.Debit$) as Solde,transactions.NumCompte,comptes.NomCompte FROM transactions 
            //         JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
            //         WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=1)
            //         AND (transactions.DateTransaction BETWEEN "' . $request->DateDebut . '"  AND "' . $request->DateFin . '")
            //         GROUP BY transactions.NumCompte HAVING SUM(transactions.Credit$)-SUM(transactions.Debit$)="' . $request->Critere3 . '" 
            //         OR SUM(transactions.Credit$)-SUM(transactions.Debit$) = "' . $request->Critere4 . '"');


            //         //RECUPERE LE SOLDE DE TOUS LE COMPTES RECHERCHER
            //         $dataSoldeSearched = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde FROM transactions 
            //         JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
            //         WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=1)
            //         AND (transactions.DateTransaction BETWEEN "' . $request->DateDebut . '"  AND "' . $request->DateFin . '")
            //         ')[0];


            //         //RECUPERE LE SOLDE DE TOUS LE COMPTES  ENCOURS
            //         $dataSoldeAllCompte = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde FROM transactions 
            //   JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
            //   WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=1)');
            //         return response(["success" => 1, "data" => $data, "soldesearched" => $dataSoldeSearched, "dataencours" => $dataSoldeAllCompte])[0];
            //     } else if (isset($request->Critere5) and isset($request->Critere6) and $request->Devise == "USD") {


            //         $data = DB::select('SELECT SUM(transactions.Credit$)-SUM(transactions.Debit$) as Solde,transactions.NumCompte,comptes.NomCompte FROM transactions 
            //         JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
            //         WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=1)
            //         AND (transactions.DateTransaction BETWEEN "' . $request->DateDebut . '"  AND "' . $request->DateFin . '")
            //         GROUP BY transactions.NumCompte HAVING SUM(transactions.Credit$)-SUM(transactions.Debit$)<="' . $request->Critere5 . '" 
            //         OR SUM(transactions.Credit$)-SUM(transactions.Debit$) >= "' . $request->Critere6 . '"');



            //         //RECUPERE LE SOLDE DE TOUS LE COMPTES RECHERCHER
            //         $dataSoldeSearched = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde FROM transactions 
            //   JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
            //   WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=1)
            //   AND (transactions.DateTransaction BETWEEN "' . $request->DateDebut . '"  AND "' . $request->DateFin . '")
            //  ')[0];



            //         //RECUPERE LE SOLDE DE TOUS LE COMPTES ENCOURS
            //         $dataSoldeAllCompte = DB::select('SELECT SUM(transactions.Creditfc)-SUM(transactions.Debitfc) as Solde FROM transactions 
            //   JOIN comptes ON transactions.NumCompte=comptes.NumCompte 
            //   WHERE (comptes.RefCadre="' . $request->SGCompte . '" AND transactions.CodeMonnaie=1)')[0];
            //         return response(["success" => 1, "data" => $data, "soldesearched" => $dataSoldeSearched, "dataencours" => $dataSoldeAllCompte]);
            //     }
