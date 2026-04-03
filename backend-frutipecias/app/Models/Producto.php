<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $fillable = [
        'nombre', 
        'ingredientes', 
        'nutriscore', 
        'descripcion', 
        'categoria_id'
    ];
    public function categoria() {
        return $this->belongsTo(Categoria::class);
    }

    public function informacionNutricional() {
        return $this->hasOne(InformacionNutricional::class);
    }

    public function alergenos() {
        return $this->belongsToMany(Alergeno::class);
    }
}
