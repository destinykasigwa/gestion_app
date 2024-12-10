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
        Schema::create('rembours_ettendus', function (Blueprint $table) {
            $table->id();
            $table->string("NumCompteEpargne", 30)->nullable();
            $table->string("NumCompteCredit", 30)->nullable();
            $table->string("montantCapit", 30)->nullable();
            $table->string("montantInteret", 30)->nullable();
            $table->string("CodeMonnaie", 30)->nullable();
            $table->string("StatutPayement", "10")->nullable();
            $table->date("DateRemboursement")->nullable();
            $table->string("NumAbrege", "20")->nullable();

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
        Schema::dropIfExists('rembours_ettendus');
    }
};
