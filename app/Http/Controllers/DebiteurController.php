<?php

namespace App\Http\Controllers;

use App\Models\BilletageCdf;
use App\Models\BilletageUsd;
use App\Models\Comptes;
use App\Models\Transactions;
use Illuminate\Http\Request;
use App\Models\TauxJournalier;
use Illuminate\Support\Facades\DB;
use App\Models\CompteurTransaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class DebiteurController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    //OBTIENT LES OPERATION JOURNALIERES DU COMPTABLE
    public function getDailyOperation()
    {
        $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
        $data = Transactions::where("NomUtilisateur", "=", Auth::user()->name)
            ->where("DateTransaction", "=", $date)
            ->groupBy("NumTransaction")
            ->limit("20", "desc")
            ->get();
        return response()->json(["success" => 1, "data" => $data]);
    }

    //OBTIENT LES INFO DU COMPTE

    public function getDataCredit(Request $request)
    {
        $data = Comptes::where("NumCompte", "=", $request->compteToSearchCredit)->first();
        $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
        if ($data) {
            //VERIFIE SI LE COMPTE A DEJA E A EFFECTUER UN MOUVEMENT
            $checkAccount = Transactions::where("NumCompte", "=", $request->compteToSearchCredit)->first();
            if (!$checkAccount) {
                Transactions::create([
                    "DateTransaction" => $date,
                    "DateSaisie" => $date,
                    "NumCompte" => $request->compteToSearchCredit,
                    "Debit"  => 0,
                    "Debit$"  => 0,
                    "Debitfc" => 0,
                    "Libelle" => "Activation compte",
                ]);
            }
            if ($data->CodeMonnaie == 2) {
                //RECUPERE LE SOLDE DU MEMBRE EN FC EN CDF
                $soldeCDF = Transactions::select(
                    // DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
                    DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeCDF"),
                )->where("NumCompte", '=', $data->NumCompte)
                    ->groupBy("NumCompte")
                    ->first();
                return response()->json(["success" => 1, "data" => $data, "solde" => $soldeCDF->soldeCDF]);
            } else if ($data->CodeMonnaie == 1) {

                //RECUPERE LE SOLDE DU MEMBRE EN USD
                $soldeUSD = Transactions::select(
                    // DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
                    DB::raw("SUM(Credit$)-SUM(Debit$) as soldeUSD"),
                )->where("NumCompte", '=', $data->NumCompte)
                    ->groupBy("NumCompte")
                    ->first();

                return response()->json(["success" => 1, "data" => $data, "solde" => $soldeUSD->soldeUSD]);
            }
        } else {

            return response()->json(["success" => 0, "msg" => "Ce compte ne semble pas existé."]);
        }
    }
    //GET COMPTE DEBIT INFO
    public function getDataDebit(Request $request)
    {
        $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
        $data = Comptes::where("NumCompte", "=", $request->compteToSearchDebit)->first();
        //VERIFIE SI LE COMPTE A DEJA E A EFFECTUER UN MOUVEMENT
        $checkAccount = Transactions::where("NumCompte", "=", $request->compteToSearchDebit)->first();
        if (!$checkAccount) {
            Transactions::create([
                "DateTransaction" => $date,
                "DateSaisie" => $date,
                "NumCompte" => $request->compteToSearchDebit,
                "Debit"  => 0,
                "Debit$"  => 0,
                "Debitfc" => 0,
                "Libelle" => "Activation compte",
            ]);
        }
        if ($data) {
            if ($data->CodeMonnaie == 2) {
                //RECUPERE LE SOLDE DU MEMBRE EN FC EN CDF
                $soldeCDF = Transactions::select(
                    // DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
                    DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeCDF"),
                )->where("NumCompte", '=', $data->NumCompte)
                    ->groupBy("NumCompte")
                    ->first();
                return response()->json(["success" => 1, "data" => $data, "solde" => $soldeCDF->soldeCDF]);
            } else if ($data->CodeMonnaie == 1) {
                //RECUPERE LE SOLDE DU MEMBRE EN USD
                $soldeUSD = Transactions::select(
                    // DB::raw("SUM(Credit$)-SUM(Debit$) as soldeMembreUSD"),
                    DB::raw("SUM(Credit$)-SUM(Debit$) as soldeUSD"),
                )->where("NumCompte", '=', $data->NumCompte)
                    ->groupBy("NumCompte")
                    ->first();

                return response()->json(["success" => 1, "data" => $data, "solde" => $soldeUSD->soldeUSD]);
            }
        } else {

            return response()->json(["success" => 0, "msg" => "Ce compte ne semble pas existé."]);
        }
    }

    //PERMET D'ENREGISTRER L'OPERATION 

    public function saveDataDebit(Request $request)
    {
        $validator = validator::make($request->all(), [
            'Libelle' => 'required',
            // 'numDocument' => 'required|unique:positionnements',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => 0, "msg" => "Le libellé est obligatoire."
            ]);
        }

        //ON VERIFIE ICI SI LE COMPTE ENTRE POUR CREDIT N PAS UN COMPTE DE CHARCHE
        if (isset($request->compteToSearchCredit)) {
            $checkAcount = Comptes::where("NumCompte", "=", $request->compteToSearchCredit)->first();
            if ($checkAcount->RefTypeCompte == 6) {
                return response()->json([
                    'success' => 0, "msg" => "Le Crédit sur le compte " . $request->compteToSearchCredit . " n'est pas autorisé"
                ]);
            }
            //ON VERIFIE ICI SI LE COMPTE ENTRE POUR DEBIT N PAS UN COMPTE DE PRODUIT
        } else if (isset($request->compteToSearchDebit)) {
            $checkAcount = Comptes::where("NumCompte", "=", $request->compteToSearchDebit)->first();
            // if ($checkAcount->RefTypeCompte == 7 or $checkAcount->RefTypeCompte == 5) {
            if ($checkAcount->RefTypeCompte == 7) {
                return response()->json([
                    'success' => 0, "msg" => "Le Débit sur le compte " . $request->compteToSearchDebit . " n'est pas autorisé"
                ]);
            }
        }

        $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
        //RECUPERE LE TAUX JOURNALIER
        $tauxDuJour = TauxJournalier::orderBy('id', 'desc')->first()->TauxEnFc;
        if (isset($request->compteToSearchCredit) and isset($request->Montant) and isset($request->compteToSearchDebit)) {


            CompteurTransaction::create([
                'fakevalue' => "0000",
            ]);
            $numOperation = [];
            $numOperation = CompteurTransaction::latest()->first();
            $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;
            if ($request->CodeMonnaieCredit == 2 and $request->CodeMonnaieDebit == 2) {
                //DEBITE LE COMPTE CONCERNe
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
                    "NumCompte" => $request->compteToSearchDebit,
                    "NumComptecp" => $request->compteToSearchCredit,
                    "Operant" => $request->Operant,
                    "Debit"  => $request->Montant,
                    "Debit$"  => $request->Montant / $tauxDuJour,
                    "Debitfc" => $request->Montant,
                    "NomUtilisateur" => Auth::user()->name,
                    "Libelle" => $request->Libelle,
                ]);
                //CREDITE LE COMPTE CONCERNE
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
                    "NumCompte" =>  $request->compteToSearchCredit,
                    "NumComptecp" => $request->compteToSearchDebit,
                    "Operant" => $request->Operant,
                    "Credit"  => $request->Montant,
                    "Credit$"  => $request->Montant / $tauxDuJour,
                    "Creditfc" => $request->Montant,
                    "NomUtilisateur" => Auth::user()->name,
                    "Libelle" => $request->Libelle,
                ]);
                return response()->json(["success" => 1, "msg" => "Opération bien enregistrée merci."]);
            } else if ($request->CodeMonnaieCredit == 1 and $request->CodeMonnaieDebit == 1) {
                //DEBITE LE COMPTE CONCERNe
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
                    "NumCompte" => $request->compteToSearchDebit,
                    "NumComptecp" => $request->compteToSearchCredit,
                    "Operant" => $request->Operant,
                    "Debit"  => $request->Montant,
                    "Debit$"  => $request->Montant,
                    "Debitfc" => $request->Montant * $tauxDuJour,
                    "NomUtilisateur" => Auth::user()->name,
                    "Libelle" => $request->Libelle,
                ]);
                //CREDITE LE COMPTE CONCERNE
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
                    "NumCompte" =>  $request->compteToSearchCredit,
                    "NumComptecp" => $request->compteToSearchDebit,
                    "Operant" => $request->Operant,
                    "Credit"  => $request->Montant,
                    "Credit$"  => $request->Montant,
                    "Creditfc" => $request->Montant * $tauxDuJour,
                    "NomUtilisateur" => Auth::user()->name,
                    "Libelle" => $request->Libelle,
                ]);
                return response()->json(["success" => 1, "msg" => "Opération bien enregistrée merci."]);
            }
        } else if (isset($request->compteToSearchCredit) and isset($request->Montant) and !isset($request->compteToSearchDebit)) {
            if ($request->CodeMonnaieCredit == 2) {
                //CREDITE LE COMPTE CONCERNE

                CompteurTransaction::create([
                    'fakevalue' => "0000",
                ]);
                $numOperation = [];
                $numOperation = CompteurTransaction::latest()->first();
                $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;
                //CREDITE LE COMPTE CONCERNE
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
                    "NumCompte" =>  $request->compteToSearchCredit,
                    "NumComptecp" => "00" . $numOperation->id,
                    "Operant" => $request->Operant,
                    "Credit"  => $request->Montant,
                    "Credit$"  => $request->Montant / $tauxDuJour,
                    "Creditfc" => $request->Montant,
                    "NomUtilisateur" => Auth::user()->name,
                    "Libelle" => $request->Libelle,
                ]);
                return response()->json(["success" => 1, "msg" => "Opération bien enregistrée merci."]);
            } else if ($request->CodeMonnaieCredit == 1) {
                //DEBITE LE COMPTE CONCERNe

                CompteurTransaction::create([
                    'fakevalue' => "0000",
                ]);
                $numOperation = [];
                $numOperation = CompteurTransaction::latest()->first();
                $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;
                //DEBITE LE COMPTE CONCERNe
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
                    "NumCompte" => $request->compteToSearchCredit,
                    "NumComptecp" => "00" . $numOperation->id,
                    "Operant" => $request->Operant,
                    "Credit"  => $request->Montant,
                    "Credit$"  => $request->Montant,
                    "Creditfc" => $request->Montant * $tauxDuJour,
                    "NomUtilisateur" => Auth::user()->name,
                    "Libelle" => $request->Libelle,
                ]);
                return response()->json(["success" => 1, "msg" => "Opération bien enregistrée merci."]);
            }
        } else if (isset($request->compteToSearchDebit) and isset($request->Montant) and !isset($request->compteToSearchCredit)) {
            if ($request->CodeMonnaieDebit == 2) {
                //CREDITE LE COMPTE CONCERNE

                CompteurTransaction::create([
                    'fakevalue' => "0000",
                ]);
                $numOperation = [];
                $numOperation = CompteurTransaction::latest()->first();
                $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;
                //CREDITE LE COMPTE CONCERNE
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
                    "NumCompte" =>  $request->compteToSearchDebit,
                    "NumComptecp" => "00" . $numOperation->id,
                    "Operant" => $request->Operant,
                    "Debit"  => $request->Montant,
                    "Debit$"  => $request->Montant / $tauxDuJour,
                    "Debitfc" => $request->Montant,
                    "NomUtilisateur" => Auth::user()->name,
                    "Libelle" => $request->Libelle,
                ]);
                return response()->json(["success" => 1, "msg" => "Opération bien enregistrée merci."]);
            } else if ($request->CodeMonnaieDebit == 1) {
                //DEBITE LE COMPTE CONCERNe

                CompteurTransaction::create([
                    'fakevalue' => "0000",
                ]);
                $numOperation = [];
                $numOperation = CompteurTransaction::latest()->first();
                $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "D00" . $numOperation->id;
                //DEBITE LE COMPTE CONCERNe
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
                    "NumCompte" => $request->compteToSearchDebit,
                    "NumComptecp" => "00" . $numOperation->id,
                    "Operant" => $request->Operant,
                    "Debit"  => $request->Montant,
                    "Debit$"  => $request->Montant,
                    "Debitfc" => $request->Montant * $tauxDuJour,
                    "NomUtilisateur" => Auth::user()->name,
                    "Libelle" => $request->Libelle,
                ]);
                return response()->json(["success" => 1, "msg" => "Opération bien enregistrée merci."]);
            }
        } else {
            return response()->json(["success" => 0, "msg" => "Veuillez renseigner le numéro de compte ou le montant."]);
        }


        //PERMET DE TROUVER UNE OPERATION RECHERCHEE MOYENNANT SA REFERENCE
    }


    public function getSearchedOperation($reference)
    {
        $data = Transactions::where("NumTransaction", "=", $reference)->first();
        if ($data) {
            $data = Transactions::where("NumTransaction", "=", $reference)
                ->groupBy("NumTransaction")
                ->get();
            return response()->json(["success" => 1, "data" => $data]);
        } else {
            return response()->json(["success" => 0, "msg" => "L'opération correspondante à la référence recherchée n'a pas été trouvée."]);
        }
    }

    //PERMET D'EXTOURNER UNE OPERATION 

    public function extourneOperation($reference)
    {
        $data = Transactions::where("NumTransaction", "=", $reference)->first();
        if ($data) {
            $data = Transactions::where("NumTransaction", "=", $reference)->get();
            for ($i = 0; $i < sizeof($data); $i++) {
                if ($data[$i]->TypeTransaction == "C") {
                    //ON PASSE UNE ECRITURE CONTRAIRE CAD ON DEBITE LE COMPTE

                    Transactions::create([
                        "NumTransaction" => $data[$i]->NumTransaction,
                        "DateTransaction" => $data[$i]->DateTransaction,
                        "DateSaisie" => $data[$i]->DateSaisie,
                        "Taux" => 1,
                        "TypeTransaction" => "D",
                        "CodeMonnaie" =>  $data[$i]->CodeMonnaie,
                        "CodeAgence" => "20",
                        "NumDossier" => $data[$i]->NumDossier,
                        "NumDemande" => $data[$i]->NumDemande,
                        "NumCompte" => $data[$i]->NumCompte,
                        "NumComptecp" => $data[$i]->NumComptecp,
                        "Operant" => $data[$i]->Operant,
                        "Debit"  => $data[$i]->Credit,
                        "Debit$"  => $data[$i]->Credit,
                        "Debitfc" => $data[$i]->Creditfc,
                        "NomUtilisateur" => $data[$i]->NomUtilisateur,
                        "Libelle" => "Extournée: " . $data[$i]->Libelle,

                    ]);
                    if ($data[$i]->CodeMonnaie == 1) {
                        //CORRIGE LE BILLETAGE
                        BilletageUsd::where("refOperation", $data[$i]->RéfTransaction)->delete();
                    } else if ($data[$i]->CodeMonnaie == 2) {
                        //CORRIGE LE BILLETAGE
                        BilletageCdf::where("refOperation", $data[$i]->RéfTransaction)->delete();
                    }

                    Transactions::where("NumTransaction", "=", $data[$i]->NumTransaction)->update([
                        "extourner" => 1
                    ]);
                } else if ($data[$i]->TypeTransaction == "D") {
                    //SI C UN DEBIT ON PASSE UNE ECRITURE CONTRAIRE CAD UN CREDIT
                    Transactions::create([
                        "NumTransaction" => $data[$i]->NumTransaction,
                        "DateTransaction" => $data[$i]->DateTransaction,
                        "DateSaisie" => $data[$i]->DateSaisie,
                        "Taux" => 1,
                        "TypeTransaction" => "C",
                        "CodeMonnaie" =>  $data[$i]->CodeMonnaie,
                        "CodeAgence" => "20",
                        "NumDossier" => $data[$i]->NumDossier,
                        "NumDemande" => $data[$i]->NumDemande,
                        "NumCompte" => $data[$i]->NumCompte,
                        "NumComptecp" => $data[$i]->NumComptecp,
                        "Operant" => $data[$i]->Operant,
                        "Credit"  => $data[$i]->Debit,
                        "Credit$"  => $data[$i]->Debit,
                        "Creditfc" => $data[$i]->Debitfc,
                        "NomUtilisateur" => $data[$i]->NomUtilisateur,
                        "Libelle" => "Extournée: " . $data[$i]->Libelle,
                    ]);
                    if ($data[$i]->CodeMonnaie == 1) {
                        //CORRIGE LE BILLETAGE
                        BilletageUsd::where("refOperation", $reference)->delete();
                    } else if ($data[$i]->CodeMonnaie == 2) {
                        //CORRIGE LE BILLETAGE
                        BilletageCdf::where("refOperation", $reference)->delete();
                    }
                    Transactions::where("NumTransaction", "=", $data[$i]->NumTransaction)->update([
                        "extourner" => 1
                    ]);
                }
            }
            return response()->json(["success" => 1, "msg" => "Extourne bien effectuée"]);



            return response()->json(["success" => 1, "data" => $data]);
        } else {
            return response()->json(["success" => 0, "msg" => "Référence non trouvée."]);
        }
    }

    public function getDebiteurPage()
    {
        return view("debiteur");
    }
}
