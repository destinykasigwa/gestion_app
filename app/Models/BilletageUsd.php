<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BilletageUsd extends Model
{
    use HasFactory;
    protected $fillable=[
        "refOperation",
        "centDollars",
        "cinquanteDollars",
        "vightDollars",
        "dixDollars",
        "cinqDollars",
        "unDollars",
        "NomUtilisateur",
        "DateTransaction"
    ];
}
