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
        Schema::create('payement_agents', function (Blueprint $table) {
            $table->id();
            $table->string("refOperation", 20)->nullable();
            $table->string("NumCompte", 30)->nullable();
            $table->float("Montant")->nullable()->default("0.00");
            $table->string("Devise", 10)->nullable();
            $table->string("DatePay", 30)->nullable();
            $table->string("AnneePay", 30)->nullable();
            $table->string("MoisPay", 30)->nullable();

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
        Schema::dropIfExists('payement_agents');
    }
};
