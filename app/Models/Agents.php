<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agents extends Model
{
    use HasFactory;
    protected $fillable = [
        "NumCompte",
        "NomAgent",
        "salaire",
        "Devise",
        "Actif"
    ];
}
