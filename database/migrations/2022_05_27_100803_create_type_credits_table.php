<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('type_credits', function (Blueprint $table) {
            // $table->id();
            $table->bigInteger("RefTypeCredit");
            $table->string("RefProduitCredit", 30)->nullable();
            $table->string("TypeCredit", 50)->nullable();
            $table->string("SousGroupe", 5)->nullable();
            $table->float("MontantMin")->nullable()->default('0.00');
            $table->float("MontantMax")->nullable()->default('0.00');
            $table->string("DureeMin", 5)->nullable();
            $table->string("DureeMax", 5)->nullable();
            $table->float("TauxOrdinaire")->nullable()->default('0.00');
            $table->float("TauxEchu")->nullable()->default('0.00');
            $table->string("CompteInteret", 20)->default();
            $table->string("CompteInteretRetard", 20)->default();
            $table->float("PourcAvanceInteret")->nullable()->default('0.00');
            $table->float("ForfaitFraisDossier")->nullable()->default('0.00');
            $table->float("PourcFraisDossier")->nullable()->default('0.00');
            $table->string("CompteEtudeDossier", 20)->nullable();
            $table->float("forfaitCommission")->nullable()->default('0.00');
            $table->float("PourcCommission")->nullable()->default('0.00');
            $table->string("CompteCommission", 20)->nullable();
            $table->float("PourcPartSocial")->nullable()->default('0.00');
            $table->string("CodeMonnaie", 10)->nullable();
            $table->string("CodeAgence", 10)->nullable();
            $table->string("SousGroupeHB", 10)->nullable();
            $table->string("CompteHB", 10)->nullable();
            $table->string("InteretPrepaye", 5)->nullable();
            $table->string("Spot", 5)->nullable();
            $table->string("GroupeSolidaire", 5)->nullable();
            $table->float("PourcEpargne")->nullable()->default('0.00');
            $table->string("Cyclable", 5)->nullable();
            $table->string("SGroupeEpargneProgre", 5)->nullable();
            $table->string("Ordre", 200)->nullable();
            $table->string("JourGele", 10)->nullable();
            $table->string("JourRappelSMS", 10)->nullable();
            $table->string("FEDDemande", 10)->nullable();
            $table->string("CommissionDemande", 10)->nullable();
            $table->string("Desactive", 10)->nullable();
            $table->string("CompteRecuperat", 15)->nullable();
            $table->string("CompteConstition", 15)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('type_credits');
    }
};
