<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AdhesionMembre;
use App\Models\PersonneLie;
use Illuminate\Support\Facades\Validator;
use Exception;
use Illuminate\Support\Facades\Log;

class PersonneLieController extends Controller
{

    public function  createnew(Request $request)
    {
        //recupere le membre concerné
        $validator = validator::make($request->all(), [
            'personneLieName' => 'required|max:100',
            'lieuNaissLie' => 'required|max:20',




        ]);

        if ($validator->fails()) {

            return response()->json([
                'validate_error' => $validator->errors()
            ]);
        } else {
            PersonneLie::create([
                "refCompte" => $request->refCompte,
                "personneLieName" => $request->personneLieName,
                "lieuNaissLie" => $request->lieuNaissLie,
                "dateNaissLie" => $request->dateNaissLie,
                "degreParante" => $request->degreParante,


            ]);
            return response()->json(["success" => 1, "msg" => "Personne liée ajoutée avec succès"]);
        }
    }





    public function getPersonneLieDetails(Request $request)
    {
        try {
            $personneLieData = PersonneLie::findOrFail($request->get('pesonneLieId'));
            return response()->json($personneLieData);
        } catch (Exception $th) {
            Log::error($th);
        }
    }


    public function getAllpersonneLie($id)
    {
        try {
            $data = AdhesionMembre::where('compteAbrege', '=', $id)
                ->join('personne_lies', 'adhesion_membres.refCompte', '=', 'personne_lies.refCompte')
                ->get();
            return response()->json(["data" => $data]);
        } catch (Exception $th) {
            Log::error($th);
        }
    }



    public function updatingpersonnelie(Request $request)
    {
        try {

            $personneLieId = $request->get('personneLieId');
            $personneLieName = $request->get('personneLieName');
            $lieuNaissLie = $request->get('lieuNaissLie');
            $dateNaissLie = $request->get('dateNaissLie');
            $degreParante = $request->get('degreParante');


            PersonneLie::where('id', $personneLieId)->update([
                'personneLieName' => $personneLieName,
                'lieuNaissLie' => $lieuNaissLie,
                'dateNaissLie' => $dateNaissLie,
                'degreParante' => $degreParante,

            ]);
            return response()->json(["success" => 1, "msg" => "Le personne liée  a bien été mise à jour !"]);
        } catch (Exception $th) {
            Log::error($th);
        }
    }

    public function destroy(PersonneLie $idPersonneLie)
    {
        try {
            $idPersonneLie->delete();
            return response()->json(["success" => 1, "msg" => "La personne liée a bien été supprimée"]);
        } catch (Exception $th) {
            Log::error($th);
        }
    }
}
