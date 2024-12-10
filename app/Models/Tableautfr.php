<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tableautfr extends Model
{
    use HasFactory;
    protected $fillable = [
        "RefCadre",
        "Designation",
        "CodeRubrique",
        "Description",
        "Solde",
        "Soldeus",
        "Soldefc",
        "DateMouvement",
        "Monnaie",
    ];
}
