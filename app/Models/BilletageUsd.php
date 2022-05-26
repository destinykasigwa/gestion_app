<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BilletageUsd extends Model
{
    use HasFactory;
    protected $fillable = [
        "refOperation",
        "centDollars",
        "cinquanteDollars",
        "vightDollars",
        "dixDollars",
        "cinqDollars",
        "unDollars",
        "montantEntre",
        "centDollarsSortie",
        "cinquanteDollarsSortie",
        "vightDollarsSortie",
        "dixDollarsSortie",
        "cinqDollarsSortie",
        "unDollarsSortie",
        "montantSortie",
        "NomUtilisateur",
        "DateTransaction"
    ];
}
