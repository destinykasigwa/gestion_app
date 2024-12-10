<?php

namespace App\Http\Controllers;

use App\Models\AdhesionMembre;
use App\Models\Comptes;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserInfoController extends Controller
{
    public function __construct()
    {
        $this->middleware("auth");
    }

    public function getUserRole()
    {
        $userRole = Auth::user()->Role;
        $getAllRole = User::where("id", "=", Auth::user()->id);
        //CHECK IF THE ACCOUNT USER EXIST
        $checkIfUserExist = AdhesionMembre::where("UserID", "=", Auth::user()->id)->first();
        if ($checkIfUserExist) {
            $NumAdherant = $checkIfUserExist->compteAbrege;
        } else {
            $NumAdherant = null;
        }


        $nombreMois = 12;
        // $NewDate1 = date('Y-m-d', strtotime("-" . $nombreMois . "month"));
        $NewDate1  = date('Y') . '-01-01';
        $NewDate2 = date("Y-m-d");
        return response(["Role" => $userRole, "NumAdherant" =>  $NumAdherant, "defaultDate1" => $NewDate1, "defaultDate2" => $NewDate2, "getAllRole" => $getAllRole]);
    }


    //PERMET DE RECUPERER LES INFORMATIONS D'UN UTILISATEUR SPECIFIQUE

    public function getUserR($item)
    {
        $data = User::where("name", "LIKE", '%' . $item . '%')->get();
        $dataCompte = AdhesionMembre::where("intituleCompte", "LIKE", '%' . $item . '%')->get();
        if (count($data) != 0) {
            return response()->json(["success" => 1, "data" => $data, "data2" => $dataCompte]);
        } else {
            return response()->json(["success" => 0, "msg" => "Aucun élément trouvé"]);
        }
    }

    //PERMET DE RECUPERER LES INFORMATIONS D'UN MEMBRE SPECIFIQUE

    public function getMembreR($item)
    {

        $dataCompte = AdhesionMembre::where("compteAbrege", "=", $item)->get();
        if (count($dataCompte) != 0) {
            return response()->json(["success" => 1, "data2" => $dataCompte]);
        } else {
            return response()->json(["success" => 0, "msg" => "Aucun élément trouvé"]);
        }
    }


    public function lockUser($item)
    {
        if (isset($item)) {
            $reqGetUserInfo = User::where("id", "=", $item)->first();
            if ($reqGetUserInfo->locked == 1) {
                User::where("id", "=", $item)->update([
                    "locked" => 0
                ]);
                return response()->json(["success" => 1, "msg" => "C'est utilisateur a été débloqué"]);
            } else if ($reqGetUserInfo->locked == 0) {
                User::where("id", "=", $item)->update([
                    "locked" => 1
                ]);
                return response()->json(["success" => 1, "msg" => "C'est utilisateur a été bloqué"]);
            }
        }
    }

    public function makeAdmin($item)
    {
        if (isset($item)) {
            $reqGetUserInfo = User::where("id", "=", $item)->first();
            if ($reqGetUserInfo->Role == 1) {
                User::where("id", "=", $item)->update([
                    "Role" => 0
                ]);
                return response()->json(["success" => 1, "msg" => "L'habilitation admin a été retirée à cet utilisateur."]);
            } else if ($reqGetUserInfo->Role == 0) {
                User::where("id", "=", $item)->update([
                    "Role" => 1
                ]);
                return response()->json(["success" => 1, "msg" => "C'est utilisateur a été rendu Admin."]);
            }
        }
    }

    //PERMET DE RENDRE UN UTILISATEUR AGENT DE CREDIT

    public function makeAgentCredit($item)
    {
        $reqGetUserInfo = User::where("id", "=", $item)->first();
        if ($reqGetUserInfo->agentCredit == 1) {
            User::where("id", "=", $item)->update([
                "agentCredit" => 0
            ]);
            return response()->json(["success" => 1, "msg" => "L'habilitation d'agent de crédit a été rétirée à cet utilisateur merci."]);
        } else if ($reqGetUserInfo->agentCredit == 0) {
            User::where("id", "=", $item)->update([
                "agentCredit" => 1
            ]);
            return response()->json(["success" => 1, "msg" => "L'habilitation d'agent de crédit a été accordée à cet utilisateur merci."]);
        }
    }

    //PERMET DE RENDRE UN UTILISATEUR CAISSIER

    public function makeCaissier($item)
    {
        $reqGetUserInfo = User::where("id", "=", $item)->first();
        if ($reqGetUserInfo->caissier == 1) {
            User::where("id", "=", $item)->update([
                "caissier" => 0
            ]);
            return response()->json(["success" => 1, "msg" => "L'habilitation de caissier a été rétirée à cet utilisateur merci."]);
        } else if ($reqGetUserInfo->caissier == 0) {
            User::where("id", "=", $item)->update([
                "caissier" => 1

            ]);
            return response()->json(["success" => 1, "msg" => "L'habilitation de caissier a été accordée à cet utilisateur merci."]);
        }
    }

    public function linkUser(Request $request)
    {
        if (isset($request->userId)) {
            //Check if user id exist
            $chechUserId = User::where("id", "=", $request->userId)->first();
            if ($chechUserId) {
                AdhesionMembre::where("compteAbrege", "=", $request->NumAdherant)->update([
                    "UserID" => $request->userId
                ]);
                return response(["success" => 1, "msg" => "Opération réussie"]);
            } else {
                return response(["success" => 0, "msg" => "Aucun utilisateur n'est associé à cet ID"]);
            }
        } else {
            return response(["success" => 0, "msg" => "Veuillez rensigner l'identifiant d'utilisateur."]);
        }
    }


    // CREE UN COMPTE CAISSIER

    public function createCaissierAccount($item)
    {
        //CHECK IF ACCOUNT ALREADY EXIST

        $checkCompteExist =  Comptes::where('caissierId', "=", $item)->first();
        if (!$checkCompteExist) {
            //GET USER NAME
            $dataCaissier = User::where("id", "=", $item)->first();
            $numCompteCaisseCDF = "57000" . $item . "202";
            $numCompteCaisseUSD = "57000" . $item . "201";
            //CREE LE COMPTE EN CDF
            Comptes::create([
                'CodeAgence' => 20,
                'NumCompte' => $numCompteCaisseCDF,
                'NomCompte' => "CAISSE " . $dataCaissier->name . " CDF",
                "RefTypeCompte" => 5,
                "RefCadre" => 57,
                "RefGroupe" => 570,
                "RefSousGroupe" => 5700,
                'CodeMonnaie' => 2,
                'NumAdherant' => $numCompteCaisseCDF,
                'isCaissier'  => 1,
                'caissierId' => $item,
            ]);

            //CREE LE COMPTE EN USD
            Comptes::create([
                'CodeAgence' => 20,
                'NumCompte' => $numCompteCaisseUSD,
                'NomCompte' => "CAISSE " . $dataCaissier->name . " USD",
                'CodeMonnaie' => 1,
                'NumAdherant' => $numCompteCaisseUSD,
                'isCaissier'  => 1,
                'caissierId' => $item,
            ]);

            //updated user

            User::where("id", "=", $item)->update([
                'compteCaissier' => 1
            ]);

            return response(["success" => 1, "msg" => "Compte bien crée." . "Num CDF " . $numCompteCaisseCDF . " Num USD " . $numCompteCaisseUSD]);
        } else {
            return response(["success" => 0, "msg" => "Le compte pour ce caissier existe déjà"]);
        }
    }

    public function getUsersPage()
    {
        if (Auth::user()->chefcaisse == 1 or Auth::user()->caissier == 1) {
            return view("users");
        } else {
            return view('home');
        }
    }
}
