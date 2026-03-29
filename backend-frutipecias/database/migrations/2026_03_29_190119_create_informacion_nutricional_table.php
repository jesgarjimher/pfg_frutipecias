<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('informacion_nutricional', function (Blueprint $table) {
            $table->id();
            //relacion 1 a 1 con tabla producto
            $table->foreignId('producto_id')->unique()->constrained('productos')->onDelete('cascade');
            $table->decimal('energia', 8, 2);
            $table->decimal('grasas', 8, 2);
            $table->decimal('grasas_saturadas', 8, 2);
            $table->decimal('carbohidratos', 8, 2);
            $table->decimal('azucares', 8, 2);
            $table->decimal('proteinas', 8, 2);
            $table->decimal('sal', 8, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('informacion_nutricional');
    }
};
