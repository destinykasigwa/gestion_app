<?php

namespace App\Http\Controllers;

use App\Models\Dummy;
use App\Models\Comptes;
use App\Models\BilletageCdf;
use App\Models\BilletageUsd;
use App\Models\Transactions;
use Illuminate\Http\Request;
use App\Models\Positionnement;
use App\Models\TauxJournalier;
use App\Models\CompteurDocument;
use Illuminate\Support\Facades\DB;
use App\Models\CompteurTransaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class RetraitEspeceController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }
    //FUNCTION FOR GETTING PAGE TO WITHDRAWING
    public function getPositionnement()
    {
        return view('positionnement');
    }
    //RECUPERE TOUTES LES OPERATIONS JOURNALIERE POSITIONNEES

    public function getAllPositionnement()
    {
        $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
        $dataPositionnement = Positionnement::where("DateTransaction", "=", $date)->where("NomUtilisateur", "=", Auth::user()->name)->orderBy('id', 'desc')->paginate(20)->All();

        return response()->json(["data" => $dataPositionnement]);
    }

    //FUNCTION FOR POSITION BEFORE WITHDRAWING
    public function positionnementEspece(Request $request)
    {
        $validator = validator::make($request->all(), [
            'devise' => 'required',
            'montant' => 'required|integer',
            'typeDocument' => 'required',
            'numDocument' => 'required',
            // 'numDocument' => 'required|unique:positionnements',

        ]);

        if ($validator->fails()) {
            return response()->json([
                'validate_error' => $validator->errors()
            ]);
        } else {
            $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
            //VERIFIE SI LE NUMERO DU DOCUMENT N PAS ENCORE SERVIE
            $getNumDocument = Positionnement::where("NumDocument", "=", $request->numDocument)->first();
            $getNumDocument ?  $numDocument = $getNumDocument->NumDocument : null;
            if ($getNumDocument ? $numDocument : null) {
                return response()->json(['success' => 0, 'msg' => "Ce document a été déjà servi"]);
            }



            //SI L'UTILISATEUR PREND CDF COMME DEVISE
            if ($request->devise == "CDF") {
                //ON VERIFIE QUE LE MONTANT A POSITIONNER N PAS SUPERIEUR AU SOLDE DU MEMBRE
                $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;

                if ($request->montant <= $request->soldeCDF) {
                    //ON RECUPERE LE NUMERO DE COMPTE DE FRAND DU MEMBRE
                    $getCompteMembreCDF = Transactions::where("refCompteMembre", "=", $request->refCompte)->Where("CodeMonnaie", "=", "2")->first();
                    $compteCDF = $getCompteMembreCDF->NumCompte;
                    //APRES CETTE VERIFICATION ON FAIT LE POSITIONNEMENT

                    Positionnement::create([
                        "Reference" => $request->Reference,
                        "NumCompte" => $compteCDF,
                        "Montant" => $request->montant,
                        "CodeMonnaie" => "CDF",
                        "CodeAgence" => 20,
                        "DateTransaction" =>  $date,
                        "DateTransaction" => $date,
                        "Document" => $request->typeDocument,
                        "NumDocument" => $request->numDocument,
                        "Retirant" => $request->beneficiaire,
                        "Concerne" => "Retrait",
                        "Adresse"  => $request->adresse,
                        "NumTel" => $request->telBeneficiaire,
                        "TypePieceIdentity" => $request->typepiece,
                        "NumPieceIdentity" => $request->numpiece,
                        "Proprietaire" => 1,
                        "Mandataire" => 0,
                        "NomUtilisateur"  => Auth::user()->name,
                        "Autorisateur" => $request->montant > 100000 ? 0 : null,
                        "RefCompte" => $request->refCompte
                    ]);
                    //PERMET D'INCREMENTER LA TABLE POUR LE COMPTEUR DE DOSSIER
                    CompteurDocument::create([
                        "fakenumber" => 000,
                    ]);
                    return response()->json(['success' => 1, 'msg' => "Opération bien enregistrée."]);
                } else {
                    return response()->json(['success' => 0, 'msg' => "Oooops! le solde du membre est insuffisant solde disponible." . $request->soldeCDF]);
                }
            } else if ($request->devise == "USD") {
                if ($request->montant <= $request->soldeUSD) {
                    Positionnement::create([
                        "Reference" => $request->Reference,
                        "NumCompte" => $request->numCompte,
                        "Montant" => $request->montant,
                        "CodeMonnaie" => "USD",
                        "CodeAgence" => 20,
                        "DateTransaction" =>  $date,
                        "DateTransaction" => $date,
                        "Document" => $request->typeDocument,
                        "NumDocument" => $request->numDocument,
                        "Retirant" => $request->beneficiaire,
                        "Concerne" => "Retrait",
                        "Adresse"  => $request->adresse,
                        "NumTel" => $request->telBeneficiaire,
                        "TypePieceIdentity" => $request->typepiece,
                        "NumPieceIdentity" => $request->numpiece,
                        "Proprietaire" => 1,
                        "Mandataire" => 0,
                        "NomUtilisateur"  => Auth::user()->name,
                        "Autorisateur" => $request->montant > 100000 ? 0 : null,
                        "RefCompte" => $request->refCompte
                    ]);
                } else {
                    return response()->json(['success' => 0, 'msg' => "Oooops! le solde du membre est insuffisant solde disponible." . $request->soldeUSD]);
                }

                //PERMET D'INCREMENTER LA TABLE POUR LE COMPTEUR DE DOSSIER
                CompteurDocument::create([
                    "fakenumber" => 000,
                ]);


                return response()->json(['success' => 1, 'msg' => "Opération bien enregistrée."]);
            }
        }
    }


    //FUNCTION TO WITHDRAW MONEY
    public function RetraitEspece(Request $request)
    {

        //RECUPERE LE TAUX JOURNALIER
        $tauxDuJour = TauxJournalier::orderBy('id', 'desc')->first()->TauxEnFc;


        $validator = validator::make($request->all(), [
            // 'devise' => 'required',
            // 'libelle' => 'required|max:50',
            // 'montantRetrait' => 'required',
            // 'typeDocument' => 'required',

        ]);

        if ($validator->fails()) {
            return response()->json([
                'validate_error' => $validator->errors()
            ]);
        } else {

            //VERIFIE SI LE NUMERO DU DOCUMENT N PAS ENCORE SERVIE
            $checkNumDocument = Positionnement::where("NumDocument", "=", $request->numDocument)->where("Servie", "=", 1)->first();
            $checkNumDocument ?  $numDocument = $checkNumDocument->NumDocument : null;
            if ($checkNumDocument ? $numDocument : null) {
                return response()->json(['success' => 0, 'msg' => "Ce document a été déjà servi"]);
            }




            //VERTIFIE SI LE BILLETATGE ENTREE PAR LE CAISSIER CORRESPOND AU BILLETAGE QU'IL POSSEDE DANS SA CAISSE
            if ($request->devise == "CDF") {

                //RECUPERE LA SOMME DE  BILLETAGE EN FRANC CONGOLAIS
                $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
                $billetageCDF = BilletageCdf::select(
                    DB::raw("SUM(vightMilleFranc)-SUM(vightMilleFrancSortie) as vightMilleFran"),
                    DB::raw("SUM(dixMilleFranc)-SUM(dixMilleFrancSortie) as dixMilleFran"),
                    DB::raw("SUM(cinqMilleFranc)-SUM(cinqMilleFrancSortie) as cinqMilleFran"),
                    DB::raw("SUM(milleFranc)-SUM(milleFrancSortie) as milleFran"),
                    DB::raw("SUM(cinqCentFranc)-SUM(cinqCentFrancSortie) as cinqCentFran"),
                    DB::raw("SUM(deuxCentFranc)-SUM(deuxCentFrancSortie) as deuxCentFran"),
                    DB::raw("SUM(centFranc)-SUM(centFrancSortie) as centFran"),
                    DB::raw("SUM(cinquanteFanc)-SUM(cinquanteFancSortie) as cinquanteFan"),
                )->where("NomUtilisateur", "=", Auth::user()->name)->where("DateTransaction", "=", $date)
                    ->groupBy("NomUtilisateur")
                    ->get();
                if (isset($billetageCDF[0])) {
                    if ($request->vightMille > $billetageCDF[0]->vightMilleFran) {
                        return response()->json(['success' => 0, 'msg' => "Oooops! Nombre de billet pour 20.000f non disponible vous avez " . $billetageCDF[0]->vightMilleFran . " billets dans votre caisse"]);
                    } else if ($request->dixMille > $billetageCDF[0]->dixMilleFran) {
                        return response()->json(['success' => 0, 'msg' => "Oooops! Nombre de billet pour 10.000f non disponible vous avez " . $billetageCDF[0]->dixMilleFran . " billets dans votre caisse"]);
                    } else if ($request->cinqMille > $billetageCDF[0]->cinqMilleFran) {
                        return response()->json(['success' => 0, 'msg' => "Oooops! Nombre de billet pour 5000f non disponible vous avez " . $billetageCDF[0]->cinqMilleFran . " billets dans votre caisse"]);
                    } else if ($request->milleFranc > $billetageCDF[0]->milleFran) {
                        return response()->json(['success' => 0, 'msg' => "Oooops! Nombre de billet pour 1000f non disponible vous avez " . $billetageCDF[0]->milleFran . " billets dans votre caisse"]);
                    } else if ($request->cinqCentFr > $billetageCDF[0]->cinqCentFran) {
                        return response()->json(['success' => 0, 'msg' => "Oooops! Nombre de billet pour 500f non disponible vous avez " . $billetageCDF[0]->cinqCentFran . " billets dans votre caisse"]);
                    } else if ($request->deuxCentFranc > $billetageCDF[0]->deuxCentFran) {
                        return response()->json(['success' => 0, 'msg' => "Oooops! Nombre de billet pour 200f non disponible vous avez " . $billetageCDF[0]->deuxCentFran . " billets dans votre caisse"]);
                    } else if ($request->centFranc > $billetageCDF[0]->centFran) {
                        return response()->json(['success' => 0, 'msg' => "Oooops! Nombre de billet pour 100f non disponible vous avez " . $billetageCDF[0]->centFran . " billets dans votre caisse"]);
                    } else if ($request->cinquanteFanc > $billetageCDF[0]->cinquanteFan) {
                        return response()->json(['success' => 0, 'msg' => "Oooops! Nombre de billet pour 50f non disponible vous avez " . $billetageCDF[0]->cinquanteFan . " billets dans votre caisse"]);
                    }
                } else {
                    return response()->json(['success' => 0, 'msg' => "Oooops! une erreur est survenue lors de l'éxécution de cette requête verifier bien que votre caisse est approvissionnée si l'erreur persiste veuillez contactez votre Administrateur système."]);
                }
            }

            if ($request->devise == "USD") {

                //RECUPERE LA SOMME DE BILLETAGE USD
                $date = TauxJournalier::orderBy('id', 'desc')->first()->DateTaux;
                $billetageUSD = BilletageUsd::select(
                    DB::raw("SUM(centDollars)-SUM(centDollarsSortie) as centDollar"),
                    DB::raw("SUM(cinquanteDollars)-SUM(cinquanteDollarsSortie) as cinquanteDollar"),
                    DB::raw("SUM(vightDollars)-SUM(vightDollarsSortie) as vightDollar"),
                    DB::raw("SUM(dixDollars)-SUM(dixDollarsSortie) as dixDollar"),
                    DB::raw("SUM(cinqDollars)-SUM(cinqDollarsSortie) as cinqDollar"),
                    DB::raw("SUM(unDollars)-SUM(unDollarsSortie) as unDollar"),
                )->where("NomUtilisateur", "=", Auth::user()->name)->where("DateTransaction", "=", $date)
                    ->groupBy("NomUtilisateur")
                    ->get();
                if (isset($billetageUSD[0])) {
                    if ($request->hundred > $billetageUSD[0]->centDollar) {
                        return response()->json(['success' => 0, 'msg' => "Oooops! Nombre de billet pour 100$ non disponible vous avez " . $billetageUSD[0]->centDollar . " billets dans votre caisse"]);
                    } else if ($request->fitfty > $billetageUSD[0]->cinquanteDollar) {
                        return response()->json(['success' => 0, 'msg' => "Oooops! Nombre de billet pour 50$ non disponible vous avez " . $billetageUSD[0]->cinquanteDollar . " billets dans votre caisse"]);
                    } else if ($request->twenty > $billetageUSD[0]->vightDollar) {
                        return response()->json(['success' => 0, 'msg' => "Oooops! Nombre de billet pour 20$ non disponible vous avez " . $billetageUSD[0]->vightDollar . " billets dans votre caisse"]);
                    } else if ($request->ten > $billetageUSD[0]->dixDollar) {
                        return response()->json(['success' => 0, 'msg' => "Oooops! Nombre de billet pour 10$ non disponible vous avez " . $billetageUSD[0]->dixDollar . " billets dans votre caisse"]);
                    } else if ($request->five > $billetageUSD[0]->cinqDollar) {
                        return response()->json(['success' => 0, 'msg' => "Oooops! Nombre de billet pour 5$ non disponible vous avez " . $billetageUSD[0]->cinqDollar . " billets dans votre caisse"]);
                    } else if ($request->oneDollar > $billetageUSD[0]->unDollar) {
                        return response()->json(['success' => 0, 'msg' => "Oooops! Nombre de billet pour 1$ non disponible vous avez " . $billetageUSD[0]->unDollar . " billets dans votre caisse"]);
                    }
                } else {
                    return response()->json(['success' => 0, 'msg' => "Oooops! une erreur est survenue lors de l'éxécution de cette requête verifier bien que votre caisse est approvissionnée si l'erreur persiste veuillez contactez votre Administrateur système."]);
                }
            }

            //CREE UN NUMERO DE TRANSACTION
            CompteurTransaction::create([
                'fakevalue' => "0000",
            ]);
            $numOperation = [];
            $numOperation = CompteurTransaction::latest()->first();
            $NumTransaction = Auth::user()->name[0] . Auth::user()->name[1] . "R00" . $numOperation->id;

            //RECUPERE LE COMPTE DU CAISSIER CONCERNE USD 
            $numCompteCaissierUSD = Comptes::where("NumAdherant", "=", Auth::user()->id)->where("CodeMonnaie", "=", "1")->first();
            $CompteCaissierUSD = $numCompteCaissierUSD->NumCompte;

            //RECUPERE LE COMPTE DU CAISSIER CONCERNE CDF
            $numCompteCaissierCDF = Comptes::where("NumAdherant", "=", Auth::user()->id)->where("CodeMonnaie", "=", "2")->first();
            $CompteCaissierCDF = $numCompteCaissierCDF->NumCompte;

            //  $numCompteContrePartie="5700003032202";
            //  $numCompteContrePartieUSD="5700003032201";
            if ($request->devise == "CDF") {
                //RECUPERE LE NUMERO DE COMPTE CDF DU MEMBRE CONCERNE
                $getCompteMembreCDF = Transactions::where("refCompteMembre", "=", $request->refCompte)->Where("CodeMonnaie", "=", "2")->first();
                $compteCDF = $getCompteMembreCDF->NumCompte;

                //DEBITE LE COMPTE DU MEMBRE SI C UNE OPERATION EN CDF
                Transactions::create([
                    "NumTransaction" => $NumTransaction,
                    "DateTransaction" => $request->DateTransaction,
                    "DateSaisie" => $request->DateTransaction,
                    "Taux" => 1,
                    "TypeTransaction" => "C",
                    "CodeMonnaie" => 2,
                    "CodeAgence" => "20",
                    "NumDossier" => "DOS00" . $numOperation->id,
                    "NumDemande" => "V00" . $numOperation->id,
                    "NumCompte" => $compteCDF,
                    "NumComptecp" => $CompteCaissierCDF,
                    "Debit" => $request->montantRetrait,
                    "Operant" => $request->operant,
                    "Debit$" => $request->montantRetrait / $tauxDuJour,
                    "Debitfc" => $request->montantRetrait,
                    "NomUtilisateur" => Auth::user()->name,
                    "Libelle" => $request->libelle,
                ]);
                //RECUPERE LE DERNIER ID DU L'OPERATION INSEREE
                $lastInsertedId = Transactions::latest()->first();
                //COMPLETE LE BILLETAGE

                BilletageCdf::create([
                    "refOperation" => $lastInsertedId->RéfTransaction,
                    "vightMilleFrancSortie" => $request->vightMille,
                    "dixMilleFrancSortie" => $request->dixMille,
                    "cinqMilleFrancSortie" => $request->cinqMille,
                    "milleFrancSortie" => $request->milleFranc,
                    "cinqCentFrancSortie" => $request->cinqCentFr,
                    "deuxCentFrancSortie" => $request->deuxCentFranc,
                    "centFrancSortie" => $request->centFranc,
                    "cinquanteFancSortie" => $request->cinquanteFanc,
                    "montantSortie" => $request->montantRetrait,
                    "NomUtilisateur" => Auth::user()->name,
                    "DateTransaction" => $request->DateTransaction
                ]);
                //CREDITE LE COMPTE CONTRE PARTIE  
                Dummy::create([
                    "NumTransaction" => $NumTransaction,
                    "DateTransaction" => $request->DateTransaction,
                    "DateSaisie" => $request->DateTransaction,
                    "Taux" => 1,
                    "TypeTransaction" => "C",
                    "CodeMonnaie" => 2,
                    "CodeAgence" => "20",
                    "NumDossier" => "DOS00" . $numOperation->id,
                    "NumDemande" => "V00" . $numOperation->id,
                    "NumCompte" => $CompteCaissierCDF,
                    "NumComptecp" => $compteCDF,
                    "Operant" => $request->operant,
                    "Creditfc" => $request->montantRetrait,
                    "NomUtilisateur" => Auth::user()->name,
                    "Libelle" => $request->libelle,
                ]);
            } else if ($request->devise == "USD") {
                //DEBITE LE COMPTE DU MEMBRE SI C UNE OPERATION EN USD
                Transactions::create([
                    "NumTransaction" => $NumTransaction,
                    "DateTransaction" => $request->DateTransaction,
                    "DateSaisie" => $request->DateTransaction,
                    "Taux" => 1,
                    "TypeTransaction" => "C",
                    "CodeMonnaie" => 1,
                    "CodeAgence" => "20",
                    "NumDossier" => "DOS00" . $numOperation->id,
                    "NumDemande" => "V00" . $numOperation->id,
                    "NumCompte" => $request->numCompte,
                    "NumComptecp" => $CompteCaissierUSD,
                    "Debit" => $request->montantRetrait,
                    "Operant" => $request->operant,
                    "Debit$" => $request->montantRetrait,
                    "Debitfc" => $request->montantRetrait * $tauxDuJour,
                    "NomUtilisateur" => Auth::user()->name,
                    "Libelle" => $request->libelle,
                ]);
                //RECUPERE LA DERNIER ID DU L'OPERATION INSEREE
                $lastInsertedId = Transactions::latest()->first();
                //COMPLETE LE BILLETAGE

                BilletageUsd::create([
                    "refOperation" => $lastInsertedId->RéfTransaction,
                    "centDollarsSortie" => $request->hundred,
                    "cinquanteDollarsSortie" => $request->fitfty,
                    "vightDollarsSortie" => $request->twenty,
                    "dixDollarsSortie" => $request->ten,
                    "cinqDollarsSortie" => $request->five,
                    "unDollarsSortie" => $request->oneDollar,
                    "montantSortie" => $request->montantRetrait,
                    "NomUtilisateur" => Auth::user()->name,
                    "DateTransaction" => $request->DateTransaction
                ]);
                //DEBITE LE COMPTE CONTRE PARTIE  
                Dummy::create([
                    "NumTransaction" => $NumTransaction,
                    "DateTransaction" => $request->DateTransaction,
                    "DateSaisie" => $request->DateTransaction,
                    "Taux" => 1,
                    "TypeTransaction" => "C",
                    "CodeMonnaie" => 2,
                    "CodeAgence" => "20",
                    "NumDossier" => "DOS00" . $numOperation->id,
                    "NumDemande" => "V00" . $numOperation->id,
                    "NumCompte" => $CompteCaissierUSD,
                    "NumComptecp" =>  $request->numCompte,
                    "Credit" => $request->montantRetrait,
                    "Operant" => $request->operant,
                    "Credit$" => $request->montantRetrait,
                    "Creditfc"  => $request->montantRetrait * $tauxDuJour,
                    "NomUtilisateur" => Auth::user()->name,
                    "Libelle" => $request->libelle,
                ]);
            }
        }


        //ON MET A JOUR LE NUMERO DU DOCUMENT POUR SIGNIFIER QU'IL EST DEJA SERVIE

        Positionnement::where("NumDocument", "=", $request->numDocument)->update([
            "Servie" => 1
        ]);


        return response()->json(["success" => 1, "msg" => "Opération bien enregistrée."]);
    }


    public function retrait()
    {
        return view("retrait-espece");
    }
}
