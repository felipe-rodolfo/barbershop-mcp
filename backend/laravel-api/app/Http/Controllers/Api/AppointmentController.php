<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\TimeSlot;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $barbershopId = $request->query('barbershop_id');

        if (!$barbershopId) {
            return response()->json(['error' => 'barbershop_id required'], 400);
        }

        $appointments = Appointment::where('barbershop_id', $barbershopId)->get();

        return response()->json($appointments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'barbershop_id' => 'required|exists:barbershops,id',
            'haircut_id' => 'required|exists:haircuts,id',
            'time_slot_id' => 'required|exists:time_slots,id',
            'customer_name' => 'required|string',
            'customer_phone' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $timeSlot = TimeSlot::find($validated['time_slot_id']);
        if (!$timeSlot->available) {
            return response()->json(['error' => 'Time slot not available'], 400);
        }

        $appointment = Appointment::create($validated);

        $timeSlot->update(['available' => false]);

        return response()->json($appointment, 201);
    }

    public function show($id)
    {
        $appointment = Appointment::find($id);
        
        if (!$appointment) {
            return response()->json(['error' => 'Appointment not found'], 404);
        }

        return response()->json($appointment);
    }
}
