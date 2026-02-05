<?php

namespace App\Http\Controllers;

use App\Models\Sala;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SalaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    //prikaz svih sala

//STARA INDEX FUNKCIJA

    /*public function index()
    {
        $sale = Sala::all();
        return response()->json($sale);
    }*/


    public function index()
{
    // Povlačimo sve sale, ali i njihove relacije koje smo definisali u modelu
    $sale = Sala::with(['tipovi_dogadjaja', 'karakteristike'])->get();  //tipoviDogadjaja i karakteristike su metode u modelu Sala, ne tabele!
    
    return response()->json($sale);
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
    //dodavanje nove sale
    public function store(Request $request)
    {//$validator = Validator::make($request->all()
        $validator = Validator::make($request->all(), [
            'naziv' => 'required|string|max:255',
            'kapacitet' => 'required|integer|min:1',
            'opis' => 'nullable|string',
            'lokacija' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $sala = Sala::create($validator->validated());

        return response()->json([
            'message' => 'Sala je uspešno kreirana!',
            'sala' => $sala
        ], 201);
    }
    

    /**
     * Display the specified resource.
     */
    public function show($id)
    {/*
        $sala = Sala::with(['karakteristike', 'dozvoljeniTipoviDogadjaja'])->find($id);

    if (!$sala) {
        return response()->json(['message' => 'Sala nije pronađena'], 404);
    }

    return response()->json($sala);*/

    // VISE NE OVO
    //$sala = Sala::find($id);

    //NEGO OVO
    $sala = Sala::with(['karakteristike', 'tipovi_dogadjaja'])->find($id);

    if (!$sala) {
        return response()->json(['message' => 'Sala nije pronadjena'], 404);
    }

    return response()->json($sala, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sala $sala)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sala $sala)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {/** @var Sala $sala */
    $sala = Sala::find($id);

    
    if (!$sala) {
        return response()->json(['message' => 'Sala nije pronađena u bazi'], 404);
    }
    $sala->delete();
   
    return response()->json([
        'message' => 'Sala je uspešno obrisana!'
    ], 200);
    }
}
