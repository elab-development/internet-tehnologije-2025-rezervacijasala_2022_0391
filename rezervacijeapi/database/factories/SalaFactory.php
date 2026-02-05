<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sala>
 */
class SalaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $nasumicneSlike = ['amfiteatar.jpg', 'coworking.jpg', 'ITLab.jpg', 'rektorat.jpg'];
        return [
            'naziv' => fake()->unique()->company(),
            'kapacitet' => fake()->numberBetween(10,2000),
            'opis' => fake()->sentence(7),
            'lokacija' => fake()->randomElement(['Beograd', 'Novi Sad', 'Subotica', 'Nis', 'Kragujevac', 'Kraljevo']),
            'slike' => fake()->randomElement($nasumicneSlike) . ',' . fake()->randomElement($nasumicneSlike),

            
            
        ];
    }
}
