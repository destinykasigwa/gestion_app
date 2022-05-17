<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\updateMembre;
use App\Http\Controllers\AdhesionMembreController;
use App\Http\Controllers\ApproController;
use App\Http\Controllers\DepotEspeceController;
use App\Http\Controllers\GetIndividualMendataire;
// use App\Http\Controllers\MendataireController;
use App\Http\Controllers\PersonneLieController;
use App\Http\Controllers\RetraitEspece;
use App\Http\Controllers\RetraitEspeceController;
use App\Http\Controllers\updateMembre;

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

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();
//MAIN ROUTES
Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
Route::get('/adhesion', [AdhesionMembreController::class, 'adhesion'])->name('membre.adhesion');
Route::get('/depot-espece', [DepotEspeceController::class, 'depot'])->name('depot.espece');
Route::get('/retrait-espece', [RetraitEspeceController::class, 'retrait'])->name('retrait.espece');
Route::get('/positionnement', [RetraitEspeceController::class, 'getPositionnement'])->name('retrait.positionnement');
Route::get('/appro', [ApproController::class, 'getApproPage'])->name('appro.approvisionnement');

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
