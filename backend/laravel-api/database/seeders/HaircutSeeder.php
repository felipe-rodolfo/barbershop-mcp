<?php

namespace Database\Seeders;

use App\Models\Haircut;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HaircutSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Haircut::create([
            'barbershop_id' => 1,
            'name' => 'Corte Clássico',
            'price' => 50.00,
            'description' => 'Corte tradicional com detalhe nas laterais',
        ]);

        Haircut::create([
            'barbershop_id' => 1,
            'name' => 'Corte Militar',
            'price' => 25.00,
            'description' => 'Corte militar bem curto',
        ]);

        Haircut::create([
            'barbershop_id' => 1,
            'name' => 'Corte Fade',
            'price' => 85.00,
            'description' => 'Corte degradê moderno',
        ]);
    }
}
