<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;

class UserApiTest extends TestCase
{
   use RefreshDatabase; //  pravi "lažnu" bazu za svaki test da ne kvarimo prave podatke

    /**
     * da li administrator može uspešno da odbanuje korisnika.
     */
    public function test_admin_moze_da_odbanuje_korisnika()
    {
        // 1. Kreiramo admina koristeći factory
        $admin = User::factory()->create(['uloga' => 'administrator']);
        
        // 2. Kreiramo korisnika koji je trenutno banovan
        $korisnik = User::factory()->create(['banovan' => true]);

        // 3. Pozivamo endpoint koristeći actingAs da simuliramo ulogovanog admina
        $response = $this->actingAs($admin, 'sanctum')
                         ->putJson("/api/users/{$korisnik->id}/unban");

        // 4. Provera: API mora da vrati status 200
        $response->assertStatus(200);

        // 5. Provera: U bazi podataka kolona 'banovan' mora postati 0 (false)
        $this->assertDatabaseHas('users', [
            'id' => $korisnik->id,
            'banovan' => 0
        ]);
    }

    /**
     * Običan korisnik ne sme da pristupi listi svih korisnika.
     */
    public function test_obican_korisnik_ne_moze_da_vidi_listu_svih_korisnika()
    {
        // 1. Kreiramo običnog korisnika
        $korisnik = User::factory()->create(['uloga' => 'ulogovan']);

        // 2. Pokušavamo da pristupimo listi korisnika
        $response = $this->actingAs($korisnik, 'sanctum')
                         ->getJson("/api/users");

        // 3. Provera: Očekujemo 403 (Forbidden) jer samo admin sme ovo
        $response->assertStatus(403);
    }
}
