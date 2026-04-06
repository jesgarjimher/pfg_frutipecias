<?php

// use App\Http\Controllers\Api\ProductoController;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Route::get("/productos", [ProductoController::class, "listAll"]);



use App\Http\Controllers\Api\AlergenoController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoriaController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductoController;

Route::get("/productos", [ProductoController::class, "listAll"]);

Route::get("/productos/{id}", [ProductoController::class, "getProduct"]);
Route::get("/alergenos", [AlergenoController::class, "getAlergenos"]);

Route::get("/categorias", [CategoriaController::class, "list"]);
Route::post("/login", [AuthController::class, "login"]);

Route::middleware("auth:sanctum")->group(function() {
    Route::put("/productos/{id}", [ProductoController::class, "update"]);
    Route::post("/productos", [ProductoController::class, "createProducto"]);
    
    Route::delete("/productos/{id}", [ProductoController::class, "destroy"]);

});

