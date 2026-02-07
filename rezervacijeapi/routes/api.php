<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\KarakteristikaController;
use App\Http\Controllers\RezervacijaController;
use App\Http\Controllers\SalaController;
use App\Http\Controllers\TipDogadjajaController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


//nezasticene rute kojima mogu da pristupe i korisnici koji nisu ulogovani

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('sale',[SalaController::class,'index']);//da korisnici vide sta iznajmljuju
Route::get('sale/{id}', [SalaController::class,'show']);

Route::get('/tipovidogadjaja', [TipDogadjajaController::class, 'index']);

Route::get('/karakteristike', [KarakteristikaController::class, 'index']);

Route::get('/email/verify/{id}', [AuthController::class, 'verifyEmail'])->name('verification.verify');

//moraju da imaju token

Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::delete('users/{user_id}', [UserController::class,'destroy']);//za brisanje naloga
    Route::get('users', [UserController::class,'index']);//za izlistavanje svih korisnika

    Route::post('/sale', [SalaController::class, 'store']);//da administrator doda novu salu
    Route::put('/sale/{id}', [SalaController::class, 'update']);
    Route::delete('/sale/{id}', [SalaController::class, 'destroy']);

    Route::post('/tipovidogadjaja', [TipDogadjajaController::class, 'store']);
    Route::delete('/tipovidogadjaja/{id}', [TipDogadjajaController::class, 'destroy']);

    Route::post('/karakteristike', [KarakteristikaController::class, 'store']);
    Route::delete('/karakteristike/{id}', [KarakteristikaController::class, 'destroy']);//administrator moze da obrise neku karakteristiku

    Route::get('/rezervacije', [RezervacijaController::class, 'index']);
    Route::get('/rezervacije/{id}', [RezervacijaController::class, 'show']);
    Route::post('/rezervacije', [RezervacijaController::class, 'store']);
    Route::put('/rezervacije/{id}', [RezervacijaController::class, 'update']);
    Route::put('/rezervacije/{id}/otkazi', [RezervacijaController::class, 'otkazi']);
    Route::delete('/rezervacije/{id}', [RezervacijaController::class, 'destroy']);
});