<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Comptes;
use App\Models\Transactions;
use Illuminate\Http\Request;
use App\Models\AdhesionMembre;
use App\Models\TauxJournalier;
use App\Models\CompteurTransaction;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class updateMembre extends Controller
{
  function updatingmembre(Request $request)
  {
    try {

      $idMembre = $request->get('idMembre');
      $intituleCompte = $request->get('intituleCompte');
      $lieuNaiss = $request->get('lieuNaiss');
      $dateNaiss = $request->get('dateNaiss');
      $etatCivile = $request->get('etatCivile');
      $conjoitName = $request->get('conjoitName');
      $fatherName = $request->get('fatherName');
      $motherName = $request->get('motherName');
      $profession = $request->get('profession');
      $workingPlace = $request->get('workingPlace');
      $workingPlace = $request->get('workingPlace');
      $cilivilty = $request->get('cilivilty');
      $sexe = $request->get('sexe');
      $phone1 = $request->get('phone1');
      $phone2 = $request->get('phone2');
      $email = $request->get('email');
      $typepiece = $request->get('typepiece');
      $numpiece = $request->get('numpiece');
      $delivrancePlace = $request->get('delivrancePlace');
      $delivranceDate = $request->get('delivranceDate');
      $gestionnaire = $request->get('gestionnaire');
      $provinceOrigine = $request->get('provinceOrigine');
      $territoireOrigine = $request->get('territoireOrigine');
      $collectiviteOrigine = $request->get('collectiviteOrigine');
      $provinceActuelle = $request->get('provinceActuelle');
      $villeActuelle = $request->get('villeActuelle');
      $CommuneActuelle = $request->get('CommuneActuelle');
      $QuartierActuelle = $request->get('QuartierActuelle');
      $parainAccount = $request->get('parainAccount');
      $parainName = $request->get('parainName');
      $typeGestion = $request->get('typeGestion');
      $critere1 = $request->get('critere1');
      $otherMention = $request->get('otherMention');

      AdhesionMembre::where('refCompte', $idMembre)->update([
        "intituleCompte" => $intituleCompte,
        "lieuNaiss" => $lieuNaiss,
        "dateNaiss" => $dateNaiss,
        "etatCivile" => $etatCivile,
        "conjoitName" => $conjoitName,
        "fatherName" => $fatherName,
        "motherName" => $motherName,
        "profession" => $profession,
        "workingPlace" => $workingPlace,
        "cilivilty" => $cilivilty,
        "sexe" => $sexe,
        "phone1" => $phone1,
        "phone2" => $phone2,
        "email" => $email,
        "typepiece" => $typepiece,
        "numpiece" => $numpiece,
        "delivrancePlace" => $delivrancePlace,
        "delivranceDate" => $delivranceDate,
        "gestionnaire" => $gestionnaire,
        "provinceOrigine" => $provinceOrigine,
        "territoireOrigine" => $territoireOrigine,
        "collectiviteOrigine" => $collectiviteOrigine,
        "provinceActuelle" => $provinceActuelle,
        "villeActuelle" => $villeActuelle,
        "CommuneActuelle" => $CommuneActuelle,
        "QuartierActuelle" => $QuartierActuelle,
        "parainAccount" => $parainAccount,
        "parainName" => $parainName,
        "typeGestion" => $typeGestion,
        "critere1" => $critere1,
        "otherMention" => $otherMention,
      ]);

      return response()->json(["success" => 1, "msg" => "Le membre a bien été mise à jour !"]);
    } catch (Exception $e) {
      Log::error($e);
    }
  }
  //ACTIVATE NEW ACCOUNT
  public function activateAccount(Request $request)
  {
    $tauxDuJour = TauxJournalier::orderBy('id', 'desc')->first()->TauxEnFc;

    $refCompte = $request->get("refCompte");
    $compteEnFranc = $request->get("compteEnFranc");
    $dateOuverture = $request->get("dateOuverture");
    $devise = $request->get("devise");
    $numCompteDollars = $request->get("numCompteDollars");
    $idComptMembre = $request->get("idComptMembre");
    $compteAdhesionFC = 7480000000202;
    $compteAdhesionUSD = 7480000000201;
    // $compteCaissePrincipaleUSD=5700003032201;
    // $compteCaissePrincipaleCDF=5700003032202;
    $data = AdhesionMembre::where('numCompte', 'like', '%' . $refCompte . '%')->first();
    if ($devise == "CDF") {

      // VERIFIE QUE LE CODE N PAS ENCORE ACTIVE
      $checkCompte = Comptes::where("NumAdherant", "=", $refCompte)->where("CodeMonnaie", "=", 2)->first();
      if ($checkCompte) {
        return response()->json(["success" => 0, "msg" => "Ce compte est déjà activé en CDF"]);
      }
      CompteurTransaction::create([
        'fakevalue' => "0000",
      ]);
      $numOperation = [];
      $numOperation = CompteurTransaction::latest()->first();

      //POUR LE CDF
      //CREE LE COMPTE EN CDF
      Comptes::create([
        'CodeAgence' => 20,
        'NumCompte' => $compteEnFranc,
        'NomCompte' => $data->intituleCompte,
        'CodeMonnaie' => 2,
        'NumeTelephone' => $data->phone1,
        'DateNaissance' => $data->dateNaiss,
        'NumAdherant' => $refCompte,
      ]);
      //DEBITE LE COMPTE DU MEMBRE DU MONTANT DE FOC
      Transactions::create([
        "NumTransaction" => "FOC000" . $numOperation->id,
        "DateTransaction" => $dateOuverture,
        "DateSaisie" => $dateOuverture,
        "Taux" => 1,
        "TypeTransaction" => "D",
        "CodeMonnaie" => 2,
        "CodeAgence" => "20",
        "NumDossier" => "DOS00" . $numOperation->id,
        "NumDemande" => "V00" . $numOperation->id,
        "NumCompte" => $compteEnFranc,
        "NumComptecp" => $compteAdhesionFC,
        "Debit" => $data->critere1 == "A" ? 1000 : ($data->critere1 == "B" ? 2000 : ($data->critere1 == "C" ? 3000 : ($data->critere1 == "D" ? 5000 : $data->MontantPremiereMise))),
        "Debitfc" => $data->critere1 == "A" ? 1000 : ($data->critere1 == "B" ? 2000 : ($data->critere1 == "C" ? 3000 : ($data->critere1 == "D" ? 5000 : $data->MontantPremiereMise))),
        "Valide" => 1,
        "ValidePar" => Auth::user()->name,
        "DateValidation" => $dateOuverture,
        "refCompteMembre" => $idComptMembre,
        "Libelle" => "Frais d'ouverture de compte.",
        "Auto" => 1

      ]);
      //CREDITE LE COMPTE ADHESION EN FC

      Transactions::create([
        "NumTransaction" => "FOC000" . $numOperation->id,
        "DateTransaction" => $dateOuverture,
        "DateSaisie" => $dateOuverture,
        "Taux" => 1,
        "TypeTransaction" => "C",
        "CodeMonnaie" => 2,
        "CodeAgence" => "20",
        "NumDossier" => "DOS00" . $numOperation->id,
        "NumDemande" => "V00" . $numOperation->id,
        "NumCompte" => $compteAdhesionFC,
        "NumComptecp" =>  $compteEnFranc,
        "Credit" => $data->critere1 == "A" ? 1000 : ($data->critere1 == "B" ? 2000 : ($data->critere1 == "C" ? 3000 : ($data->critere1 == "D" ? 5000 : $data->MontantPremiereMise))),
        "Creditfc" => $data->critere1 == "A" ? 1000 : ($data->critere1 == "B" ? 2000 : ($data->critere1 == "C" ? 3000 : ($data->critere1 == "D" ? 5000 : $data->MontantPremiereMise))),
        // "Valide" => 1,
        "ValidePar" => Auth::user()->name,
        "DateValidation" => $dateOuverture,
        // "refCompteMembre" => $idComptMembre,
        "Libelle" => "Frais d'ouverture de compte.",
        "Auto" => 1

      ]);
    } else if ($devise == "USD") {
      $checkCompte = Comptes::where("NumAdherant", "=", $refCompte)->where("CodeMonnaie", "=", 1)->first();
      if ($checkCompte) {
        return response()->json(["success" => 0, "msg" => "Ce compte est déjà activé en USD"]);
      }
      CompteurTransaction::create([
        'fakevalue' => "0000",
      ]);
      $numOperation = [];
      $numOperation = CompteurTransaction::latest()->first();
      //CREE LE COMPTE EN USD
      Comptes::create([
        'CodeAgence' => 20,
        'NumCompte' => $numCompteDollars,
        'NomCompte' => $data->intituleCompte,
        'CodeMonnaie' => 1,
        'NumeTelephone' => $data->phone1,
        'DateNaissance' => $data->dateNaiss,
        'NumAdherant' => $refCompte,
      ]);

      Transactions::create([
        "NumTransaction" => "FOC000" . $numOperation->id,
        "DateTransaction" => $dateOuverture,
        "DateSaisie" => $dateOuverture,
        "Taux" => 1,
        "TypeTransaction" => "D",
        "CodeMonnaie" => 1,
        "CodeAgence" => "20",
        "NumDossier" => "DOS00" . $numOperation->id,
        "NumDemande" => "V00" . $numOperation->id,
        "NumCompte" => $numCompteDollars,
        "NumComptecp" => $compteAdhesionUSD,
        "Debit" => $data->critere1 == "A" ? 5 : ($data->critere1 == "B" ? 10 : ($data->critere1 == "C" ? 20 : ($data->critere1 == "D" ? 50 : $data->MontantPremiereMise / $tauxDuJour))),
        "Debit$" => $data->critere1 == "A" ? 5 : ($data->critere1 == "B" ? 10 : ($data->critere1 == "C" ? 20 : ($data->critere1 == "D" ? 50 : $data->MontantPremiereMise / $tauxDuJour))),
        "Valide" => 1,
        "ValidePar" => Auth::user()->name,
        "DateValidation" => $dateOuverture,
        // "refCompteMembre" => $idComptMembre,
        "Libelle" => "Frais d'ouverture de compte.",
        "Auto" => 1
      ]);

      //CREDITE LE COMPTE ADHESION EN USD

      Transactions::create([
        "NumTransaction" => "FOC000" . $numOperation->id,
        "DateTransaction" => $dateOuverture,
        "DateSaisie" => $dateOuverture,
        "Taux" => 1,
        "TypeTransaction" => "C",
        "CodeMonnaie" => 1,
        "CodeAgence" => "20",
        "NumDossier" => "DOS00" . $numOperation->id,
        "NumDemande" => "V00" . $numOperation->id,
        "NumCompte" => $compteAdhesionUSD,
        "NumComptecp" => $numCompteDollars,
        "Credit" => $data->critere1 == "A" ? 5 : ($data->critere1 == "B" ? 10 : ($data->critere1 == "C" ? 20 : ($data->critere1 == "D" ? 50 : $data->MontantPremiereMise / $tauxDuJour))),
        "Credit$" => $data->critere1 == "A" ? 5 : ($data->critere1 == "B" ? 10 : ($data->critere1 == "C" ? 20 : ($data->critere1 == "D" ? 50 : $data->MontantPremiereMise / $tauxDuJour))),
        // "Valide" => 1,
        "ValidePar" => Auth::user()->name,
        "DateValidation" => $dateOuverture,
        // "refCompteMembre" => $idComptMembre,
        "Libelle" => "Frais d'ouverture de compte.",
        "Auto" => 1
      ]);
    }

    return response()->json(["success" => 1, "msg" => "Le compte a bien été activé"]);
  }

  public function activatedAccount($id)
  {
    $data = Comptes::where('comptes.NumAdherant', '=', $id)->get();
    return response()->json(["success" => 1, "data" => $data]);
  }



  public function uploadphoto(Request $request)
  {
    try {
      $idMembre = $request->get('idMembre');
      //  $uploaded_image=$request->get('uploaded_image');

      if ($request->hasFile('uploaded_image')) {
        $file = $request->file('uploaded_image');
        $extension = $file->getClientOriginalExtension();
        $filename = time() . '.' . $extension;
        $file->move('uploads/membres/', $filename);
        $uploaded_image = $filename;
      }
      AdhesionMembre::where('refCompte', $idMembre)->update([
        "photoMembre" => $uploaded_image,
      ]);
    } catch (Exception $e) {
      Log::error($e);
    }

    return response()->json(["success" => 1, "msg" => "Compte mise à jour avec succès."]);
  }
}
