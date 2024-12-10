<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TauxJournalier extends Model
{
    use HasFactory;
    protected $fillable = [
        "DateTaux",
        "Dollar",
        "TauxEnFc"
    ];
}
