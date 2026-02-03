"use client";

import { useState, useEffect } from "react";
import { mock_sale } from "@/app/lib/mock/sale";
import SalaCard from "@/components/SalaCard";
import Link from "next/link";
import { Instagram, Facebook, Youtube, Phone } from "lucide-react";
import { User } from "@/app/lib/types";

const TIPOVI_DOGADJAJA = [
  { idTipDogadjaja: 1, naziv: "Poslovni sastanak" },
  { idTipDogadjaja: 2, naziv: "Konferencija" },
  { idTipDogadjaja: 3, naziv: "Radionica (Workshop)" },
  { idTipDogadjaja: 4, naziv: "Proslava rođendana" },
  { idTipDogadjaja: 5, naziv: "Venčanje" },
  { idTipDogadjaja: 6, naziv: "Seminar" },
  { idTipDogadjaja: 7, naziv: "Team building" },
  { idTipDogadjaja: 8, naziv: "Prezentacija proizvoda" },
  { idTipDogadjaja: 9, naziv: "Kulturni događaj" },
];

export default function Home() {
  const [kapacitetFilter, setKapacitetFilter] = useState("sve");
  const [tipFilter, setTipFilter] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("ulogovan_korisnik");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ulogovan_korisnik");
    setCurrentUser(null);
    setShowMenu(false);
    window.location.reload(); // Osvežava stranu da se dugmići "sakriju"
  };

  // LOGIKA FILTRIRANJA
  const filtriraneSale = mock_sale.filter((sala) => {
    let matchesKapacitet = true;
    if (kapacitetFilter === "do50") matchesKapacitet = sala.kapacitet <= 50;
    else if (kapacitetFilter === "50-100")
      matchesKapacitet = sala.kapacitet > 50 && sala.kapacitet <= 100;
    else if (kapacitetFilter === "100-200")
      matchesKapacitet = sala.kapacitet > 100 && sala.kapacitet <= 200;
    else if (kapacitetFilter === "200-300")
      matchesKapacitet = sala.kapacitet > 200 && sala.kapacitet <= 300;
    else if (kapacitetFilter === "300plus")
      matchesKapacitet = sala.kapacitet > 300;

    let matchesTip = tipFilter
      ? sala.tipoviDogadjaja?.some((t) => t.idTipDogadjaja === tipFilter)
      : true;

    return matchesKapacitet && matchesTip;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* --- HEADER SEKCIJA (Kao na slici) --- */}
      <div className="bg-white border-b py-6 px-8 flex justify-between items-center shadow-sm">
        {/* LEVO: Telefon sticker */}
        <div className="flex items-center gap-2 text-pink-800 font-semibold group cursor-pointer">
          <div className="bg-pink-100 p-2 rounded-full group-hover:bg-pink-200 transition-colors">
            <Phone size={18} className="text-pink-600" />
          </div>
          <span className="text-sm">+381 66 777 888</span>
        </div>

        {/* SREDINA: Naslov */}
        <div className="text-center">
          <h1 className="text-3xl font-serif text-pink-950 tracking-[0.2em] uppercase font-light">
            Rezervacije Sala
          </h1>
          <div className="h-1 w-20 bg-pink-200 mx-auto mt-1 rounded-full"></div>
        </div>

        {/* DESNO: Socijalne mreže i Menu */}
        <div className="flex items-center gap-6">
          <div className="flex gap-4 items-center border-r border-pink-100 pr-6">
            <a href="#" className="group">
              <Instagram
                size={20}
                className="text-pink-800/50 group-hover:text-pink-600 group-hover:scale-110 transition-all"
              />
            </a>
            <a href="#" className="group">
              <Facebook
                size={20}
                className="text-pink-800/50 group-hover:text-pink-600 group-hover:scale-110 transition-all"
              />
            </a>
            <a href="#" className="group">
              <Youtube
                size={22}
                className="text-pink-800/50 group-hover:text-pink-600 group-hover:scale-110 transition-all"
              />
            </a>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-pink-900/40 hover:text-pink-600 text-3xl font-bold px-2 transition-colors leading-none pb-2"
            >
              ⋮
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-3 w-44 bg-white shadow-2xl border border-pink-100 rounded-xl z-50 overflow-hidden">
                {currentUser ? (
                  <>
                    <div className="px-6 py-2 border-b border-pink-50 text-[10px] text-pink-400 font-bold uppercase">
                      {currentUser.ime} {currentUser.prezime}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-6 py-4 hover:bg-red-50 font-bold text-red-600 text-sm transition-colors"
                    >
                      LOGOUT
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block px-6 py-4 hover:bg-pink-50 font-bold text-pink-900 text-sm transition-colors"
                  >
                    LOGIN
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* --- FILTER SEKCIJA (Iznad sala) --- */}
        <div className="bg-white p-8 rounded-2xl shadow-sm mb-12 flex flex-wrap gap-10 items-end border border-pink-50">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-black uppercase tracking-widest text-pink-400 mb-3">
              Kapacitet sale
            </label>
            <select
              onChange={(e) => setKapacitetFilter(e.target.value)}
              className="w-full border-b-2 border-pink-100 focus:border-pink-500 outline-none py-2 bg-transparent font-semibold text-pink-900 transition-all cursor-pointer"
            >
              <option value="sve">Svi kapaciteti</option>
              <option value="do50">Do 50 osoba</option>
              <option value="50-100">50 - 100 osoba</option>
              <option value="100-200">100 - 200 osoba</option>
              <option value="200-300">200 - 300 osoba</option>
              <option value="300plus">Preko 300 osoba</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-black uppercase tracking-widest text-pink-400 mb-3">
              Tip događaja
            </label>
            <select
              onChange={(e) =>
                setTipFilter(
                  e.target.value === "sve" ? null : Number(e.target.value),
                )
              }
              className="w-full border-b-2 border-pink-100 focus:border-pink-500 outline-none py-2 bg-transparent font-semibold text-pink-900 transition-all cursor-pointer"
            >
              <option value="sve">Sve vrste proslava</option>
              {TIPOVI_DOGADJAJA.map((t) => (
                <option key={t.idTipDogadjaja} value={t.idTipDogadjaja}>
                  {t.naziv}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* --- NASLOV SEKCIJE --- */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-pink-950 uppercase tracking-[0.3em]">
            Sale <span className="font-bold">Beograd</span>
          </h2>
          <p className="text-pink-800/60 mt-2 text-sm uppercase tracking-widest">
            Prostori za sve prilike
          </p>
        </div>

        {/* --- GRID SA SALAMA --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtriraneSale.map((sala) => (
            <SalaCard
              key={sala.idSale}
              sala={sala}
              // Ovde menjamo: biće true samo ako je uloga "ulogovan"
              isKorisnik={currentUser?.uloga === "ulogovan"}
            />
          ))}
        </div>

        {filtriraneSale.length === 0 && (
          <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-pink-100">
            <p className="text-pink-900/40 text-lg italic">
              Nema sala koje odgovaraju vašim kriterijumima.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
