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
                
            $pocetak = fake()->dateTimeBetween('-1 month', '+1 month');
            $kraj = (clone $pocetak)->modify('+' . rand(2, 8) . ' hours');
            $now = now(); // Trenutno vreme
            
            if ($kraj < $now) {
                // Ako je termin već prošao
                $status = fake()->randomElement(['zavrsena', 'otkazana']);
            } elseif ($pocetak <= $now && $kraj >= $now) {
                // Ako je termin trenutno u toku
                $status = 'u_toku';
            } else {
                // Ako je termin u budućnosti
                $status = fake()->randomElement(['na_cekanju', 'potvrdjena', 'otkazana']);
            }
           // $korisnici = User::all()->pluck('id')->toArray();
            return [
            //'idKorisnika'=> $this->faker->randomElement($korisnici),
            'idKorisnika' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'idSale' => Sala::inRandomOrder()->first()?->id ?? Sala::factory(),
            'idTipDogadjaja' => TipDogadjaja::inRandomOrder()->first()?->id ?? TipDogadjaja::factory(),
            
            'pocetak' => $pocetak,
            'kraj' => $kraj,
            'status' => $status,
            
        ];
    }
}
