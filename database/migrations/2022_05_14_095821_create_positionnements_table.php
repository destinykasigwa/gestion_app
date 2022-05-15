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
        Schema::create('positionnements', function (Blueprint $table) {
            $table->id();
            $table->string("Reference",20)->nullable();
            $table->string("NumCompte",30)->nullable();
            $table->float("Montant")->nullable()->default("0.00");
            $table->string("CodeMonnaie",20)->nullable();
            $table->string("CodeAgence",20)->nullable();
            $table->string("CodeGuichet",20)->nullable();
            $table->string("DateTransaction",20)->nullable();
            $table->string("Document",20)->nullable();
            $table->string("NumDocument",20)->nullable();
            $table->string("Concerne",20)->nullable();
            $table->string("Adresse",20)->nullable();
            $table->string("NumTel",20)->nullable();
            $table->string("TypePieceIdentity",20)->nullable();
            $table->string("Proprietaire",20)->nullable();
            $table->string("Mandataire",20)->nullable();
            $table->string("NomUtilisateur",20)->nullable();
            $table->string("Autorisateur",20)->nullable();
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
        Schema::dropIfExists('positionnements');
    }
};
