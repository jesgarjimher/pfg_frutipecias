<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request) {
        $credentials = $request->validate([ "email" =>"required|email", "password" => "required"]);

        if(Auth::attempt($credentials)) {
            $user = Auth::user();
            return response()->json([ "message" => "Login exitoso", "user" => $user], 200);
        }

        return response()->json(["message" => "Email o contrasena incorrectas"], 401);
    }
}
