"use client"; // Ovo mora biti na vrhu da bi filteri radili!

import { useState } from "react";
import { Rezervacija } from "@/app/lib/types";
import RezervacijaCard from "@/components/RezervacijaCard";


const sveRezervacije: Rezervacija[] = [
    { idRezervacije: 1, pocetak: "2026-02-10T10:00:00", kraj: "2026-02-10T12:00:00", status: "potvrdjena", idKorisnika: 2, idSale: 1, idTipDogadjaja: 2 },
    { idRezervacije: 2, pocetak: "2026-02-11T14:00:00", kraj: "2026-02-11T16:00:00", status: "na_cekanju", idKorisnika: 3, idSale: 2, idTipDogadjaja: 1 },
    { idRezervacije: 3, pocetak: "2026-02-12T09:00:00", kraj: "2026-02-12T13:00:00", status: "zavrsena", idKorisnika: 5, idSale: 3, idTipDogadjaja: 3 },
    { idRezervacije: 4, pocetak: "2026-02-15T10:00:00", kraj: "2026-02-15T18:00:00", status: "otkazana", idKorisnika: 6, idSale: 4, idTipDogadjaja: 6 },
    { idRezervacije: 5, pocetak: "2026-02-16T12:00:00", kraj: "2026-02-16T14:00:00", status: "u_toku", idKorisnika: 10, idSale: 5, idTipDogadjaja: 1 },
    { idRezervacije: 6, pocetak: "2026-02-17T09:00:00", kraj: "2026-02-17T11:00:00", status: "potvrdjena", idKorisnika: 7, idSale: 6, idTipDogadjaja: 3 },
    { idRezervacije: 7, pocetak: "2026-02-20T17:00:00", kraj: "2026-02-20T22:00:00", status: "na_cekanju", idKorisnika: 8, idSale: 7, idTipDogadjaja: 5 },
    { idRezervacije: 8, pocetak: "2026-02-21T10:00:00", kraj: "2026-02-21T15:00:00", status: "zavrsena", idKorisnika: 2, idSale: 8, idTipDogadjaja: 7 },
    { idRezervacije: 9, pocetak: "2026-02-22T13:00:00", kraj: "2026-02-22T15:00:00", status: "u_toku", idKorisnika: 3, idSale: 9, idTipDogadjaja: 8 },
    { idRezervacije: 10, pocetak: "2026-02-25T19:00:00", kraj: "2026-02-25T23:00:00", status: "otkazana", idKorisnika: 5, idSale: 10, idTipDogadjaja: 4 },
    { idRezervacije: 11, pocetak: "2026-02-26T10:00:00", kraj: "2026-02-26T12:00:00", status: "potvrdjena", idKorisnika: 1, idSale: 1, idTipDogadjaja: 6 },
    { idRezervacije: 12, pocetak: "2026-02-27T08:00:00", kraj: "2026-02-27T10:00:00", status: "na_cekanju", idKorisnika: 10, idSale: 5, idTipDogadjaja: 1 },
    { idRezervacije: 13, pocetak: "2026-03-01T15:00:00", kraj: "2026-03-01T17:00:00", status: "zavrsena", idKorisnika: 7, idSale: 2, idTipDogadjaja: 3 },
    { idRezervacije: 14, pocetak: "2026-03-02T11:00:00", kraj: "2026-03-02T14:00:00", status: "potvrdjena", idKorisnika: 3, idSale: 4, idTipDogadjaja: 9 },
    { idRezervacije: 15, pocetak: "2026-03-05T10:00:00", kraj: "2026-03-05T12:00:00", status: "potvrdjena", idKorisnika: 8, idSale: 9, idTipDogadjaja: 1 }
];

export default function Home() {
  const [filter, setFilter] = useState("sve");

  // Logika koja filtrira kartice pre nego što se prikažu
  const prikazaneRezervacije = sveRezervacije.filter((res) => {
    if (filter === "sve") return true;
    return res.status === filter;
  });

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Sistem za Rezervacije Sala
          </h1>
          
          {/* DUGMIĆI ZA FILTRIRANJE */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {["sve", "na_cekanju", "potvrdjena", "u_toku", "zavrsena", "otkazana"].map((kat) => (
              <button
                key={kat}
                onClick={() => setFilter(kat)}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  filter === kat 
                  ? "bg-pink-600 text-white shadow-md" 
                  : "bg-white text-gray-600 hover:bg-pink-50"
                }`}
              >
                {kat.replace("_", " ").toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        {/* PRIKAZ FILTRIRANIH KARTICA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {prikazaneRezervacije.map((res) => (
            <RezervacijaCard key={res.idRezervacije} res={res} />
          ))}
        </div>

        {prikazaneRezervacije.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            Nema rezervacija sa ovim statusom.
          </div>
        )}
      </div>
    </main>
  );
}