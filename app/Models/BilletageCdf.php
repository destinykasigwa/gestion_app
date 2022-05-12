<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BilletageCdf extends Model
{
    use HasFactory;
   protected $fillable=[
    "refOperation",
    "vightMilleFranc",
    "dixMilleFranc",
    "cinqMilleFranc",
    "milleFranc",
    "cinqCentFranc",
    "deuxCentFranc",
    "centFranc",
    "cinquanteFanc",
    "NomUtilisateur",
    "DateTransaction"


   ];
}
