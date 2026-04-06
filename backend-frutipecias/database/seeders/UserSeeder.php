<?php

namespace Database\Seeders;

use App\Models\User;
use Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            "name" => "Admin Frutipecias",
            "email" => env("ADMIN_EMAIL"),
            "password" => Hash::make(env("ADMIN_PASSWORD"))
        ]);
    }
}
