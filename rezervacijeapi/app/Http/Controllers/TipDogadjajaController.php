<?php

namespace App\Http\Controllers;

use App\Models\Karakteristika;
use App\Models\TipDogadjaja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TipDogadjajaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    //prikazi sve tipove
    public function index()
    {
        $tipovi = TipDogadjaja::all();
        return response()->json($tipovi);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    //dodaj novi tip dogadjaja
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'naziv' => 'required|string|max:100|unique:tipovidogadjaja,naziv',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $tip = TipDogadjaja::create($validator->validated());

        return response()->json([
            'message' => 'Tip događaja je uspešno dodat!',
            'tip' => $tip
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    //prikazi jedan tip do
    public function show($id)
    {
       
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TipDogadjaja $tipDogadjaja)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TipDogadjaja $tipDogadjaja)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {/** @var TipDogadjaja $tip */
       
        $tip = TipDogadjaja::find($id);
      
        if (!$tip) {
            return response()->json([
                'message' => 'Greška: Taj tip događaja ne postoji u bazi.'
            ], 404);
        }
        $tip->delete();
        return response()->json([
            'message' => 'Tip događaja je uspešno izbrisan!'
        ]);
    }
}

