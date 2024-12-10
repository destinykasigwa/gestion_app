<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Mandataire;
use Illuminate\Http\Request;
use App\Models\AdhesionMembre;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class MendataireController extends Controller
{

    public function saveNewMendataire(Request $request)
    {
        //recupere le membre concerné
        $validator = validator::make($request->all(), [
            'mendataireName' => 'required|max:100',
            'lieuNaissM' => 'required|max:20',
            'etatCivileM' => 'required',



        ]);

        if ($validator->fails()) {

            return response()->json([
                'validate_error' => $validator->errors()
            ]);
        } else {
            Mandataire::create([
                "refCompte" => $request->refCompte,
                "mendataireName" => $request->mendataireName,
                "lieuNaissM" => $request->lieuNaissM,
                "dateNaissM" => $request->dateNaissM,
                "etatCivileM" => $request->etatCivileM,
                "sexeM" => $request->sexeM,
                "typePieceM" => $request->typePieceM,
                "professionM" => $request->professionM,
                "telephoneM" => $request->telephoneM,
                "adresseM" => $request->adresseM,
                "observationM" => $request->observationM,

            ]);
            return response()->json(["success" => 1, "msg" => "Mendataire ajouté(e) avec succès"]);
        }
    }

    public function getMendataire($id)
    {

        try {
            $data = AdhesionMembre::where('compteAbrege', '=', $id)
                ->join('mandataires', 'adhesion_membres.refCompte', '=', 'mandataires.refCompte')
                ->get();
            return response()->json(["data" => $data]);
        } catch (Exception $th) {
            Log::error($th);
        }
    }



    // $data = AdhesionMembre::where('compteAbrege', 'like', '%' . $id . '%')
    // ->join('mandataires', 'adhesion_membres.refCompte', '=', 'mandataires.refCompte')
    // ->paginate(30, array(
    //     'mandataires.mendataireName as name',
    //     'mandataires.lieuNaissM as lieuN', 'mandataires.dateNaissM as dateN',
    //     'mandataires.etatCivileM as etatC',
    //     'mandataires.sexeM as sexM', 'mandataires.typePieceM as typePiec', 'mandataires.professionM as profession', 'mandataires.telephoneM as telephone', 'mandataires.adresseM as adresse', "mandataires.id as idMendataire"
    // ));
}
