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
            $token = $user->createToken("token-admin")->plainTextToken;
            return response()->json([ "message" => "Login exitoso", "user" => $user, "access_token" => $token, "token_type" => "Bearer"], 200);
        }

        return response()->json(["message" => "Email o contrasena incorrectas"], 401);
    }
}
