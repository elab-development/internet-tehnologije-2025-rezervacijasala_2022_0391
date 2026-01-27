<?php

use App\Http\Controllers\KarakteristikaController;
use App\Http\Controllers\RezervacijaController;
use App\Http\Controllers\SalaController;
use App\Http\Controllers\TipDogadjajaController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



Route::get('users/{user_id}', [UserController::class,'show']);
Route::get('users', [UserController::class,'index']);
Route::post('users', [UserController::class,'store']);
Route::delete('users/{user_id}', [UserController::class,'destroy']);
Route::put('users/{user_id}', [UserController::class,'update']);

Route::get('sale',[SalaController::class,'index']);//da korisnici vide sta iznajmljuju
Route::post('/sale', [SalaController::class, 'store']);//da administrator doda novu salu
Route::get('sale/{id}', [SalaController::class,'show']);
Route::delete('/sale/{id}', [SalaController::class, 'destroy']);

Route::get('/tipovidogadjaja', [TipDogadjajaController::class, 'index']);
Route::post('/tipovidogadjaja', [TipDogadjajaController::class, 'store']);
Route::delete('/tipovidogadjaja/{id}', [TipDogadjajaController::class, 'destroy']);

Route::get('/karakteristike', [KarakteristikaController::class, 'index']);
Route::post('/karakteristike', [KarakteristikaController::class, 'store']);
Route::delete('/karakteristike/{id}', [KarakteristikaController::class, 'destroy']);//administrator moze da obrise neku karakteristiku

Route::get('/rezervacije', [RezervacijaController::class, 'index']);
Route::post('/rezervacije', [RezervacijaController::class, 'store']);
Route::get('/rezervacije/{id}', [RezervacijaController::class, 'show']);
Route::put('/rezervacije/{id}', [RezervacijaController::class, 'update']);
Route::delete('/rezervacije/{id}', [RezervacijaController::class, 'destroy']);