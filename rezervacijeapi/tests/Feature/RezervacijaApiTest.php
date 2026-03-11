<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Sala;
use App\Models\Rezervacija;

class RezervacijaApiTest extends TestCase
{
   use RefreshDatabase;

    public function test_ne_moze_se_rezervisati_zauzeta_sala()
    {
        $this->withoutExceptionHandling();
        $user = User::factory()->create();
        $sala = Sala::factory()->create();
        
        \Illuminate\Support\Facades\DB::table('tipovidogadjaja')->insert([
        'id' => 1,
        'naziv' => 'Test Tip',
    ]);
        // Prva rezervacija
        Rezervacija::create([
            'idKorisnika' => $user->id,
            'idSale' => $sala->id,
            'idTipDogadjaja' => 1,
            'pocetak'     => '2026-06-15 10:00:00',
            'kraj'        => '2026-06-15 12:00:00'
        ]);

        // Pokušaj druge u isto vreme
        $response = $this->actingAs($user)->postJson('/api/rezervacije', [
            'idSale' => $sala->id,
            'idTipDogadjaja' => 1,
            'pocetak' => '2026-06-15 11:00:00', // Preklapa se
            'kraj'    => '2026-06-15 13:00:00'
        ]);

        $response->assertStatus(422);
    }
}
