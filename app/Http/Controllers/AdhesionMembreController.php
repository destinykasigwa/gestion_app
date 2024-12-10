<?php

namespace App\Http\Controllers;

use App\Models\Comptes;
use App\Models\Mandataire;
use App\Models\PersonneLie;
use Illuminate\Http\Request;
use App\Models\AdhesionMembre;
use App\Models\CompteurCompte;
// use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
// use App\Models\Compte;

class AdhesionMembreController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     * 
     */

    public function __construct()
    {
        $this->middleware('auth');
    }


    public function index()
    {
        return view('home');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {



        $validator = validator::make($request->all(), [
            'numCompte' => 'required|max:25|unique:adhesion_membres',
            'intituleCompte' => 'required|max:250',
            'etatCivile' => 'required',
            'provinceActuelle' => 'required',
            'villeActuelle' => 'required',
            'CommuneActuelle' => 'required',
            'QuartierActuelle' => 'required',
            'phone1' => 'required|max:12',
            'phone1' => 'max:12',
            'critere1' => 'required',


        ]);

        if ($validator->fails()) {
            $compteurId = [];
            $compteurId = CompteurCompte::latest()->first();

            return response()->json([
                'validate_error' => $validator->errors(), "lastId" => $compteurId->id
            ]);
        } else {
            //VERIFIE SI C LE MEMBRE LUI MEME QUI CREE SON COMPTE SI OUI ON LUI LIMITE A UN SEUL COMPTE
            $checkIfCreatedAcount = AdhesionMembre::where("UserID", "=", Auth::user()->id)->first();
            if ($checkIfCreatedAcount) {
                return response()->json(["success" => 0, "msg" => "Désolé vous ne pouvez pas créer deux comptes si vous avez besoin d'un deuxième compte rendez vous en Agence merci."],);
            }
            AdhesionMembre::create([
                // "refCompte"=>$request->refCompte,
                "numCompte" => $request->salarieCompte == "OUI" ? "SA" . $request->numCompte : $request->numCompte,
                "codeAgence" => $request->codeAgence,
                "codeMonaie" => $request->codeMonaie,
                "intituleCompte" => $request->intituleCompte,
                "produitEpargne" => $request->produitEpargne,
                "typeClient" => $request->typeClient,
                "guichetAdresse" => $request->guichetAdresse,
                "dateOuverture" => $request->dateOuverture,
                "lieuNaiss" => $request->lieuNaiss,
                "dateNaiss" => $request->dateNaiss,
                "etatCivile" => $request->etatCivile,
                "conjoitName" => $request->conjoitName,
                "fatherName" => $request->fatherName,
                "motherName" => $request->motherName,
                "profession" => $request->profession,
                "workingPlace" => $request->workingPlace,
                "cilivilty" => $request->cilivilty,
                "sexe" => $request->sexe,
                "phone1" => $request->phone1,
                "phone2" => $request->phone2,
                "email" => $request->email,
                "typepiece" => $request->typepiece,
                "numpiece" => $request->numpiece,
                "delivrancePlace" => $request->delivrancePlace,
                "delivranceDate" => $request->delivranceDate,
                "gestionnaire" => $request->gestionnaire,
                "provinceOrigine" => $request->provinceOrigine,
                "territoireOrigine" => $request->territoireOrigine,
                "collectiviteOrigine" => $request->collectiviteOrigine,
                "provinceActuelle" => $request->provinceActuelle,
                "villeActuelle" => $request->villeActuelle,
                "CommuneActuelle" => $request->CommuneActuelle,
                "QuartierActuelle" => $request->QuartierActuelle,
                "parainAccount" => $request->parainAccount,
                "parainName" => $request->parainName,
                "typeGestion" => $request->typeGestion,
                "critere1" => $request->critere1,
                "activationCompte" => $request->activationCompte,
                "compteAbrege" => $request->compteAbrege,
                "MontantPremiereMise" => $request->MontantPremiereMise,
                'UserID' => Auth::user()->Role == 0 ? Auth::user()->id : null,
                'SelfCreated' => Auth::user()->Role == 0 ? 1 : null,
                'openedBy' => Auth::user()->name,
                'is_salarie' => $request->salarieCompte == "OUI" ? 1 : 0
            ]);

            // Comptes::create([
            //     'CodeAgence' => $request->codeAgence,
            //     'NumCompte' => $request->numCompte,
            //     'NomCompte' => $request->intituleCompte,
            //     'Civilite' => $request->cilivilty,
            //     'NumeTelephone' => $request->phone1,
            //     'DateNaissance' => $request->dateNaiss,
            //     'NumAdherant' => $request->compteAbrege
            // ]);

            $lastId = [];
            $lastId = AdhesionMembre::latest()->first();

            Mandataire::create([
                "refCompte" => $lastId->refCompte,
                "mendataireName" => $request->intituleCompte,
                "lieuNaissM" => $request->lieuNaiss,
                "dateNaissM" => $request->dateNaiss,
                "etatCivileM" => $request->etatCivile,
                "sexeM" => $request->sexe,
                "typePieceM" => $request->typePiece,
                "professionM" => $request->profession,
                "telephoneM" => $request->telephone,
                "adresseM" => $request->adresse,
                "observationM" => $request->observation,
                "photoM" => $request->photoM,

            ]);

            PersonneLie::create([
                "refCompte" => $lastId->refCompte,
                "personneLieName" => $request->intituleCompte,
                "lieuNaissLie" => $request->lieuNaiss,
                "dateNaissLie" => $request->dateNaiss,
                "degreParante" => $request->degreParante,

            ]);
            CompteurCompte::create([
                "fakeField" => 0000
            ]);
        }



        if (Auth::user()->Role == 1) {
            return response()->json(["success" => 1, "msg" => "Compte crée avec succès! numéro de compte abregé : " . $request->compteAbrege, 'validate_error' => $validator->errors()],);
        } else {
            return response()->json(["success" => 1, "msg" => "Compte crée avec succès! votre numéro de compte abregé est : " . $request->compteAbrege . " Veuillez contact le service client pour son activation ", 'validate_error' => $validator->errors()],);
        }
    }









    /**umm
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        return response()->json(["success" => 1, "msg" => "ok", 'resquest' => $request],);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
    public function adhesion()
    {
        return view("adhesion");
    }

    function updateMembre($id)
    {
        return view("edit-membre");
    }
}
