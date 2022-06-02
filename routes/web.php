<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\updateMembre;
use App\Http\Controllers\updateMembre;
use App\Http\Controllers\RetraitEspece;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ApproController;
// use App\Http\Controllers\MendataireController;
use App\Http\Controllers\DelestageController;
use App\Http\Controllers\DepotEspeceController;
use App\Http\Controllers\PersonneLieController;
use App\Http\Controllers\EntreeTresorController;
use App\Http\Controllers\GetIndividualMendataire;
use App\Http\Controllers\RetraitEspeceController;
use App\Http\Controllers\AdhesionMembreController;
use App\Http\Controllers\JournalCaisseController;
use App\Http\Controllers\RepertoireCaisseController;
use App\Http\Controllers\SoldeController;
use App\Http\Controllers\SuiviCreditController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('home');
// });

Auth::routes();
//MAIN ROUTES
Route::get('/',  [HomeController::class, 'index']);
Route::get('/home', [HomeController::class, 'index'])->name('home');
Route::get('/adhesion', [AdhesionMembreController::class, 'adhesion'])->name('membre.adhesion');
Route::get('/depot-espece', [DepotEspeceController::class, 'depot'])->name('depot.espece');
Route::get('/retrait-espece', [RetraitEspeceController::class, 'retrait'])->name('retrait.espece');
Route::get('/positionnement', [RetraitEspeceController::class, 'getPositionnement'])->name('retrait.positionnement');
Route::get('/appro', [ApproController::class, 'getApproPage'])->name('appro.approvisionnement');
Route::get('/delestage', [DelestageController::class, 'getDelestagePage'])->name('retour.delestage');
Route::get('/entre-tresor', [EntreeTresorController::class, 'getEntreeTresorPage'])->name('entree.tresor');
Route::get('/solde', [SoldeController::class, 'getSoldePage'])->name('membre.solde');
Route::get('/repertoirecaisse', [RepertoireCaisseController::class, 'getRepertoirePage'])->name('caisse.repertoire');
Route::get('/journal', [JournalCaisseController::class, 'getJournaCaissePage'])->name('caisse.journal');
Route::get('/suivicredit', [SuiviCreditController::class, 'getSuiviCreditPage'])->name('credit.suivi');
// Route::post('/createnew', [AdhesionMembreController::class,'update']);
// Route::get('/edit-membre/{id}', [AdhesionMembreController::class,'updateMembre']);
Route::resource("/createnew", "App\Http\Controllers\AdhesionMembreController")->except(["destroy", "update", "edit", "index"]);


Route::resource("mendataire", "App\Http\Controllers\MendataireController")->except(["destroy", "update", "edit", "index"]);
Route::post(
    '/get/getindividual/mendataire/details',
    [GetIndividualMendataire::class, 'getMendatireDetails']
);

//updating a specific mendataire
Route::post(
    "/update/mendataire/data",
    [GetIndividualMendataire::class, 'updatingmendataire']
);
//get all personne liees
Route::get(
    "/personnelie/getpersonnelie/{id}",
    [PersonneLieController::class, 'getAllpersonneLie']
);

//get individual personne liee

Route::post(
    '/get/getindividual/personnelie/details',
    [PersonneLieController::class, 'getPersonneLieDetails']
);

//updating a specif personne lie
Route::post(
    "/update/personnelie/data",
    [PersonneLieController::class, 'updatingpersonnelie']
);

//add new personne liee

Route::post(
    "/newpersonnelie/addnew/",
    [PersonneLieController::class, 'createnew']
);

//delet a specifique mendataire

Route::delete(
    '/delete/mendataire/data/{idMendataire}',
    [GetIndividualMendataire::class, 'destroy']
);

//delete a specifique personne liee

Route::delete(
    '/delete/personnelie/data/{idPersonneLie}',
    [PersonneLieController::class, 'destroy']
);

//update membre

Route::post(
    "/update/membre/data",
    [updateMembre::class, 'updatingmembre']
);

//Activatate a new account

Route::post(
    "/activationcompte/membre/data",
    [updateMembre::class, 'activateAccount']
);

//getActived accounts
Route::get(
    "membre/compteactive/{id}",
    [updateMembre::class, 'activatedAccount']
);

//adding a photo to a member

Route::post(
    "/membre/addphoto",
    [updateMembre::class, 'uploadphoto']
);
// |--------------------------------------------------------------------------
// | Web Routes DEPOSIT
// |--------------------------------------------------------------------------
//saving a currency deposit

Route::post(
    "depot/espece",
    [DepotEspeceController::class, 'depotEspece']
);

//get searched account
Route::get(
    "/compte/search/{id}",
    [DepotEspeceController::class, 'getAccount']
);


//RECUPERE LES INFORMATIONS D'UN DOSSIER QUI A ETE POSITIONNER AFIN DE FAIRE LE RETRAIT



Route::get(
    "compte/search/numdossier/{numDocument}",
    [DepotEspeceController::class, 'getNumDocument']
);


//get billetage fom DB

Route::get(
    "/billetage/getbilletage",
    [DepotEspeceController::class, 'getBilletage']
);


// |--------------------------------------------------------------------------
// | Web Routes WITHDRAW
// |--------------------------------------------------------------------------
Route::post(
    "retrait/espece",
    [RetraitEspeceController::class, 'RetraitEspece']
);

