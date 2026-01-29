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
        Schema::create('karakteristika_sala', function (Blueprint $table) {
            $table->id();
            $table->foreignId('idSale')->constrained('sale')->cascadeOnDelete();
            $table->foreignId('idKarakteristika')->constrained('karakteristike')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('karakteristika_sala');
    }
};
