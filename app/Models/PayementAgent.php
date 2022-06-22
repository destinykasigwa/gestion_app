<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayementAgent extends Model
{
    use HasFactory;
    protected $fillable = [
        "refOperation",
        "NumCompte",
        "Montant",
        "Devise",
        "DatePay",
        "AnneePay",
        "MoisPay",
    ];
}
