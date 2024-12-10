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
        Schema::create('agents', function (Blueprint $table) {
            $table->id();
            $table->string("NumCompte", 30)->nullable();
            $table->string("NumcompteUSD", 30)->nullable();
            $table->string("NomAgent", 30)->nullable();
            $table->float("salaire")->nullable()->default("0.00");
            $table->string("Devise", 10)->nullable();
            $table->string("Actif", 10)->nullable();
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
        Schema::dropIfExists('agents');
    }
};
