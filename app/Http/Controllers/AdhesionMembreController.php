<?php

namespace App\Http\Controllers;
use App\Models\Mandataire;
use App\Models\PersonneLie;
use Illuminate\Http\Request;
use App\Models\AdhesionMembre;
use App\Models\CompteurCompte;
// use Illuminate\Support\Facades\DB;
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
        //
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
       
     

        $validator = validator::make($request->all(),[
            'numCompte' => 'required|max:25|unique:adhesion_membres',
            'intituleCompte' => 'required|max:250',
            'etatCivile'=>'required',
            'provinceActuelle'=>'required',
            'villeActuelle'=>'required',
            'CommuneActuelle'=>'required',
            'QuartierActuelle'=>'required',
            'phone1'=>'required|max:12',
            'phone1'=>'max:12',

           
        ]);
       
        if($validator->fails()){
            $compteurId=[];
            $compteurId=CompteurCompte::latest()->first();
           
            return response()->json([
            'validate_error' => $validator->errors(),"lastId" =>$compteurId->id
        ]);
        }else{
        
        AdhesionMembre::create([
        // "refCompte"=>$request->refCompte,
        "numCompte"=>$request->numCompte,
        "codeAgence"=>$request->codeAgence,
        "codeMonaie"=>$request->codeMonaie,
        "intituleCompte"=>$request->intituleCompte,
        "produitEpargne"=>$request->produitEpargne,
        "typeClient"=>$request->typeClient,
        "guichetAdresse"=>$request->guichetAdresse,
         "dateOuverture"=>$request->dateOuverture,
         "lieuNaiss"=>$request->lieuNaiss,
         "dateNaiss"=>$request->dateNaiss,
         "etatCivile"=>$request->etatCivile,
         "conjoitName"=>$request->conjoitName,
         "fatherName"=>$request->fatherName,
         "motherName"=>$request->motherName,
         "profession"=>$request->profession,
         "workingPlace"=>$request->workingPlace,
         "cilivilty"=>$request->cilivilty,   
         "sexe"=>$request->sexe,   
         "phone1"=>$request->phone1,   
         "phone2"=>$request->phone2,     
         "email"=>$request->email,   
         "typepiece"=>$request->typepiece,   
         "numpiece"=>$request->numpiece,   
         "delivrancePlace"=>$request->delivrancePlace,   
         "delivranceDate"=>$request->delivranceDate,   
         "gestionnaire"=>$request->gestionnaire,   
         "provinceOrigine"=>$request->provinceOrigine,   
         "territoireOrigine"=>$request->territoireOrigine,   
         "collectiviteOrigine"=>$request->collectiviteOrigine,   
         "provinceActuelle"=>$request->provinceActuelle,  
         "villeActuelle"=>$request->villeActuelle,
         "CommuneActuelle"=>$request->CommuneActuelle,   
         "QuartierActuelle"=>$request->QuartierActuelle,   
         "parainAccount"=>$request->parainAccount, 
         "parainName"=>$request->parainName, 
         "typeGestion"=>$request->typeGestion, 
         "critere1"=>$request->critere1, 
         "activationCompte"=>$request->activationCompte,        
       
    ]);
     $lastId=[];
     $lastId=AdhesionMembre::latest()->first();



        Mandataire::create([
            "refCompte"=>$lastId->refCompte,
            "mendataireName"=>$request->intituleCompte,
            "lieuNaissM"=>$request->lieuNaiss,
            "dateNaissM"=>$request->dateNaiss,
            "etatCivileM"=>$request->etatCivile,
            "sexeM"=>$request->sexe,
            "typePieceM"=>$request->typePiece,
            "professionM"=>$request->profession,
            "telephoneM"=>$request->telephone,
            "adresseM"=>$request->adresse,
            "observationM"=>$request->observation,
            "photoM"=>$request->photoM,
            
        ]); 
   
    PersonneLie::create([
        "refCompte"=>$lastId->refCompte,
        "personneLieName"=>$request->personneLieName,
        "lieuNaissLie"=>$request->lieuNaissLie,
        "dateNaissLie"=>$request->dateNaissLie,
        "degreParante"=>$request->degreParante,
        
    ]);
    CompteurCompte::create([
     "fakeField"=>0000
    ]);
    }
    
  

    return response()->json(["success" => 1, "msg" => "Compte crée avec succès!",'validate_error' => $validator->errors()],);
    

   

    }

    /**
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
        return response()->json(["success" => 1, "msg" => "ok",'resquest' =>$request],);
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
    public function adhesion(){
        return view("adhesion");
    }

    function updateMembre($id){
        return view("edit-membre");
    }
}
