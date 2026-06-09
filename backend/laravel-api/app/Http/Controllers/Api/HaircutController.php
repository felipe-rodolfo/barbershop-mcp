<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Haircut;
use Illuminate\Http\Request;

class HaircutController extends Controller
{
    public function index(Request $request)
    {
        $barbershopId = $request->query('barbershop_id');
        
        if (!$barbershopId) {
            return response()->json(['error' => 'barbershop_id required'], 400);
        }

        $haircuts = Haircut::where('barbershop_id', $barbershopId)->get();
        
        return response()->json($haircuts);
    }

    public function show($id)
    {
        $haircut = Haircut::find($id);
        
        if (!$haircut) {
            return response()->json(['error' => 'Haircut not found'], 404);
        }

        return response()->json($haircut);
    }
}
