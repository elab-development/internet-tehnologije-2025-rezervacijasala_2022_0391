<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\KarakteristikaController;
use App\Http\Controllers\RezervacijaController;
use App\Http\Controllers\SalaController;
use App\Http\Controllers\TipDogadjajaController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HolidayController;
use App\Http\Controllers\PraznikController;

//nezasticene rute kojima mogu da pristupe i korisnici koji nisu ulogovani

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/proveri-praznik', [PraznikController::class, 'proveriPraznik']);

Route::get('/sale/all', [SalaController::class, 'all']);

Route::get('sale', [SalaController::class, 'index']); //da korisnici vide sta iznajmljuju
Route::get('sale/{id}', [SalaController::class, 'show']);

Route::get('/tipovidogadjaja', [TipDogadjajaController::class, 'index']);
Route::get('/karakteristike', [KarakteristikaController::class, 'index']);

Route::get('/email/verify/{id}', [AuthController::class, 'verifyEmail'])->name('verification.verify');

//moraju da imaju token

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::delete('users/{user_id}', [UserController::class, 'destroy']); //za brisanje naloga


    Route::get('/rezervacije', [RezervacijaController::class, 'index']);
    Route::get('/rezervacije/{id}', [RezervacijaController::class, 'show']);
    Route::post('/rezervacije', [RezervacijaController::class, 'store']);
    Route::put('/rezervacije/{id}', [RezervacijaController::class, 'update']);
    Route::put('/rezervacije/{id}/otkazi', [RezervacijaController::class, 'otkazi']);



    //samo admin
    Route::middleware('admin')->group(function () {
        Route::get('users', [UserController::class, 'index']); //za izlistavanje svih korisnika
        Route::put('/users/{id}/ban', [UserController::class, 'ban']);
        Route::put('/users/{id}/unban', [UserController::class, 'unban']);
        Route::post('/sale', [SalaController::class, 'store']); //da administrator doda novu salu
        Route::put('/sale/{id}', [SalaController::class, 'update']);
        Route::delete('/sale/{id}', [SalaController::class, 'destroy']);

        Route::post('/tipovidogadjaja', [TipDogadjajaController::class, 'store']);
        Route::delete('/tipovidogadjaja/{id}', [TipDogadjajaController::class, 'destroy']);

        Route::post('/karakteristike', [KarakteristikaController::class, 'store']);
        Route::delete('/karakteristike/{id}', [KarakteristikaController::class, 'destroy']); //administrator moze da obrise neku karakteristiku

        Route::delete('/rezervacije/{id}', [RezervacijaController::class, 'destroy']);

        Route::put('/rezervacije/{id}/potvrdi', [RezervacijaController::class, 'potvrdi']); // administrator potvrdjuje rezervaciju



    });



});


#za punjenje baze u renderu
/*
use Illuminate\Support\Facades\Artisan;

Route::get('/init-db', function () {
    try {
        Artisan::call('migrate:fresh', ['--seed' => true, '--force' => true]);
        return "Baza je uspesno osvezena i napunjena podacima!";
    } catch (\Exception $e) {
        return "Greska pri inicijalizaciji: " . $e->getMessage();
    }
}); */

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
/*
Route::get('/init-db', function () {
    try {
        // Za PostgreSQL koristimo drugu metodu za isključivanje provere ključeva
        DB::statement('SET CONSTRAINTS ALL DEFERRED');
        
        Artisan::call('migrate:fresh', [
            '--seed' => true, 
            '--force' => true
        ]);
        
        return "Baza (PostgreSQL) je uspesno osvezena i napunjena podacima!";
    } catch (\Exception $e) {
        return "Greska pri inicijalizaciji: " . $e->getMessage();
    }
});*/

Route::get('/init-db', function () {
    try {
        Artisan::call('migrate:fresh', ['--seed' => true, '--force' => true]);
        return "Baza je uspesno osvezena!";
    } catch (\Exception $e) {
        return "Greska: " . $e->getMessage();
    }
});
