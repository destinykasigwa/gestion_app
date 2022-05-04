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
        Schema::create('personne_lies', function (Blueprint $table) {
            $table->id();
            $table->string('personneLieName', 100)->nullable();
            $table->string('lieuNaissLie', 100)->nullable();
            $table->string('dateNaissLie', 100)->nullable();
            $table->string('degreParante', 100)->nullable();
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
        Schema::dropIfExists('personne_lies');
    }
};
