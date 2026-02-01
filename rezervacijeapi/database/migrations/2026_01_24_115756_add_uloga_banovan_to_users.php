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
        Schema::table('users', function (Blueprint $table) {
            
            $table->enum('uloga', ['administrator', 'ulogovan', 'neulogovan'])
              ->default('ulogovan') //zato sto neulogovan svakako nije u bazi
              ->after('password');
            $table->boolean('banovan')->default(false)->after('uloga');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['uloga', 'banovan']);
        });
    }
};
