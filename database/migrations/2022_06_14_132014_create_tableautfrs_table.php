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
        Schema::create('tableautfrs', function (Blueprint $table) {
            $table->bigInteger("RefResultat", 20);
            $table->string("RefCadre", 30)->nullable();
            $table->string("Designation", 100)->nullable();
            $table->string("CodeRubrique", 10)->nullable();
            $table->string("Description", 10)->nullable();
            $table->string("Solde", 100)->nullable()->default("0.00");
            $table->string("Soldeus", 100)->nullable()->default("0.00");
            $table->string("Soldefc", 100)->nullable()->default("0.00");
            $table->string("DateMouvement", 100)->nullable()->default("0.00");
            $table->string("Monnaie", 100)->nullable()->default("0.00");
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
        Schema::dropIfExists('tableautfrs');
    }
};
