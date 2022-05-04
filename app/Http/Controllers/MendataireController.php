<?php

namespace App\Http\Controllers;

use App\Models\Mandataire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class MendataireController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
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
    //recupere le membre concerné
    $validator = validator::make($request->all(),[
        'mendataireName' => 'required|max:100',
        'lieuNaissM' => 'required|max:20',
        'etatCivileM'=>'required',
        

       
    ]);

    if($validator->fails()){
       
        return response()->json([
        'validate_error' => $validator->errors()
    ]);
      }else{
        Mandataire::create([
            "refCompte"=>$request->refCompte,
            "mendataireName"=>$request->mendataireName,
            "lieuNaissM"=>$request->lieuNaissM,
            "dateNaissM"=>$request->dateNaissM,
            "etatCivileM"=>$request->etatCivileM,
            "sexeM"=>$request->sexeM,
            "typePieceM"=>$request->typePieceM,
            "professionM"=>$request->professionM,
            "telephoneM"=>$request->telephoneM,
            "adresseM"=>$request->adresseM,
            "observationM"=>$request->observationM,
        
        ]);
        return response()->json(["success"=>1,"msg"=>"Mendataire ajouté(e) avec succès"]);
      }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
        //
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
}
