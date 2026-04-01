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
        Schema::create("alergeno_producto", function (Blueprint $table) {
            $table->id();
            $table->foreignId("producto_id")->constrained()->onDelete("cascade");
            $table->foreignId("alergeno_id")->constrained()->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alergeno_producto');
    }
};
