"use client"; 

import { useState, useEffect } from "react";
import { Rezervacija, User } from "@/lib/types";
import RezervacijaCard from "@/components/RezervacijaCard";
import Header from "@/components/Header";
import { api } from "@/lib/api";


export default function Home() {
  const [sveRezervacije, setSveRezervacije] = useState<Rezervacija[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("sve");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("ulogovan_korisnik");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    api.getRezervacije() 
      .then((data) => {
        setSveRezervacije(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Greška pri učitavanju rezervacija:", err);
        setLoading(false);
      });
  }, []);

  const handleOtkazi = async (id: number) => {
    if (!confirm("Da li ste sigurni da želite da otkažete ovu rezervaciju?")) return;

    try {
      await api.otkaziRezervaciju(id);

      setSveRezervacije((prev) =>
        prev.map((res) =>
          res.id === id ? { ...res, status: "otkazana" } : res
        )
      );
      alert("Rezervacija je uspešno otkazana.");
    } catch (error: any) {
      alert("Greška: " + error.message);
    }
  };

  // Logika koja filtrira kartice pre nego što se prikažu
  const filtriranePoUlozi = sveRezervacije.filter((res) => {
// Ako je admin, vidi sve
    if (currentUser?.uloga === "administrator") return true;
    // Ako je običan korisnik, vidi samo one gde se idKorisnika poklapa sa njegovim ID-jem
    return res.idKorisnika === currentUser?.id;
  });

  const prikazaneRezervacije = filtriranePoUlozi.filter((res) => {
    if (filter === "sve") return true;
    return res.status === filter;
  });
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-pink-600 font-bold uppercase tracking-widest animate-pulse">
        Učitavanje rezervacija...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <Header />
      <div className="max-w-6xl mx-auto">
        {/* --- DINAMIČKI NASLOV --- */}
        {currentUser?.uloga === "administrator" ? (
          // Naslov za ADMINA
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              Sistem za Rezervacije Sala
            </h1>
            <p className="text-gray-500 uppercase tracking-widest text-xs">Administratorski pregled svih zahteva</p>
          </header>
        ) : (
          // Naslov za OBIČNOG KORISNIKA
          <div className="text-center mb-12 mt-6">
            <h2 className="text-4xl font-light text-pink-950 uppercase tracking-[0.3em]">
              Moje <span className="font-bold">Rezervacije</span>
            </h2>
            <div className="h-1 w-20 bg-pink-200 mx-auto mt-2 rounded-full"></div>
          </div>
        )}
          
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
        

        {/* PRIKAZ FILTRIRANIH KARTICA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {prikazaneRezervacije.map((res) => (
            <RezervacijaCard key={res.id}
             res={res} 
             onOtkazi={handleOtkazi}
             />
          ))}
        </div>

        {prikazaneRezervacije.length === 0 && (
          <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-pink-100">
            <p className="text-pink-900/40 text-lg italic">
              {currentUser?.uloga === "administrator" 
                ? "Trenutno nema rezervacija u sistemu." 
                : "Trenutno nemate svojih rezervacija."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}