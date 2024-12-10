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
        Schema::create('billetage_cdfs', function (Blueprint $table) {
            $table->id();
            $table->string("refOperation", 20)->nullable();
            $table->float("vightMilleFranc")->nullable()->default('0.00');
            $table->float("dixMilleFranc")->nullable()->default('0.00');
            $table->float("cinqMilleFranc")->nullable()->default('0.00');
            $table->float("milleFranc")->nullable()->default('0.00');
            $table->float("cinqCentFranc")->nullable()->default('0.00');
            $table->float("deuxCentFranc")->nullable()->default('0.00');
            $table->float("centFranc")->nullable()->default('0.00');
            $table->float("cinquanteFanc")->nullable()->default('0.00');
            $table->float("montantEntre")->nullable()->default('0.00');
            //pour le retrait
            $table->float("vightMilleFrancSortie")->nullable()->default('0.00');
            $table->float("dixMilleFrancSortie")->nullable()->default('0.00');
            $table->float("cinqMilleFrancSortie")->nullable()->default('0.00');
            $table->float("milleFrancSortie")->nullable()->default('0.00');
            $table->float("cinqCentFrancSortie")->nullable()->default('0.00');
            $table->float("deuxCentFrancSortie")->nullable()->default('0.00');
            $table->float("centFrancSortie")->nullable()->default('0.00');
            $table->float("cinquanteFancSortie")->nullable()->default('0.00');
            $table->float("montantSortie")->nullable()->default('0.00');
            $table->string("NomUtilisateur", 20)->nullable();
            $table->date("DateTransaction")->nullable();
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
        Schema::dropIfExists('billetage_cdfs');
    }
};
