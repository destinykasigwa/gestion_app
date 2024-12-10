<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompteurCompte extends Model
{
    use HasFactory;
    protected $fillable = [
        "id",
        "fakeField",
    ];
}
