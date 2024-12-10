<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PersonneLie extends Model
{
    use HasFactory;
    protected   $fillable = [
        'refCompte',
        'personneLieName',
        'lieuNaissLie',
        'dateNaissLie',
        'degreParante',
    ];
}