//positionnement
Route::post(
    "positionnement/espece",
    [RetraitEspeceController::class, 'positionnementEspece']
);

//RECUPERE TOUTES LES OPERATIONS POSITIONNEES

Route::get(
    "positionnement/getalloperation",
    [RetraitEspeceController::class, 'getAllPositionnement']
);

//GET ALL CAISSIER FROM DBnpm

Route::get(
    "appro/getcaissier",
    [ApproController::class, 'getAllCaissier']
);

//SAVE OPERATION FOR APPRO CAISSIER

Route::post(
    "appro/savenewappro",
    [ApproController::class, 'saveNewApproCaissier']
);

//GET DAYLY APPRO
Route::get(
    "appro/journalier",
    [ApproController::class, 'getDaylyAppro']
);

//GET DAYLY APPRO FOR SPECIFIC CAISSER (USER)
Route::get(
    "appro/received",
    [ApproController::class, 'getDaylyApproUser']
);


//REMOVE E SPECIFIQUE APPRO ITEM CDF
Route::delete(
    "/delete/appro/cdf/{id}",
    [ApproController::class, 'destroy']
);

//REMOVE E SPECIFIQUE APPRO ITEM USD
Route::delete(
    "/delete/appro/usd/{id}",
    [ApproController::class, 'destroyusd']
);

//ACCEPT A SPECIF APPRRO FOR A SPECIFIQUE USER CDF

Route::delete(
    "accept/appro/cdf/{id}",
    [ApproController::class, 'acceptApproCDF']
);

//ACCEPT A SPECIF APPRRO FOR A SPECIFIQUE USER USD

Route::delete(
    "accept/appro/usd/{id}",
    [ApproController::class, 'acceptApproUSD']
);

//GET SUM  OF BILLETAGE
Route::get(
    "billetage/sommebilletage",
    [DelestageController::class, 'getAllBilletage']
);


//GET NEW BILLETAGE ATFER DOING A CHANGE MONNEY OPERATION
Route::get(
    "billetage/nouvel",
    [DelestageController::class, 'getNewBilletage']
);

//UPDATE BILLETAGE CDF
Route::post(
    "delestage/update/cdf",
    [DelestageController::class, 'upDateBilletageCDF']
);

//UPDATE BILLETAGE USD
Route::post(
    "delestage/update/usd",
    [DelestageController::class, 'upDateBilletageUSD']
);

//DELESTAGE CDF
Route::post(
    "delestage/delestage/cdf",
    [DelestageController::class, 'delestageCDF']
);

//DELESTAGE CDF
Route::post(
    "delestage/delestage/usd",
    [DelestageController::class, 'delestageUSD']
);

//DELESTAGE AU CAS OU L'UTILISATEUR A MET A JOUR LE BILLETAGE CDF
Route::get(
    "delestage/echange/cdf",
    [DelestageController::class, 'delestageChangeMCDF']
);

//DELESTAGE AU CAS OU L'UTILISATEUR A MET A JOUR LE BILLETAGE USD
Route::get(
    "delestage/echange/usd",
    [DelestageController::class, 'delestageChangeMUSD']
);

//GET ALL DELESTAGE REQUEST

Route::get(
    "delestage/billetage/all",
    [EntreeTresorController::class, 'getDelestageRequest']
);


//REMOVE A SPECIFIC DELESTAGE ITEM CDF
Route::delete(
    "/delete/delestage/cdf/{id}",
    [EntreeTresorController::class, 'removeItemDeletstageCDF']
);

//REMOVE A SPECIFIC DELESTAGE ITEM CDF
Route::delete(
    "/delete/delestage/usd/{id}",
    [EntreeTresorController::class, 'removeItemDeletstageUSD']
);

//CONFIRM A SPECIF DELESTAGE ITEM CDF
Route::get(
    "delestage/accept/cdf/{id}",
    [EntreeTresorController::class, 'confirmDeletstageRequestCDF']
);


//CONFIRM A SPECIF DELESTAGE ITEM USD
Route::get(
    "delestage/accept/usd/{id}",
    [EntreeTresorController::class, 'confirmDeletstageRequestUSD']
);

//GET RELEVE
Route::post(
    "membre/releve/data",
    [SoldeController::class, 'getReleveMembre']
);

//GET REPERTOIRE DATA
Route::post(
    "/rapport/repertoire/caisse",
    [RepertoireCaisseController::class, 'getRepertoire']
);

//GET JOURNAL DATA
Route::post(
    "/rapport/journal/caisse",
    [JournalCaisseController::class, 'getJournal']
);

//RECHERCHE UN NUMERO DE COMPTE POUR LE MONTAGE DE CREDIT
Route::get(
    "credit/search/{id}",
    [SuiviCreditController::class, 'getInfoCompte']
);

//QD ON CLIC SUR LE BOUTON NOUVEAU CREDIT
Route::post(
    "credit/nouveau",
    [SuiviCreditController::class, 'getNewDossierNumber']
);

//ENREGISTRE UN NOUVEL MONTAGE DE CREDIT
Route::post(
    "credit/montagecredit",
    [SuiviCreditController::class, 'saveNewMontageCredit']
);

//MET A JOUR LE CEDIT
Route::post(
    "montage/credit/update",
    [SuiviCreditController::class, 'upDateCredit']
);

//ENREGISTRE L'ECHEANCIER

Route::post(
    "credit/echeancier/generate",
    [SuiviCreditController::class, 'saveEcheancier']
);
