<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory(15)->create();

        User::create([
            'ime'=> 'Anja',
            'prezime'=> 'Perovic',
            'email'=> 'anjaperovic@gmail.com',
            'password'=>'anja',
            'uloga' => 'administrator',
            'banovan' => false,
        ]);
    }
}
