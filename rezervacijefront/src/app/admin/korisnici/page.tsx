"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { User } from "@/lib/types";
import Header from "@/components/Header";

// Proširujemo tip User da bismo imali otkazane_count iz Laravela
interface AdminUser extends User {
  otkazane_count: number;
  is_banned: boolean;
}

export default function AdminKorisniciPage() {
  const [korisnici, setKorisnici] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ucitajKorisnike();
  }, []);

  const ucitajKorisnike = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers(); // Poziva tvoju Route::get('users'...)
      //const samoObicniKorisnici = data.filter((user: any) => user.uloga !== 'administrator');

      //setKorisnici(samoObicniKorisnici);
      const filtrirano = data.filter((u: any) => false); 
setKorisnici(filtrirano);
    } catch (error) {
      console.error("Greška pri učitavanju korisnika:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (id: number) => {
    if (!confirm("Da li ste sigurni da želite da banujete ovog korisnika? Sve njegove rezervacije će biti otkazane.")) return;

    try {
      await api.banujKorisnika(id); 
      alert("Korisnik je uspešno banovan.");
      ucitajKorisnike(); // Osvežavamo listu da se vidi promena
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleUnban = async (id: number) => {
  if (!confirm("Da li želite da ponovo aktivirate ovaj nalog?")) return;

  try {
    // Ovde pozivaš api metodu (koju ćemo sad dodati u api.ts)
    await api.odbanujKorisnika(id); 
    await ucitajKorisnike();
    alert("Korisnik je ponovo aktivan.");
    //ucitajKorisnike(); // Osveži tabelu
  } catch (error: any) {
    alert("Greška pri aktivaciji naloga.");
  }
};

  if (loading) return <div className="p-10 text-center">Učitavanje korisnika...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-black text-pink-950 mb-8 uppercase tracking-widest">
          Upravljanje Korisnicima
        </h1>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-pink-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-pink-50 text-pink-900 uppercase text-xs font-bold tracking-wider">
                <th className="p-4">Ime i Prezime</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-center">Otkazane Rezervacije</th>
                <th className="p-4 text-right">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {korisnici.map((user) => (
                <tr 
                  key={user.id} 
                  className={`border-b border-gray-100 transition-colors ${
                    user.otkazane_count > 5 ? "bg-red-50 hover:bg-red-100" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="p-4 font-semibold text-gray-800">
                    <div className="flex items-center gap-2">
                        {/* Ime i prezime */}
                        {user.ime} {user.prezime}

                        {/* UZVIČNIK: Prikazuje se samo ako je broj otkazanih >= 5 */}
                        {user.otkazane_count && user.otkazane_count >= 5 && (
                        <span 
                            title="Ovaj korisnik ima 5 ili više otkazanih rezervacija!" 
                            className="flex items-center justify-center w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse cursor-help"
                        >
                            !
                        </span>
                        )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{user.korisnickoIme}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      user.otkazane_count > 5 ? "bg-red-200 text-red-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {user.otkazane_count}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {user.banovan ? (
                        /* Dugme koje se vidi kada je korisnik BANOVAN */
                        <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] font-bold text-red-500 uppercase tracking-tighter">
                            Nalog je suspendovan
                        </span>
                        <button
                            onClick={() => handleUnban(user.id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all active:scale-95 shadow-sm"
                        >
                            Aktiviraj nalog
                        </button>
                        </div>
                    ) : (
                        /* Dugme koje se vidi kada je korisnik AKTIVAN */
                        <button
                        onClick={() => handleBan(user.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all active:scale-95 shadow-sm"
                        >
                        Banuj korisnika
                        </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}