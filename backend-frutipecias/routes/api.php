<?php

// use App\Http\Controllers\Api\ProductoController;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Route::get("/productos", [ProductoController::class, "listAll"]);



use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductoController;

Route::get("/productos", [ProductoController::class, "listAll"]);

Route::delete("/productos/{id}", [ProductoController::class, "destroy"]);
