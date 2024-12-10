<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Mandataire;
use Illuminate\Http\Request;
use App\Models\AdhesionMembre;
use Illuminate\Support\Facades\Log;

class getMemdataire extends Controller
{



   // public function getMendataire($id)
   // {

   //    try {
   //       $data = AdhesionMembre::where('numCompte', 'like', '%' . $id . '%')
   //          ->join('mandataires', 'adhesion_membres.refCompte', '=', 'mandataires.refCompte')
   //          ->paginate(30, array(
   //             'mandataires.mendataireName as name',
   //             'mandataires.lieuNaissM as lieuN', 'mandataires.dateNaissM as dateN',
   //             'mandataires.etatCivileM as etatC',
   //             'mandataires.sexeM as sexM', 'mandataires.typePieceM as typePiec', 'mandataires.professionM as profession', 'mandataires.telephoneM as telephone', 'mandataires.adresseM as adresse', "mandataires.id as idMendataire"
   //          ));
   //       return response()->json($data);
   //    } catch (Exception $th) {
   //       Log::error($th);
   //    }
   // }
}
