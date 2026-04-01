<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alergeno extends Model
{
    public function productos() {
        return $this->belongsToMany(Producto::class);
    }
}
