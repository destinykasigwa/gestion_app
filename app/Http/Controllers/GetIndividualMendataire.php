<?php

namespace App\Http\Controllers;

use App\Models\Mandataire;
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Http\Request;

class GetIndividualMendataire extends Controller
{
    //Get individual mendataire details
    public function getMendatireDetails(Request $request)
    {

        try {
            $mendataireData = Mandataire::findOrFail($request->get('mendataireId'));
            return response()->json($mendataireData);
        } catch (Exception $th) {
            Log::error($th);
        }
    }

    public function updatingmendataire(Request $request)
    {
        try {

            $mendataireId = $request->get('mendataireId');
            $mendataireName = $request->get('mendataireName');
            $lieuNaissM = $request->get('lieuNaissM');
            $dateNaissM = $request->get('dateNaissM');
            $etatCivileM = $request->get('etatCivileM');
            $sexeM = $request->get('sexeM');
            $typePieceM = $request->get('typePieceM');
            $professionM = $request->get('professionM');
            $telephoneM = $request->get('telephoneM');
            $adresseM = $request->get('adresseM');
            $observationM = $request->get('observationM');

            Mandataire::where('id', $mendataireId)->update([
                'mendataireName' => $mendataireName,
                'lieuNaissM' => $lieuNaissM,
                'dateNaissM' => $dateNaissM,
                'etatCivileM' => $etatCivileM,
                'sexeM' => $sexeM,
                'typePieceM' => $typePieceM,
                'professionM' => $professionM,
                'telephoneM' => $telephoneM,
                'adresseM' => $adresseM,
                'observationM' => $observationM,
            ]);
            return response()->json(["success" => 1, "msg" => "Le mendataire  a bien été mise à jour !"]);
        } catch (Exception $th) {
            Log::error($th);
        }
    }

    //deleting a specific mendataire

    public function destroy(Mandataire $idMendataire)
    {
        try {
            $idMendataire->delete();
            return response()->json(["success" => 1, "msg" => "Le mendataire a bien été supprimé"]);
        } catch (Exception $th) {
            Log::error($th);
        }
    }
}
