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
        Schema::create('rezervacije', function (Blueprint $table) {
            $table->id();
             $table->foreignId('idKorisnika')->constrained('users')->cascadeOnDelete();  //ako vise nema korisnika nema ni njegovih rezervacija
            $table->foreignId('idSale');
            $table->foreignId('idTipDogadjaja')->constrained('tipovidogadjaja')->cascadeOnDelete();
            $table->dateTime('pocetak');
            $table->dateTime('kraj');
            $table->enum('status', ['otkazana', 'u_toku', 'zavrsena', 'potvrdjena', 'na_cekanju'])
            ->default('na_cekanju'); //+ na_cekanju? ili bez toga ako se automatski prihvata ako je sala slobodna

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rezervacije');
    }
};
