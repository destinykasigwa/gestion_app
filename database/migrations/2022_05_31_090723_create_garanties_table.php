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
        Schema::create('garanties', function (Blueprint $table) {
            $table->id();
            $table->string("NumDossier", 20)->nullable();
            $table->string("NumCompte", 30)->nullable();
            $table->string("NomGarant", 30)->nullable();
            $table->string("TypeGarantie", 30)->nullable();
            $table->string("DescriptionGarantie", 30)->nullable();
            $table->float("ValeurGarantie")->nullable()->default("0.00");
            $table->float("ValeurComptableHB")->nullable()->default("0.00");
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
        Schema::dropIfExists('garanties');
    }
};
