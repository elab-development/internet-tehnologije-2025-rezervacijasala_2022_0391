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
         //$sviTipovi=TipDogadjaja::factory(9)->create();
         $konferencija = TipDogadjaja::create(['naziv' => 'Konferencija']);
         $seminar = TipDogadjaja::create(['naziv' => 'Seminar']);
         $vencanje = TipDogadjaja::create(['naziv' => 'Venčanje']);
         $rodjendan = TipDogadjaja::create(['naziv' => 'Proslava rođendana']);
         $sastanak = TipDogadjaja::create(['naziv' => 'Poslovni sastanak']);
         $radionica = TipDogadjaja::create(['naziv' => 'Radionica (Workshop)']);
         $teambuilding = TipDogadjaja::create(['naziv' => 'Team building']);
         $kulturnidogadjaj = TipDogadjaja::create(['naziv' => 'Kulturni dogadjaj']);

         $sviTipovi = TipDogadjaja::all();

         $sveKarakteristike =Karakteristika::factory(11)->create();

         $this->call(SalaSeeder::class);
         $sveSale = Sala::all();
         
         $sveSale->each(function ($sala) use ($sviTipovi, $sveKarakteristike, $konferencija, $seminar, $vencanje, $rodjendan, $sastanak, $radionica, $teambuilding, $kulturnidogadjaj) {
            // Svakoj sali dodeli 2 nasumična tipa događaja iz kolekcije koju smo gore napravili
            //sala->tipoviDogadjaja()->attach($sviTipovi->random(2));
            
            // Svakoj sali dodeli 3 nasumične karakteristike
            //$sala->karakteristike()->attach($sveKarakteristike->random(3));
            $brojKarakteristika = rand(1, 5);
             $sala->karakteristike()->attach(
             $sveKarakteristike->random($brojKarakteristika)
            );
            if ($sala->naziv === 'Velika Konferencijska Sala') {
                 $sala->tipoviDogadjaja()->attach([
                $konferencija->id, 
                $sastanak->id, 
                $radionica->id,
                $kulturnidogadjaj->id,
                $seminar->id
        ]);
    } else if($sala->naziv === 'Plavi Salon') {
        $sala->tipoviDogadjaja()->attach([
                
                $sastanak->id, 
                $radionica->id,
                $teambuilding->id
        ]);
    } else if($sala->naziv === 'IT Lab 404') {
        $sala->tipoviDogadjaja()->attach([
                
                $sastanak->id, 
                $radionica->id,
                
        ]);
    } else if($sala->naziv === 'Amfiteatar') {
        $sala->tipoviDogadjaja()->attach([
                
                $konferencija->id, 
                $seminar->id,
                $kulturnidogadjaj->id
        ]);
    } else if($sala->naziv === 'Mala sala za sastanke') {
        $sala->tipoviDogadjaja()->attach([
                
                $sastanak->id, 
                $radionica->id,
                
        ]);
    } else if($sala->naziv === 'Laboratorija za fiziku') {
        $sala->tipoviDogadjaja()->attach([
                 
                $radionica->id,
                
        ]);
    } else if($sala->naziv === 'Sala Mali Princ') {
        $sala->tipoviDogadjaja()->attach([
                
                $rodjendan->id, 
                $vencanje->id,
                
        ]);
    } else if($sala->naziv === 'Coworking zona') {
        $sala->tipoviDogadjaja()->attach([
                $seminar->id,
                $sastanak->id, 
                $radionica->id,
                $teambuilding->id

        ]);
    } else if($sala->naziv === 'Sala za video konferencije') {
        $sala->tipoviDogadjaja()->attach([
                
                $sastanak->id, 
                $radionica->id,
                $teambuilding->id
        ]);
    } else if($sala->naziv === 'Svečana dvorana') {
        $sala->tipoviDogadjaja()->attach([
                
                $vencanje->id, 
                $kulturnidogadjaj->id,
                $rodjendan->id
        ]);
    }
    


        });
         Rezervacija::factory(20)->create();

        
    }
}
