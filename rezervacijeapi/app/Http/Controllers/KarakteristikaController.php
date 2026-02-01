<?php

namespace App\Http\Controllers;

use App\Models\Karakteristika;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KarakteristikaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    //prikazi sve karakteristika
    public function index()
    {
        return response()->json(Karakteristika::all());
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
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'naziv' => 'required|string|max:100|unique:karakteristike,naziv',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $karakteristika = Karakteristika::create($validator->validated());

        return response()->json([
            'message' => 'Karakteristika uspešno dodata!',
            'podaci' => $karakteristika
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Karakteristika $karakteristika)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Karakteristika $karakteristika)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Karakteristika $karakteristika)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {/** @var Karakteristika $karakteristika */
        $karakteristika = Karakteristika::find($id);
        if (!$karakteristika) {
            return response()->json(['message' => 'Karakteristika nije pronađena'], 404);
        }
        $karakteristika->delete();
        return response()->json(['message' => 'Uspešno obrisano']);
        
    }
}
