<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\updateMembre;
use App\Http\Controllers\AdhesionMembreController;
use App\Http\Controllers\DepotEspeceController;
use App\Http\Controllers\GetIndividualMendataire;
// use App\Http\Controllers\MendataireController;
use App\Http\Controllers\PersonneLieController;
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

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
Route::get('/adhesion', [AdhesionMembreController::class,'adhesion'])->name('membre.adhesion');
Route::get('/depot-espece', [DepotEspeceController::class,'depot'])->name('depot.espece');
// Route::post('/createnew', [AdhesionMembreController::class,'update']);
// Route::get('/edit-membre/{id}', [AdhesionMembreController::class,'updateMembre']);
Route::resource("/createnew","App\Http\Controllers\AdhesionMembreController")->except(["destroy","update","edit","index"]);


Route::resource("mendataire","App\Http\Controllers\MendataireController")->except(["destroy","update","edit","index"]);
Route::post('/get/getindividual/mendataire/details',
[GetIndividualMendataire::class,'getMendatireDetails']);

//updating a specific mendataire
Route::post("/update/mendataire/data",
[GetIndividualMendataire::class,'updatingmendataire']);
//get all personne liees
Route::get("/personnelie/getpersonnelie/{id}",
[PersonneLieController::class,'getAllpersonneLie']);

//get individual personne liee

Route::post('/get/getindividual/personnelie/details',
[PersonneLieController::class,'getPersonneLieDetails']);

//updating a specif personne lie
Route::post("/update/personnelie/data",
[PersonneLieController::class,'updatingpersonnelie']);

//add new personne liee

Route::post("/newpersonnelie/addnew/",
[PersonneLieController::class,'createnew']);

//delet a specifique mendataire

Route::delete('/delete/mendataire/data/{idMendataire}',
[GetIndividualMendataire::class,'destroy']);

//delete a specifique personne liee

Route::delete('/delete/personnelie/data/{idPersonneLie}',
[PersonneLieController::class,'destroy']);

//update membre

Route::post("/update/membre/data",
[updateMembre::class,'updatingmembre']);

//Activatate a new account

Route::post("/activationcompte/membre/data",
[updateMembre::class,'activateAccount']);

//getActived accounts
Route::get("membre/compteactive/{id}",
[updateMembre::class,'activatedAccount']);

//adding a photo to a member

Route::post("/membre/addphoto",
[updateMembre::class,'uploadphoto']);

//saving a currency deposit

Route::post("depot/espece",
[DepotEspeceController::class,'depotEspece']);

//get searched account
Route::get("/compte/search/{id}",
[DepotEspeceController::class,'getAccount']);








