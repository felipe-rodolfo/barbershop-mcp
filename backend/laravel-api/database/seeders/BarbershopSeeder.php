<?php

namespace Database\Seeders;

use App\Models\Barbershop;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BarbershopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Barbershop::create([
            'id' => 1,
            'name' => 'Barber MCP Shop',
            'phone' => '(83) 99999-9999',
            'address' => 'João Pessoa, PB',
        ]);
    }
}
