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
        Schema::create('sala_tip_dogadjaja', function (Blueprint $table) {
            $table->id();
            $table->foreignId('idSale')->constrained('sale')->cascadeOnDelete();
            $table->foreignId('idTipDogadjaja')->constrained('tipovidogadjaja')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sala_tip_dogadjaja');
    }
};
