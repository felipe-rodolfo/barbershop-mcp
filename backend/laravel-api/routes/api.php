<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\BarbershopController;
use App\Http\Controllers\Api\HaircutController;
use App\Http\Controllers\Api\TimeSlotController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::get('/barbershops', [BarbershopController::class, 'index']);
    Route::get('/barbershops/{id}', [BarbershopController::class, 'show']);

    Route::get('/haircuts', [HaircutController::class, 'index']);
    Route::get('/haircuts/{id}', [HaircutController::class, 'show']);

    Route::get('/timeslots', [TimeSlotController::class, 'index']);
    Route::get('/timeslots/{id}', [TimeSlotController::class, 'show']);

    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/appointments/{id}', [AppointmentController::class, 'show']);
});