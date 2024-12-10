<?php

namespace App\Http\Controllers;

use App\Models\Comptes;
use App\Models\Transactions;
use Illuminate\Http\Request;
use App\Models\TauxJournalier;
use App\Models\CompteurTransaction;
use Illuminate\Support\Facades\Auth;

class ComptabiliteController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }

    public function getComptesCharge()
    {
        $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
        //RECUPERE TOUS LES COMPTES DE CHARGES

        $dataChargeCDF = Comptes::where("RefTypeCompte", "=", 6)->where("CodeMonnaie", "=", 2)->get();
        $dataChargeUSD = Comptes::where("RefTypeCompte", "=", 6)->where("CodeMonnaie", "=", 1)->get();

        //RECUPERE TOUS LES COMPTES DE PRODUIT
        $dataProduitCDF = Comptes::where("RefTypeCompte", "=", 7)->where("CodeMonnaie", "=", 2)->get();
        $dataProduitUSD = Comptes::where("RefTypeCompte", "=", 7)->where("CodeMonnaie", "=", 1)->get();
        //RECUPERE LES COMPTES CREE

        $dataCompte = Comptes::where("DateOuverture", "=", $date)->get();

        return response()->json(["success" => 1, "dataChargeCDF" => $dataChargeCDF, "dataChargeUSD" => $dataChargeUSD, "dataProduitCDF" => $dataProduitCDF, "dataProduitUSD" => $dataProduitUSD, "dataCompte" => $dataCompte]);
    }

    //PERMET DE PASSE UNE ECRITURE COMPTABLE DE DEBIT

    public function saveDataDebit(Request $request)
    {
        if (isset($request->DeviseDebit)) {
            if (isset($request->compteDebit) and isset($request->LibelleDebit) and isset($request->MontantDebit)) {

                $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
                //RECUPERE LE TAUX JOURNALIER
                $tauxDuJour = TauxJournalier::orderBy('id', 'desc')->first()->TauxEnFc;

                //DEBITE LE CONCERNE CONCERNE
                if ($request->DeviseDebit == "CDF") {
                    $data = Comptes::where("NomCompte", "=", $request->compteDebit)->where("CodeMonnaie", "=", 2)->first();
                    $NumCompte =  $data->NumCompte;
                    //RECUPERE LE COMPTE DU CAISSIER CONCERNE CDF
                    $numCompteCaissePrincipaleCDF = "5700000000202";
                    CompteurTransaction::create([
                        'fakevalue' => "0000",
                    ]);
                    $numOperation = [];
                    $numOperation = CompteurTransaction::latest()->first();
                    $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "Taux" => 1,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $NumCompte,
                        "NumComptecp" => $numCompteCaissePrincipaleCDF,
                        "Operant" => $request->compteDebit,
                        "Reduction" => $request->MontantDebit,
                        "Debit"  => $request->MontantDebit,
                        "Debit$"  => $request->MontantDebit / $tauxDuJour,
                        "Debitfc" => $request->MontantDebit,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => $request->LibelleDebit,
                    ]);

                    //CREDITE LE COMPTE CAISSE


                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "Taux" => 1,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $numCompteCaissePrincipaleCDF,
                        "NumComptecp" =>  $NumCompte,
                        "Operant" => "CAISSE PRINCIPALE FC",
                        "Reduction" => $request->MontantDebit,
                        "Credit"  => $request->MontantDebit,
                        "Credit$"  => $request->MontantDebit / $tauxDuJour,
                        "Creditfc" => $request->MontantDebit,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => $request->LibelleDebit,
                    ]);
                } else if ($request->DeviseDebit == "USD") {
                    $data = Comptes::where("NomCompte", "=", $request->compteDebit)->where("CodeMonnaie", "=", 1)->first();
                    $NumCompte =  $data->NumCompte;
                    //RECUPERE LE COMPTE CAISSE PRINCIPALE USD
                    $numCompteCaissePrincipaleCDF = "5700000000201";
                    CompteurTransaction::create([
                        'fakevalue' => "0000",
                    ]);
                    $numOperation = [];
                    $numOperation = CompteurTransaction::latest()->first();
                    $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "Taux" => 1,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $NumCompte,
                        "NumComptecp" => $numCompteCaissePrincipaleCDF,
                        "Operant" => $request->compteDebit,
                        "Reduction" => $request->MontantDebit,
                        "Debit"  => $request->MontantDebit,
                        "Debit$"  => $request->MontantDebit,
                        "Debitfc" => $request->MontantDebit * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => $request->LibelleDebit,
                    ]);

                    //CREDITE LE COMPTE CAISSE


                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "Taux" => 1,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $numCompteCaissePrincipaleCDF,
                        "NumComptecp" =>  $NumCompte,
                        "Operant" => "CAISSE PRINCIPALE USD",
                        "Reduction" => $request->MontantDebit,
                        "Credit"  => $request->MontantDebit,
                        "Credit$"  => $request->MontantDebit,
                        "Creditfc" => $request->MontantDebit * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => $request->LibelleDebit,
                    ]);
                }
                return response()->json(["success" => 1, "msg" => "Débit bien effectué merci."]);
            } else {
                return response()->json(["success" => 0, "msg" => "Veuillez renseigner les 3 champs svp."]);
            }
        } else {
            return response()->json(["success" => 0, "msg" => "Veuillez renseigner la dévise avant de continuer."]);
        }
    }

    //PERMET DE PASSER UNE ECRITURE COMPTABLE CREDIT

    public function saveDataCredit(Request $request)
    {
        if (isset($request->DeviseCredit)) {
            if (isset($request->compteCredit) and isset($request->LibelleCredit) and isset($request->MontantCredit)) {

                $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
                //RECUPERE LE TAUX JOURNALIER
                $tauxDuJour = TauxJournalier::orderBy('id', 'desc')->first()->TauxEnFc;

                //DEBITE LE CONCERNE CONCERNE
                if ($request->DeviseCredit == "CDF") {
                    $data = Comptes::where("NomCompte", "=", $request->compteCredit)->where("CodeMonnaie", "=", 2)->first();
                    $NumCompte =  $data->NumCompte;
                    //RECUPERE LE COMPTE DU CAISSIER CONCERNE CDF
                    $numCompteCaissePrincipaleCDF = "5700000000202";
                    CompteurTransaction::create([
                        'fakevalue' => "0000",
                    ]);
                    $numOperation = [];
                    $numOperation = CompteurTransaction::latest()->first();
                    $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "Taux" => 1,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $NumCompte,
                        "NumComptecp" => $numCompteCaissePrincipaleCDF,
                        "Operant" => $request->compteCredit,
                        "Credit"  => $request->MontantCredit,
                        "Credit$"  => $request->MontantCredit / $tauxDuJour,
                        "Creditfc" => $request->MontantCredit,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => $request->LibelleCredit,
                    ]);

                    //DEBITE LE COMPTE CAISSE


                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "Taux" => 1,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 2,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $numCompteCaissePrincipaleCDF,
                        "NumComptecp" =>  $NumCompte,
                        "Operant" => "CAISSE PRINCIPALE FC",
                        "Debit"  => $request->MontantCredit,
                        "Debit$"  => $request->MontantCredit / $tauxDuJour,
                        "Debitfc" => $request->MontantCredit,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => $request->LibelleCredit,
                    ]);
                } else if ($request->DeviseCredit == "USD") {
                    $data = Comptes::where("NomCompte", "=", $request->compteCredit)->where("CodeMonnaie", "=", 1)->first();
                    $NumCompte =  $data->NumCompte;
                    //RECUPERE LE COMPTE CAISSE PRINCIPALE USD
                    $numCompteCaissePrincipaleCDF = "5700000000201";
                    CompteurTransaction::create([
                        'fakevalue' => "0000",
                    ]);
                    $numOperation = [];
                    $numOperation = CompteurTransaction::latest()->first();
                    $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;
                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "Taux" => 1,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $NumCompte,
                        "NumComptecp" => $numCompteCaissePrincipaleCDF,
                        "Operant" => $request->compteCredit,
                        "Credit"  => $request->MontantCredit,
                        "Credit$"  => $request->MontantCredit,
                        "Creditfc" => $request->MontantCredit * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => $request->LibelleCredit,
                    ]);

                    //CREDITE LE COMPTE CAISSE


                    Transactions::create([
                        "NumTransaction" => $NumTransaction,
                        "DateTransaction" => $date,
                        "DateSaisie" => $date,
                        "Taux" => 1,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" => 1,
                        "CodeAgence" => "20",
                        "NumDossier" => "DOS00" . $numOperation->id,
                        "NumDemande" => "V00" . $numOperation->id,
                        "NumCompte" => $numCompteCaissePrincipaleCDF,
                        "NumComptecp" =>  $NumCompte,
                        "Operant" => "CAISSE PRINCIPALE USD",
                        "Debit"  => $request->MontantCredit,
                        "Debit$"  => $request->MontantCredit,
                        "Debitfc" => $request->MontantCredit * $tauxDuJour,
                        "NomUtilisateur" => Auth::user()->name,
                        "Libelle" => $request->LibelleCredit,
                    ]);
                }
                return response()->json(["success" => 1, "msg" => "Crédit bien effectué merci."]);
            } else {
                return response()->json(["success" => 0, "msg" => "Veuillez renseigner les 3 champs svp."]);
            }
        } else {
            return response()->json(["success" => 0, "msg" => "Veuillez renseigner la dévise avant de continuer."]);
        }
    }

    //RECUPERE TOUTES LES OPERATION DE CHARGE JOURNALIER EFFECTUEES
    public function getDailyOperationCharge()
    {
        $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
        $data = Transactions::where("transactions.NomUtilisateur", "=", Auth::user()->name)
            // ->join("comptes", "transactions.NumCompte", "=", "comptes.NumCompte")
            ->where("transactions.DateTransaction", "=", $date)
            // ->where("comptes.RefTypeCompte", "=", 6)
            ->where("transactions.TypeTransaction", "=", "D")
            ->groupBy("transactions.NumTransaction")
            ->limit("10", "desc")
            ->get();

        $data2 = Transactions::where("transactions.NomUtilisateur", "=", Auth::user()->name)
            // ->join("comptes", "transactions.NumCompte", "=", "comptes.NumCompte")
            ->where("transactions.DateTransaction", "=", $date)
            ->where("transactions.TypeTransaction", "=", "C")
            ->groupBy("transactions.NumTransaction")
            ->limit("10", "desc")
            ->get();
        return response()->json(["success" => 1, "data" => $data, "dataProduit" => $data2]);
    }


    public function saveNewAccount(Request $request)
    {
        $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
        if (isset($request->IntituleCompteNew) and isset($request->RefSousGroupe) and isset($request->RefCadre) and isset($request->RefTypeCompte) and isset($request->RefGroupe)) {
            //VERIFIE SI LE COMPTE N'EXISTE PAS ENCORE
            $checkCompteExist = Comptes::where("RefSousGroupe", "=", $request->RefSousGroupe)->first();
            if (!$checkCompteExist) {
                //CREE LE COMPTE EN USD
                Comptes::create([
                    "NumCompte" => $request->RefSousGroupe . "201",
                    "NomCompte" => $request->IntituleCompteNew,
                    "RefTypeCompte" => $request->RefTypeCompte,
                    "RefCadre" => $request->RefCadre,
                    "RefGroupe" => $request->RefGroupe,
                    "RefSousGroupe" => $request->RefSousGroupe,
                    "CodeMonnaie" => 1,
                    "DateOuverture" => $date,
                    "NumAdherant" => $request->RefSousGroupe . "201",
                ]);

                //CREE LE COMPTE EN cdf
                Comptes::create([
                    "NumCompte" => $request->RefSousGroupe . "202",
                    "NomCompte" => $request->IntituleCompteNew,
                    "RefTypeCompte" => $request->RefTypeCompte,
                    "RefCadre" => $request->RefCadre,
                    "RefGroupe" => $request->RefGroupe,
                    "RefSousGroupe" => $request->RefSousGroupe,
                    "CodeMonnaie" => 2,
                    "DateOuverture" => $date,
                    "NumAdherant" => $request->RefSousGroupe . "202",
                ]);
                //CDF
                Transactions::create([
                    "DateTransaction" => $date,
                    "CodeMonnaie" => 2,
                    "NumCompte" => $request->RefSousGroupe . "202",
                    "Debit"  => 0,
                    "Debit$"  => 0,
                    "Debitfc" => 0,
                ]);

                //USD
                Transactions::create([
                    "DateTransaction" => $date,
                    "CodeMonnaie" => 1,
                    "NumCompte" => $request->RefSousGroupe . "201",
                    "Debit"  => 0,
                    "Debit$"  => 0,
                    "Debitfc" => 0,
                ]);
            } else {
                return response()->json(["success" => 0, "msg" => "Ce compte est déjà crée merci..."]);
            }

            return response()->json(["success" => 1, "msg" => "Le compte " . $request->RefSousGroupe . "202" . " CDF " . " et " . "" . $request->RefSousGroupe . "201" . " USD bien ajoutés merci..."]);
        } else {
            return response()->json(["success" => 0, "msg" => "Les veuillez completer tous le champs..."]);
        }
    }

    public function getComptabilitePage()
    {
        return view('comptabilite');
    }
}
