<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comptes extends Model
{
    use HasFactory;
    protected $fillable = [
        'CodeAgence',
        'NumCompte',
        'NumCompteAmo',
        'NomCompte',
        'RefTypeCompte',
        'RefCadre',
        'RefGroupe',
        'RefSousGroupe',
        'CodeMonnaie',
        'NumeTelephone',
        'DateNaissance',
        'NumAdherant',
    ];
}
