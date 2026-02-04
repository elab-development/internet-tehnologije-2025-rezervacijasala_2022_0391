<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

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
            //'password'=>'anja',
            'password' => Hash::make('anja'),
            'email_verified_at' => now(),
            'uloga' => 'administrator',
            'banovan' => false,
        ]);
    }
}
