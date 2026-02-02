<?php

namespace Database\Seeders;

use App\Models\Karakteristika;
use App\Models\Rezervacija;
use App\Models\Sala;
use App\Models\TipDogadjaja;
use App\Models\User;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        DB::statement("SET FOREIGN_KEY_CHECKS=0");
         Rezervacija::truncate();
         Sala::truncate();
         Karakteristika::truncate();
         TipDogadjaja::truncate();
         User::truncate(); 

         DB::statement("SET FOREIGN_KEY_CHECKS=1");

         $this->call([
            UserSeeder::class,
         ]);
         User::factory(15)->create();
         $sviTipovi=TipDogadjaja::factory(9)->create();
         $sveKarakteristike =Karakteristika::factory(11)->create();
         Sala::factory(10)->create()->each(function ($sala) use ($sviTipovi, $sveKarakteristike) {
            // Svakoj sali dodeli 2 nasumična tipa događaja iz kolekcije koju smo gore napravili
            $sala->tipoviDogadjaja()->attach($sviTipovi->random(2));
            
            // Svakoj sali dodeli 3 nasumične karakteristike
            $sala->karakteristike()->attach($sveKarakteristike->random(3));
        });
         Rezervacija::factory(20)->create();

        
    }
}
