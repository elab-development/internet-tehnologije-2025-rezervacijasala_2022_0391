<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Sala;

class SalaApiTest extends TestCase
{
   use RefreshDatabase;

    /**
     * Provera da li bilo ko (čak i neulogovan) može da vidi listu sala.
     */
    public function test_svako_moze_da_vidi_listu_sala()
    {
        // 1. Kreiramo 3 sale u bazi
        Sala::factory()->count(3)->create();

        // 2. Pozivamo API endpoint
        $response = $this->getJson('/api/sale');

        // 3. Provera statusa i strukture (mora vratiti 200 i listu)
        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    /**
     * Samo admin sme da doda novu salu.
     */

    /*
    public function test_admin_moze_da_doda_novu_salu()
    {
        $admin = User::factory()->create(['uloga' => 'administrator']);
        
        $novaSala = [
            'naziv' => 'Sala 101',
            'kapacitet' => 50,
            'opis' => 'Nova sala sa projektorom'
        ];

        $response = $this->actingAs($admin, 'sanctum')
                         ->postJson('/api/sale', $novaSala);

        $response->assertStatus(201);
        $this->assertDatabaseHas('sale', ['naziv' => 'Sala 101']);
    }*/
}
