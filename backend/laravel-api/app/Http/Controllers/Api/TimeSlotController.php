<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TimeSlot;
use Illuminate\Http\Request;

class TimeSlotController extends Controller
{
    public function index(Request $request)
    {
        $barbershopId = $request->query('barbershop_id');
        $date = $request->query('date');

        if (!$barbershopId) {
            return response()->json(['error' => 'barbershop_id required'], 400);
        }

        $query = TimeSlot::where('barbershop_id', $barbershopId);

        if ($date) {
            $query->where('date', $date);
        }

        $timeSlots = $query->get();

        return response()->json($timeSlots);
    }

    public function show($id)
    {
        $timeSlot = TimeSlot::find($id);
        
        if (!$timeSlot) {
            return response()->json(['error' => 'TimeSlot not found'], 404);
        }

        return response()->json($timeSlot);
    }
}
