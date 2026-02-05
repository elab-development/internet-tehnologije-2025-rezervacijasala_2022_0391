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
                'lokacija' => 'Beograd, Vračar',
                'slike' => 'konfverencijskaSala.jpg',
                'opis' => 'Moderna sala opremljena najnovijom audio-vizuelnom tehnikom, idealna za velike seminare.',
            ],
            [
                'naziv' => 'Plavi Salon',
                'kapacitet' => 30,
                'lokacija' => 'Novi Sad, Centar',
                'slike' => 'plaviSalon.jpg',
                'opis' => 'Intiman prostor pogodan za poslovne sastanke i manje radionice.',
            ],
            [
                'naziv' => 'IT Lab 404',
                'kapacitet' => 30,
                'lokacija' => 'Niš, Medijana',
                'slike' => 'ITLab.jpg',
                'opis' => 'Sala sa računarskom opremom za tehničke obuke.',
            ],
            [
                'naziv' => 'Amfiteatar',
                'kapacitet' => 300,
                'lokacija' => 'Beograd, Novi Beograd',
                'slike' => 'amfiteatar.jpg',
                'opis' => 'Idealan za masovna predavanja, seminare i svečane akademije.',
            ],
            [
                'naziv' => 'Mala sala za sastanke',
                'kapacitet' => 10,
                'lokacija' => 'Beograd, Voždovac',
                'slike' => 'malaSala.jpg',
                'opis' => 'Tiha sala za brze konsultacije i timske sastanke.',
            ],
            [
                'naziv' => 'Laboratorija za fiziku',
                'kapacitet' => 25,
                'lokacija' => 'Novi Sad, Liman',
                'slike' => 'fizika.jpg',
                'opis' => 'Specijalizovana sala sa laboratorijskim stolovima i opremom za eksperimente.',
            ],
            [
                'naziv' => 'Sala Mali Princ',
                'kapacitet' => 80,
                'lokacija' => 'Beograd, Dorćol',
                'slike' => 'salamaliprinc.jpg',
                'opis' => 'Uživajte u prigušenim svetlima i toploj atmosferi našeg prostora, stvorenog za proslave koje se pamte po bliskosti.',
            ],
            [
                'naziv' => 'Coworking zona',
                'kapacitet' => 50,
                'lokacija' => 'Beograd, Zemun',
                'slike' => 'coworking.jpg',
                'opis' => 'Otvoren prostor za zajednički rad studenata u opuštenoj atmosferi.',
            ],
            [
                'naziv' => 'Sala za video konferencije',
                'kapacitet' => 15,
                'lokacija' => 'Kragujevac, Bresnica',
                'slike' => 'videoKonferencija.jpg',
                'opis' => 'Specijalizovana sala sa kamerama visoke rezolucije za online sastanke.',
            ],
            [
                'naziv' => 'Svečana dvorana',
                'kapacitet' => 200,
                'lokacija' => 'Beograd, Stari grad',
                'slike' => 'svecanaDvorana.jpg',
                'opis' => 'Prostrana dvorana pogodna za proslave i velike prezentacije.',
            ],
        ];

        foreach ($sale as $s) {
            Sala::create($s);
        }
    }
}
