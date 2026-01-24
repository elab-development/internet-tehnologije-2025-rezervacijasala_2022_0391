<?php

namespace Database\Seeders;

use App\Models\Karakteristika;
use App\Models\Rezervacija;
use App\Models\Sala;
use App\Models\TipDogadjaja;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
         User::factory(10)->create();
         TipDogadjaja::factory(9)->create();
         Karakteristika::factory(10)->create();
         Sala::factory(10)->create();
         Rezervacija::factory(20)->create();

        
    }
}
