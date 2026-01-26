<?php

use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



Route::get('users/{user_id}', [UserController::class,'show']);
Route::get('users', [UserController::class,'index']);
Route::delete('users/{user_id}', [UserController::class,'destroy']);