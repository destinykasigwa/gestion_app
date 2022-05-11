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
        Schema::create('billetage_usds', function (Blueprint $table) {
            $table->id();
            $table->string("refOperation",20)->nullable();
            $table->float("centDollars")->nullable()->default('0.00');
            $table->float("cinquanteDollars")->nullable()->default('0.00');
            $table->float("vightDollars")->nullable()->default('0.00');
            $table->float("dixDollars")->nullable()->default('0.00');
            $table->float("cinqDollars")->nullable()->default('0.00');
            $table->float("unDollars")->nullable()->default('0.00');
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
        Schema::dropIfExists('billetage_usds');
    }
};
