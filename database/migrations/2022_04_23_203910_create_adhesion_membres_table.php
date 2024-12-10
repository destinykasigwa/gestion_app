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
        Schema::create('adhesion_membres', function (Blueprint $table) {
            $table->bigInteger("refCompte", 20);
            $table->string('codeAgence', 15)->nullable();
            $table->string('codeMonaie', 5)->nullable();
            $table->string('intituleCompte', 250)->nullable();
            $table->string('produitEpargne', 100)->nullable();
            $table->string('typeClient', 100)->nullable();
            $table->string('numCompte', 20)->nullable();
            $table->string('guichetAdresse', 20)->nullable();
            $table->date('dateOuverture')->nullable();
            $table->string('lieuNaiss', 250)->nullable();
            $table->string('dateNaiss', 250)->nullable();
            $table->string('etatCivile', 250)->nullable();
            $table->string('conjoitName', 250)->nullable();
            $table->string('fatherName', 250)->nullable();
            $table->string('motherName', 250)->nullable();
            $table->string('profession', 250)->nullable();
            $table->string('workingPlace', 250)->nullable();
            $table->string('cilivilty', 250)->nullable();
            $table->string('sexe', 2)->nullable();
            $table->string('phone1', 15)->nullable();
            $table->string('phone2', 15)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('typepiece', 100)->nullable();
            $table->string('numpiece', 100)->nullable();
            $table->string('delivrancePlace', 100)->nullable();
            $table->string('delivranceDate', 100)->nullable();
            $table->string('gestionnaire', 100)->nullable();
            $table->string('provinceOrigine', 100)->nullable();
            $table->string('territoireOrigine', 100)->nullable();
            $table->string('collectiviteOrigine', 100)->nullable();
            $table->string('provinceActuelle', 100)->nullable();
            $table->string('villeActuelle', 100)->nullable();
            $table->string('CommuneActuelle', 100)->nullable();
            $table->string('QuartierActuelle', 100)->nullable();
            $table->string('otherMother', 100)->nullable();
            $table->string('Commune', 100)->nullable();
            $table->string('parainAccount', 100)->nullable();
            $table->string('parainName', 100)->nullable();
            $table->string('typeGestion', 100)->nullable();
            $table->string('critere1', 100)->nullable();
            $table->string('otherMention', 100)->nullable();
            $table->string('activationCompte', 20)->nullable();
            $table->string('compteAbrege', 20)->nullable();
            $table->string('photoMembre', 250)->nullable()->default("default.jpg");
            $table->float('MontantPremiereMise')->nullable()->default("0.00");
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
        Schema::dropIfExists('adhesion_membres');
    }
};
