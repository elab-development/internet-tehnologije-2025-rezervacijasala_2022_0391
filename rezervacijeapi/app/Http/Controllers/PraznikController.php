<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PraznikController extends Controller
{
    public function proveriPraznik(Request $request)
    {
        $datum = $request->query('date'); // Očekujemo format YYYY-MM-DD
        
        if (!$datum) {
            return response()->json(['error' => 'Datum je obavezan'], 400);
        }

        // Razbijamo datum na delove jer Abstract API traži godinu, mesec i dan posebno
        $d = date('d', strtotime($datum));
        $m = date('m', strtotime($datum));
        $y = date('Y', strtotime($datum));

        $apiKey = env('ABSTRACT_API_KEY');

        // Šaljemo zahtev eksternom API-ju
        $response = Http::get("https://holidays.abstractapi.com/v1/", [
            'api_key' => $apiKey,
            'country' => 'RS', // Srbija
            'year'    => $y,
            'month'   => $m,
            'day'     => $d
        ]);

        return $response->json();
    }
}