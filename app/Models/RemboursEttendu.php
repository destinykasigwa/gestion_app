<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RemboursEttendu extends Model
{
    use HasFactory;
    protected $fillable = [
        "NumCompteEpargne",
        "NumCompteCredit",
        "montantCapit",
        "montantInteret",
        "StatutPayement",
        "DateRemboursement",
        "CodeMonnaie",
        "NumAbrege"
    ];
}
