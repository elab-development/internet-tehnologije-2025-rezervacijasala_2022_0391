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
        // Kreiramo 3 sale u bazi
        Sala::factory()->count(3)->create();

        //Pozivamo API endpoint
        $response = $this->getJson('/api/sale');

        $response->assertStatus(200)
                 ->assertJsonPath('data.0.id', fn($id) => !is_null($id));
    }

    

}
