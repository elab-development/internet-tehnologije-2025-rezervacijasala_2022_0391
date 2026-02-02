<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Karakteristika>
 */
class KarakteristikaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $nizkarakteristika = [
            'Klima uređaj',
            'Projektor',
            'Bela tabla',
            'Ozvučenje',
            'Brzi internet (Wi-Fi)',
            'Video nadzor',
            'Flipchart',
            'Televizor 4K',
            'Aparat za kafu',
            'Ergonomske stolice',
            'Računari'
        ];
        return [
            'naziv'=> fake()->unique()->randomElement($nizkarakteristika),
        ];
    }
}
