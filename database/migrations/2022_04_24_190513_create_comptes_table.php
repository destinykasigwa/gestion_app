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
        // Schema::create('comptes', function (Blueprint $table) {
        //     $table->id();
        //     $table->timestamps();
        //     $table->bigInteger('idmembre')->unsigned();
        //     $table->foreign('idMembre')
        //     ->references('idMembre')->on('adhesion_membres')
        //     ->onDelete('cascade')->onUpdate('cascade');
            
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('comptes');
    }
};
