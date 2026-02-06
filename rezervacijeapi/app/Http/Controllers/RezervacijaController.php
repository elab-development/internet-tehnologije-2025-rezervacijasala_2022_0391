<?php

namespace App\Http\Controllers;

use App\Models\Rezervacija;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RezervacijaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //  with()  povlaci i podatke o sali i korisniku, ne samo id
        return response()->json(Rezervacija::with(['korisnik', 'sala', 'tipDogadjaja'])->get());
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
            'idKorisnika' => 'required|exists:users,id',
            'idSale' => 'required|exists:sale,id',
            'idTipDogadjaja' => 'required|exists:tipovidogadjaja,id',
            'pocetak' => 'required|date|after:now',
            'kraj' => 'required|date|after:pocetak',
            'status' => 'required|string|in:otkazana, u_toku, zavrsena, potvrdjena,na_cekanju' // npr. 'rezervisano', 'otkazano'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
                // provera preklapanja
            $preklapanje = Rezervacija::where('idSale', $request->idSale)
                ->where('status', '!=', 'otkazana') // Ignorišemo otkazane
                ->where(function ($query) use ($request) {
                    $query->where('pocetak', '<', $request->kraj)
                        ->where('kraj', '>', $request->pocetak);
                })->exists();

            if ($preklapanje) {
                return response()->json([
                    'message' => 'Izabrani termin je već zauzet. Molimo odaberite drugo vreme.'
                ], 409); 
            }
        $rezervacija = Rezervacija::create($request->all());

        return response()->json([
            'message' => 'Rezervacija je uspešno kreirana!',
            'podaci' => $rezervacija
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $rezervacija = Rezervacija::with(['korisnik', 'sala', 'tipDogadjaja'])->find($id);
        if (!$rezervacija) {
            return response()->json(['message' => 'Rezervacija nije pronađena'], 404);
        }
        return response()->json($rezervacija);
    }
    

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Rezervacija $rezervacija)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
       try {
        /** @var Rezervacija $rezervacija */
        $rezervacija = Rezervacija::find($id);

        if (!$rezervacija) {
            return response()->json(['message' => 'Nema je u bazi!'], 404);
        }

        // Koristimo update, ali hvatamo grešku ako baza odbije
        $rezervacija->update($request->all());

        return response()->json([
            'message' => 'Uspešno izmenjeno!',
            'podaci' => $rezervacija
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'poruka' => 'Baza odbija izmenu za ID ' . $id,
            'greska_detalji' => $e->getMessage() // Ovde će pisati šta ne valja
        ], 500);
    }
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {/** @var Rezervacija $rezervacija */
        $rezervacija = Rezervacija::find($id);

    if (!$rezervacija) {
        return response()->json(['message' => 'Rezervacija nije pronađena'], 404);
    }

    $rezervacija->delete();

    return response()->json(['message' => 'Rezervacija je uspešno otkazana/obrisana']);
    }

    public function otkazi(Request $request,$id)
{
    $rezervacija = Rezervacija::findOrFail($id);
    $user = $request->user();
    if (!$user) {
        return response()->json(['message' => 'Niste autorizovani'], 401);
    }
    
    // Proveri da li rezervacija pripada ulogovanom korisniku
    if ($rezervacija->idKorisnika !== $user->id && $user->uloga !== 'administrator') {
        return response()->json(['message' => 'Nemate ovlašćenje za ovu akciju'], 403);
    }

    $rezervacija->status = 'otkazana';
    $rezervacija->save();

    return response()->json([
        'message' => 'Rezervacija uspešno otkazana',
        'rezervacija' => $rezervacija
    ]);
}
    public function proveriDostupnost(Request $request)
{
    $request->validate([
        'idSale' => 'required|exists:sale,id',
        'pocetak' => 'required|date',
        'kraj' => 'required|date|after:pocetak',
    ]);

    $preklapanje = Rezervacija::where('idSale', $request->idSale)
        ->where('status', '!=', 'otkazana')
        ->where(function ($query) use ($request) {
            $query->where('pocetak', '<', $request->kraj)
                  ->where('kraj', '>', $request->pocetak);
        })->exists();

    return response()->json(['slobodno' => !$preklapanje]);
}
}
