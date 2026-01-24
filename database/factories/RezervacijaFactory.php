<?php

namespace Database\Factories;
use App\Models\User;           
use App\Models\TipDogadjaja;
use App\Models\Sala;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Rezervacija>
 */
class RezervacijaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
           // $korisnici = User::all()->pluck('id')->toArray();
            return [
            //'idKorisnika'=> $this->faker->randomElement($korisnici),
            'idKorisnika' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'idSale' => Sala::inRandomOrder()->first()?->id ?? Sala::factory(),
            'idTipDogadjaja' => TipDogadjaja::inRandomOrder()->first()?->id ?? TipDogadjaja::factory(),
            'naziv' => fake()->unique()->company(),
            'pocetak' => fake()->dateTimeBetween('-2 months', '+1 month'),
            'kraj' => fake()->dateTimeBetween('+1 month', '+2 months'),
            'status' => fake()->randomElement(['otkazana', 'u_toku', 'zavrsena', 'potvrdjena', 'na_cekanju']),
            
        ];
    }
}
