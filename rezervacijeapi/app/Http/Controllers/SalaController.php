<?php

namespace App\Http\Controllers;

use App\Models\Sala;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class SalaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    //prikaz svih sala

    public function index(Request $request)
    {
        // 1. ZAPOCINJEMO UPIT RELACIJAMA
        $query = Sala::with(['tipovi_dogadjaja', 'karakteristike']);

        // 2. FILTRIRANJE PO NAZIVU (Search bar)
        if ($request->has('search') && $request->search != '') {
            $query->where('naziv', 'like', '%' . $request->search . '%');
        }

        // 3. FILTRIRANJE PO KAPACITETU
        if ($request->has('kapacitet') && $request->kapacitet != 'sve') {
            if ($request->kapacitet == 'do50') {
                $query->where('kapacitet', '<=', 50);
            } elseif ($request->kapacitet == '50-100') {
                $query->whereBetween('kapacitet', [50, 100]);
            } elseif ($request->kapacitet == '100-200') {
                $query->whereBetween('kapacitet', [100, 200]);
            } elseif ($request->kapacitet == '200-300') {
                $query->whereBetween('kapacitet', [200, 300]);
            } elseif ($request->kapacitet == '300plus') {
                $query->where('kapacitet', '>', 300);
            }
        }

        // FILTRIRANJE PO TIPOVIMA DOGAĐAJA 
        if ($request->has('tipovi') && !empty($request->tipovi)) {
            $tipoviIds = is_array($request->tipovi) ? $request->tipovi : explode(',', $request->tipovi);
            $query->whereHas('tipovi_dogadjaja', function ($q) use ($tipoviIds) {
                $q->whereIn('tipovidogadjaja.id', $tipoviIds);
            });
        }

        // FILTRIRANJE PO KARAKTERISTIKAMA 
        if ($request->has('karakteristike') && !empty($request->karakteristike)) {
            $karakteristikeIds = is_array($request->karakteristike) ? $request->karakteristike : explode(',', $request->karakteristike);

            foreach ($karakteristikeIds as $id) {
                $query->whereHas('karakteristike', function ($q) use ($id) {
                    $q->where('karakteristike.id', $id);
                });
            }
        }

        // 4. SORTIRANJE 
        if ($request->has('sort')) {
            if ($request->sort == 'az') {
                $query->orderBy('naziv', 'asc');
            } elseif ($request->sort == 'za') {
                $query->orderBy('naziv', 'desc');
            } elseif ($request->sort == 'kapacitet_asc') {
                $query->orderBy('kapacitet', 'asc');
            } elseif ($request->sort == 'kapacitet_desc') {
                $query->orderBy('kapacitet', 'desc');
            }
        } else {
            $query->orderBy('id', 'asc');
        }

        // 5. PAGINACIJA 
        $sale = $query->paginate(6);

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
    { 
        $validator = Validator::make($request->all(), [
            'naziv' => 'required|string|max:255',
            'kapacitet' => 'required|integer|min:1',
            'opis' => 'nullable|string',
            'lokacija' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'slike' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $podaci = $validator->validated();

        // OBRADA SLIKE
        if ($request->hasFile('slike')) {
            $putanja = $request->file('slike')->store('slike', 'public');
            $podaci['slike'] = $putanja; 
        }

        $sala = Sala::create($podaci);

        // POVEZIVANJE SA KARAKTERISTIKAMA I TIPOVIMA 
        if ($request->has('karakteristike')) {
            
            $sala->karakteristike()->sync($request->input('karakteristike'));
        }

        if ($request->has('tipovi_dogadjaja')) {
            $sala->tipovi_dogadjaja()->sync($request->input('tipovi_dogadjaja'));
        }

        return response()->json([
            'message' => 'Sala je uspešno kreirana!',
            'sala' => $sala->load(['karakteristike', 'tipovi_dogadjaja'])
        ], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
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
    public function update(Request $request, $id)
    {
        $sala = Sala::find($id);

        if (!$sala) {
            return response()->json(['message' => 'Sala nije pronađena'], 404);
        }

        // 1. Obrada teksta 
        $podaci = $request->only(['naziv', 'opis', 'kapacitet', 'lokacija', 'latitude', 'longitude']);

        // 2. Obrada slike (ako je poslata nova)
        if ($request->hasFile('slike')) {
            if ($sala->slike) {
                Storage::disk('public')->delete($sala->slike);
            }

            // cuvanje nove slike
            $putanja = $request->file('slike')->store('slike', 'public');
            $podaci['slike'] = $putanja;
        }

        // azuriraj salu
        $sala->update($podaci);

        // 3. Sync relacija
        if ($request->has('karakteristike')) {
            $sala->karakteristike()->sync($request->input('karakteristike'));
        }

        if ($request->has('tipovi_dogadjaja')) {
            $sala->tipovi_dogadjaja()->sync($request->input('tipovi_dogadjaja'));
        }

        return response()->json([
            'message' => 'Sala uspešno ažurirana!',
            'data' => $sala->load(['karakteristike', 'tipovi_dogadjaja'])
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        /** @var Sala $sala */
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
