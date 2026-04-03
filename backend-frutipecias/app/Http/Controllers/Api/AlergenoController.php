<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alergeno;
use Illuminate\Http\Request;

class AlergenoController extends Controller
{
    public function getAlergenos() {
        return response()->json(Alergeno::all());
    }
}
