<?php

namespace Database\Seeders;

use App\Models\TimeSlot;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TimeSlotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $times = ['09:00', '10:00', '14:00', '15:00', '16:00'];
        $dates = ['2026-06-06', '2026-07-01', '2026-08-27'];

        foreach ($dates as $date) {
            foreach ($times as $time) {
                TimeSlot::create([
                    'barbershop_id' => 1,
                    'date' => $date,
                    'time' => $time,
                    'available' => true,
                ]);
            }
        }
    }
}
