<?php

namespace Database\Seeders;

use App\Models\Sala;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SalaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sale = [
            [
                'naziv' => 'Velika Konferencijska Sala',
                'kapacitet' => 150,
                'lokacija' => 'Patrijarha Varnave 37, Beograd, Vračar',
                'slike' => 'konfverencijskaSala.jpg',
                'opis' => 'Moderna sala opremljena najnovijom audio-vizuelnom tehnikom, idealna za velike seminare.',
                'latitude' => 44.79731900,
                'longitude' => 20.46990100,
            ],
            [
                'naziv' => 'Plavi Salon',
                'kapacitet' => 30,
                'lokacija' => 'Maksima Gorkog 19, Novi Sad, Centar',
                'slike' => 'plaviSalon.jpg',
                'opis' => 'Intiman prostor pogodan za poslovne sastanke i manje radionice.',
                'latitude' => 45.250588,
                'longitude' => 19.848192,
            ],
            [
                'naziv' => 'IT Lab 404',
                'kapacitet' => 30,
                'lokacija' => 'Bulevar Mediana 21, Niš, Medijana',
                'slike' => 'ITLab.jpg',
                'opis' => 'Sala sa računarskom opremom za tehničke obuke.',
                'latitude' => 43.311221,
                'longitude' => 21.935659,
            ],
            [
                'naziv' => 'Amfiteatar',
                'kapacitet' => 300,
                'lokacija' => 'Omladinskih brigada 33, Beograd, Novi Beograd',
                'slike' => 'amfiteatar.jpg',
                'opis' => 'Idealan za masovna predavanja, seminare i svečane akademije.',
                'latitude' => 44.810554,
                'longitude' => 20.403118,
            ],
            [
                'naziv' => 'Mala sala za sastanke',
                'kapacitet' => 10,
                'lokacija' => 'Vojvode Stepe 137, Beograd, Voždovac',
                'slike' => 'malaSala.jpg',
                'opis' => 'Tiha sala za brze konsultacije i timske sastanke.',
                'latitude' => 44.777900,
                'longitude' => 20.474423,
            ],
            [
                'naziv' => 'Laboratorija za fiziku',
                'kapacitet' => 25,
                'lokacija' => 'Narodnog fronta 73, Novi Sad, Liman',
                'slike' => 'fizika.jpg',
                'opis' => 'Specijalizovana sala sa laboratorijskim stolovima i opremom za eksperimente.',
                'latitude' => 45.237856,
                'longitude' => 19.830074,
            ],
            [
                'naziv' => 'Sala Mali Princ',
                'kapacitet' => 80,
                'lokacija' => 'Kneginje Ljubice 40, Beograd, Dorćol',
                'slike' => 'salamaliprinc.jpg',
                'opis' => 'Uživajte u prigušenim svetlima i toploj atmosferi našeg prostora, stvorenog za proslave koje se pamte po bliskosti.',
                'latitude' => 44.823307,
                'longitude' => 20.466413,
            ],
            [
                'naziv' => 'Coworking zona',
                'kapacitet' => 50,
                'lokacija' => 'Zmaj Jovina 4, Beograd, Zemun',
                'slike' => 'coworking.jpg',
                'opis' => 'Otvoren prostor za zajednički rad studenata u opuštenoj atmosferi.',
                'latitude' => 44.845315,
                'longitude' => 20.411131,
            ],
            [
                'naziv' => 'Sala za video konferencije',
                'kapacitet' => 15,
                'lokacija' => 'Vojislava Ilića 30, Kragujevac, Bresnica',
                'slike' => 'videoKonferencija.jpg',
                'opis' => 'Specijalizovana sala sa kamerama visoke rezolucije za online sastanke.',
                'latitude' => 43.998306,
                'longitude' => 20.931127,
            ],
            [
                'naziv' => 'Svečana dvorana',
                'kapacitet' => 200,
                'lokacija' => 'Kosančićev venac 29, Beograd, Stari grad',
                'slike' => 'svecanaDvorana.jpg',
                'opis' => 'Prostrana dvorana pogodna za proslave i velike prezentacije.',
                'latitude' => 44.817465,
                'longitude' => 20.450952,
            ],
        ];

        foreach ($sale as $s) {
            Sala::create($s);
        }
    }
}
