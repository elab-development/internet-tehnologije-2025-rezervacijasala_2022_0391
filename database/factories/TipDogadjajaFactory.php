<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TipDogadjaja>
 */
class TipDogadjajaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tipovi = [
            'Poslovni sastanak',
            'Konferencija',
            'Radionica (Workshop)',
            'Proslava rođendana',
            'Venčanje',
            'Seminar',
            'Team building',
            'Prezentacija proizvoda',
            'Kulturni događaj',
            
        ];
        return [
            'naziv' => fake()->unique()->randomElement($tipovi),
        ];
    }
}
