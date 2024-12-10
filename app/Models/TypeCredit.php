<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeCredit extends Model
{
    use HasFactory;
    protected $fillable = [
        "RefProduitCredit",
        "TypeCredit",
        "SousGroupe",
        "MontantMin",
        "MontantMax",
        "DureeMin",
        "DureeMax",
        "TauxOrdinaire",
        "TauxEchu",
        "CompteInteret",
        "CompteInteretRetard",
        "PourcAvanceInteret",
        "ForfaitFraisDossier",
        "PourcFraisDossier",
        "CompteEtudeDossier",
        "forfaitCommission",
        "PourcCommission",
        "CompteCommission",
        "PourcPartSocial",
        "CodeMonnaie",
        "CodeAgence",
        "SousGroupeHB",
        "CompteHB",
        "InteretPrepaye",
        "Spot",
        "GroupeSolidaire",
        "PourcEpargne",
        "Cyclable",
        "SGroupeEpargneProgre",
        "Ordre",
        "JourGele",
        "JourRappelSMS",
        "FEDDemande",
        "CommissionDemande",
        "Desactive",
        "CompteRecuperat",
        "CompteConstition",
    ];
}
