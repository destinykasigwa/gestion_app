<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdhesionMembre extends Model
{
    use HasFactory;

    protected $fillable = [
        'refCompte',
        'numCompte',
        'codeAgence',
        'codeMonaie',
        'intituleCompte',
        'produitEpargne',
        'typeClient',
        'guichetAdresse',
        'dateOuverture',
        'lieuNaiss',
        'dateNaiss',
        'etatCivile',
        'conjoitName',
        'fatherName',
        'motherName',
        'profession',
        'workingPlace',
        'cilivilty',
        'sexe',
        'phone1',
        'phone2',
        'email',
        'typepiece',
        'numpiece',
        'delivrancePlace',
        'delivranceDate',
        'gestionnaire',
        'provinceOrigine',
        'territoireOrigine',
        'collectiviteOrigine',
        'provinceActuelle',
        'villeActuelle',
        'CommuneActuelle',
        'QuartierActuelle',
        'parainAccount',
        'parainName',
        'typeGestion',
        'critere1',
        'activationCompte',
        'compteAbrege',
        'photoMembre',
        'signatureMembre',
        'MontantPremiereMise',
        'UserID',
        'SelfCreated',
        'openedBy',
        'is_salarie'
    ];
}
