<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barbershop;

class BarbershopController extends Controller
{
    public function index()
    {
        return response()->json(Barbershop::all());
    }

    public function show($id)
    {
        $barbershop = Barbershop::find($id);
        
        if (!$barbershop) {
            return response()->json(['error' => 'Barbershop not found'], 404);
        }

        return response()->json($barbershop);
    }
}
