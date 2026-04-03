<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InformacionNutricional extends Model
{
    protected $fillable = [
        'producto_id', 
        'energia', 
        'grasas', 
        'grasas_saturadas', 
        'carbohidratos', 
        'azucares', 
        'proteinas', 
        'sal'
    ];
    //definicion del nombre de la tabla
    protected $table = "informacion_nutricional";
}
