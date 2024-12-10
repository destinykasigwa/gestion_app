<?php

use Illuminate\Http\Request;
use App\Http\Controllers\GetMembre;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\updateMembre;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get("/{id}", [GetMembre::class, 'getrow']);

Route::post("/updatemembre", [updateMembre::class, 'update']);
