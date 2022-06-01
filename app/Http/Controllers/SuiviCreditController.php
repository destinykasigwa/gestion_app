<?php

namespace App\Http\Controllers;

use App\Models\Comptes;
use App\Models\CompteurDossierCredit;
use App\Models\Garantie;
use App\Models\Portefeuille;
use Illuminate\Http\Request;

class SuiviCreditController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }
    //RECUPERE LES INFORMATIONS RELATIVES A UN COMPTE RECHERCHE

    public function getInfoCompte($id)
    {
        $data = Comptes::where("NumAdherant", "=", $id)->first();
        $data2 = Portefeuille::where("NumCompteEpargne", "=", $data->NumCompte)->first();
        if ($data) {
            return response()->json(["success" => 1, "data" => $data, "data2" => $data2]);
        } else {
            return response()->json(["success" => 0, "msg" => "Aucun numéro de compte trouvé"]);
        }
    }

    //ENREGISTRE UN NOUVEL MONTAGE DE CREDIT

    public function saveNewMontageCredit(Request $request)
    {
        Portefeuille::create([
            "RefTypeCredit" =>  $request->RefTypeCredit,
            "RefProduitCredit" => $request->RefProduitCredit,
            "CodeAgence" => $request->CodeAgence,
            "CodeGuichet" => $request->CodeGuichet,
            "DateDemande" => $request->DateDemande,
            "DateOctroi" => $request->DateOctroi,
            "DateEcheance" => $request->DateEcheance,
            "DateTranche" => $request->DateTranche,
            "NbrTranche" => $request->NbrTranche,
            "NumCompteEpargne" => $request->NumCompteEpargne,
            "NumCompteCredit" => $request->NumCompteCredit,
            "NomCompte" => $request->NomCompte,
            "Duree" => $request->Duree,
            "Dufferee" => $request->Dufferee,
            "Grace" => $request->Grace,
            "NumDossier" => $request->NumDossier,
            "NumDemande" => $request->NumDemande,
            "MontantDemande" => $request->MontantDemande,
            "ObjeFinance" => $request->ObjeFinance,
            "MontantAccorde" => $request->MontantAccorde,
            "Decision" => $request->Decision,
            "Motivation" => $request->Motivation,
            "CodeMonnaie" => $request->CodeMonnaie,
            "Interval" => $request->Interval,
            "ModeRemboursement" => $request->ModeRemboursement,
            "TauxInteret" => $request->TauxInteret,
            "CompteInteret" => $request->CompteInteret,
            "TauxInteretRetard" => $request->TauxInteretRetard,
            "CompteInteretRetard" => $request->CompteInteretRetard,
            "InteretRetardIn" => $request->InteretRetardIn,
            "InteretCalcule" => $request->InteretCalcule,
            "TotCumule" => $request->TotCumule,
            "RemboursCapitalIn" => $request->RemboursCapitalIn,
            "RemboursInteretIn" => $request->RemboursInteretIn,
            "InteretSpotIn" => $request->InteretSpotIn,
            "RemboursEparneProgr" => $request->RemboursEparneProgr,
            "RemboursInteretRetarIn" => $request->RemboursInteretRetarIn,
            "RemboursCapital" => $request->RemboursCapital,
            "RemboursInteret" => $request->RemboursInteret,
            "RemboursEpargneProgr" => $request->RemboursEpargneProgr,
            "RemboursInteretRetard" => $request->RemboursInteretRetard,
            "CapitalRestant" => $request->CapitalRestant,
            "InteretRestant" => $request->InteretRestant,
            "CapitalEchu" => $request->CapitalEchu,
            "EpargneEchu" => $request->EpargneEchu,
            "InteretEchu" => $request->InteretEchu,
            "InteretRetardEchu" => $request->InteretRetardEchu,
            "CapitalDu" => $request->CapitalDu,
            "InteretDu" => $request->InteretDu,
            "EpargneDu" => $request->EpargneDu,
            "AvanceInteret" => $request->AvanceInteret,
            "NonEchu" => $request->NonEchu,
            "PourcentageProvision" => $request->PourcentageProvision,
            "JourRetard" => $request->JourRetard,
            "SourceFinancement" => $request->SourceFinancement,
            "Gestionnaire" => $request->Gestionnaire,
            "Octroye" => $request->Octroye,
            "numAdherant" => $request->numAdherant,
            "NumMensualite" => $request->NumMensualite,
            "FraisEtudeDossier" => $request->FraisEtudeDossier,
            "CompteEtudeDossier" => $request->CompteEtudeDossier,
            "FraisCommission" => $request->FraisCommission,
            "CompteCommission" => $request->CompteCommission,
            "Animateur" => $request->Animateur,
            "Accorde" => $request->Accorde,
            "AccordePar" => $request->AccordePar,
            "OctroyePar" => $request->OctroyePar,
            "DateTombeEcheance" => $request->DateTombeEcheance,
            "NomUtilisateur" => $request->NomUtilisateur,
            "Cloture" => $request->Cloture,
            "CloturePar" => $request->CloturePar,
            "DateCloture" => $request->DateCloture,
            "Radie" => $request->Radie,
            "CapitalRadie" => $request->CapitalRadie,
            "InteretRadie" => $request->InteretRadie,
            "DateRadiation" => $request->DateRadiation,
            "NumCompteHB" => $request->NumCompteHB,
            "MontantRadie" => $request->MontantRadie,
            "Spot" => $request->Spot,
            "Anticipation" => $request->Anticipation,
            "Reechelonne" => $request->Reechelonne,
            "DateReechellonement" => $request->DateReechellonement,
            "MontantReechelonne" => $request->MontantReechelonne,
            "NbrTrancheReechellonne" => $request->NbrTrancheReechellonne,
            "DureeReechellone" => $request->DureeReechellone,
            'GroupeSolidaire' => $request->GroupeSolidaire,
            'Cyclable' => $request->Cyclable,
            'Cycle' => $request->Cycle,
            'RefMode' => $request->RefMode,
            'TrancheDecalage' => $request->TrancheDecalage,
            'PeriodiciteDecalage' => $request->PeriodiciteDecalage,
            'DureeDecalage' => $request->DureeDecalage,
            'DateDecale' => $request->DateDecale,
            'TypeGarantie' => $request->DescriptionGarantie,
        ]);

        Garantie::create([
            "NumDossier" => $request->NumDossier,
            "NumCompte" => $request->NumCompteEpargne,
            "DescriptionGarantie" => $request->DescriptionGarantie,
        ]);

        CompteurDossierCredit::create([
            "refDossier" => "ND0000",
        ]);

        return response()->json(["success" => 1, "msg" => "Le montage du crédit s'est passé avec succès."]);
    }





    //RECUPERE UN NOUVEL NUMERO DOSSIER POUR UN NOUVEAU CREDIT
    public function getNewDossierNumber()
    {
        $numDossier = CompteurDossierCredit::latest()->first()->id;
        return response()->json(["lastid" => $numDossier]);
    }


    //MET A JOUR UN CREDIT QUI A ETE MONTE

    public function upDateCredit(Request $request)
    {

        Portefeuille::where("NumDossier", "=", $request->NumDossier)->update([
            "RefTypeCredit" => $request->RefTypeCredit,
            "RefProduitCredit" => $request->RefProduitCredit,
            "MontantDemande" => $request->MontantDemande,
            "ObjeFinance" => $request->ObjeFinance,
            "Motivation" => $request->Motivation,
            "ModeRemboursement" => $request->ModeRemboursement,
            "TauxInteret" => $request->TauxInteret,
            "DateDemande" => $request->DateDemande,
            "NbrTranche" => $request->NbrTranche,
            "Cycle" => $request->Cycle,
            "Duree" => $request->Duree,
            "CodeMonnaie" => $request->CodeMonnaie,
            "Gestionnaire" => $request->Gestionnaire,
        ]);

        return response()->json(["success" => 1, "msg" => "Ce crédit a bien été mis à jour."]);
    }


    public function getSuiviCreditPage()
    {
        return view('suivicredit');
    }
}
