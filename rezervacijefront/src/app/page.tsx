"use client";

import { useState, useEffect } from "react";
import { mock_sale } from "@/app/lib/mock/sale";
import SalaCard from "@/components/SalaCard";
import Link from "next/link";
import { Instagram, Facebook, Youtube, Phone } from "lucide-react";
import { User } from "@/app/lib/types";
import { mock_karakteristike } from "@/app/lib/mock/karakteristike";

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

export default function HomePage() {
  const [showFilters, setShowFilters] = useState(false);
  const [tempKapacitet, setTempKapacitet] = useState("sve");
  const [appliedKapacitet, setAppliedKapacitet] = useState("sve");
  const [tempTipovi, setTempTipovi] = useState<number[]>([]);
  const [appliedTipovi, setAppliedTipovi] = useState<number[]>([]);
  const [tempKarakteristike, setTempKarakteristike] = useState<number[]>([]);
  const [appliedKarakteristike, setAppliedKarakteristike] = useState<number[]>(
    [],
  );
  const [showMenu, setShowMenu] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("ulogovan_korisnik");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const resetujFiltere = () => {
    setTempKapacitet("sve");
    setTempTipovi([]);
    setTempKarakteristike([]);

    // da bi se filteri ponistili odmah na ekranu
    setAppliedKapacitet("sve");
    setAppliedTipovi([]);
    setAppliedKarakteristike([]);
  };

  const handleLogout = () => {
    localStorage.removeItem("ulogovan_korisnik");
    setCurrentUser(null);
    setShowMenu(false);
    window.location.reload(); // Osvežava stranu da se dugmići "sakriju"
  };

  // LOGIKA FILTRIRANJA
  const filtriraneSale = mock_sale.filter((sala) => {
    let matchesKapacitet = true;
    if (appliedKapacitet === "do50") matchesKapacitet = sala.kapacitet <= 50;
    else if (appliedKapacitet === "50-100")
      matchesKapacitet = sala.kapacitet > 50 && sala.kapacitet <= 100;
    else if (appliedKapacitet === "100-200")
      matchesKapacitet = sala.kapacitet > 100 && sala.kapacitet <= 200;
    else if (appliedKapacitet === "200-300")
      matchesKapacitet = sala.kapacitet > 200 && sala.kapacitet <= 300;
    else if (appliedKapacitet === "300plus")
      matchesKapacitet = sala.kapacitet > 300;

    let matchesTip =
      appliedTipovi.length > 0
        ? sala.tipoviDogadjaja?.some((t) =>
            appliedTipovi.includes(t.idTipDogadjaja),
          )
        : true;

    let matchesKarakteristike =
      appliedKarakteristike.length > 0
        ? appliedKarakteristike.every((izabraniId) =>
            sala.karakteristike?.some((k) => k.idKarakteristika === izabraniId),
          )
        : true;

    return matchesKapacitet && matchesTip && matchesKarakteristike;
  });

  const prikazaneSale = [...filtriraneSale].sort((a, b) => {
    if (sortOrder === "az") {
      return a.naziv.localeCompare(b.naziv); // a-z
    } else if (sortOrder === "za") {
      return b.naziv.localeCompare(a.naziv); // obrnuto
    }
    return 0; // podrazumevano
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* --- HEADER SEKCIJA --- */}
      <div className="bg-white border-b py-6 px-8 flex justify-between items-center shadow-sm">
        {/* Telefon*/}
        <div className="flex items-center gap-2 text-pink-800 font-semibold group cursor-pointer">
          <div className="bg-pink-100 p-2 rounded-full group-hover:bg-pink-200 transition-colors">
            <Phone size={18} className="text-pink-600" />
          </div>
          <span className="text-sm">+381 66 777 888</span>
        </div>

        {/*Naslov*/}
        <div className="text-center">
          <h1 className="text-3xl font-serif text-pink-950 tracking-[0.2em] uppercase font-light">
            Rezervacije Sala
          </h1>
          <div className="h-1 w-20 bg-pink-200 mx-auto mt-1 rounded-full"></div>
        </div>

        {/*Socijalne mreže i Menu */}
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
        {/*FILTRIRANJE*/}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-12 flex justify-between items-center border border-pink-50 relative">
          {/*DUGME ZA FILTRIRANJE*/}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-pink-950 px-6 py-3 rounded-xl font-bold transition-all border border-gray-100 uppercase text-xs tracking-widest"
            >
              Detaljna pretraga{" "}
              <span className="text-[10px]">{showFilters ? "▲" : "▼"}</span>
            </button>

            {/* PROZORČIĆ */}
            {showFilters && (
              <div className="absolute top-full left-0 mt-4 w-96 bg-white shadow-2xl rounded-3xl border border-pink-100 p-8 z-[60] animate-in fade-in zoom-in duration-200">
                {/* KAPACITET */}
                <div className="mb-6">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-pink-400 mb-2">
                    Kapacitet sale
                  </label>
                  <select
                    value={tempKapacitet}
                    onChange={(e) => setTempKapacitet(e.target.value)}
                    className="w-full border-b-2 border-pink-50 py-2 outline-none font-semibold text-pink-950 bg-transparent"
                  >
                    <option value="sve">Svi kapaciteti</option>
                    <option value="do50">Do 50 osoba</option>
                    <option value="50-100">50 - 100 osoba</option>
                    <option value="100-200">100 - 200 osoba</option>
                    <option value="200-300">200 - 300 osoba</option>
                    <option value="300plus">Preko 300 osoba</option>
                  </select>
                </div>

                {/* TIP DOGAĐAJA */}
                <div className="mb-6">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-pink-400 mb-3">
                    Tip Događaja
                  </label>
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-pink-100">
                    {TIPOVI_DOGADJAJA.map((t) => (
                      <label
                        key={t.idTipDogadjaja}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={tempTipovi.includes(t.idTipDogadjaja)}
                          onChange={() => {
                            setTempTipovi((prev) =>
                              prev.includes(t.idTipDogadjaja)
                                ? prev.filter((id) => id !== t.idTipDogadjaja)
                                : [...prev, t.idTipDogadjaja],
                            );
                          }}
                          className="w-5 h-5 accent-pink-600 rounded-md cursor-pointer"
                        />
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-pink-600 transition-colors">
                          {t.naziv}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/*KARAKTERISTIKE */}
                <div className="mb-8">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-pink-400 mb-3">
                    Karakteristike
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                    {mock_karakteristike.map((k) => (
                      <button
                        key={k.idKarakteristika}
                        type="button"
                        onClick={() => {
                          setTempKarakteristike((prev) =>
                            prev.includes(k.idKarakteristika)
                              ? prev.filter((id) => id !== k.idKarakteristika)
                              : [...prev, k.idKarakteristika],
                          );
                        }}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${
                          tempKarakteristike.includes(k.idKarakteristika)
                            ? "bg-pink-600 border-pink-600 text-white shadow-md shadow-pink-100"
                            : "bg-gray-50 border-gray-100 text-gray-400 hover:border-pink-200"
                        }`}
                      >
                        {k.naziv}
                      </button>
                    ))}
                  </div>
                </div>

                {/*PRIMENI DUGME I PONISTI DUGME*/}
                <div className="flex items-center gap-4 mt-6">
                  <button
                  onClick={resetujFiltere}
                  type="button"
                  className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black text-[10px] tracking-widest hover:bg-gray-200 transition-all uppercase"
                >
                  Poništi
                </button>

                <button
                  onClick={() => {
                    setAppliedKapacitet(tempKapacitet);
                    setAppliedTipovi(tempTipovi);
                    setAppliedKarakteristike(tempKarakteristike);
                    setShowFilters(false);
                  }}
                  className="flex-[2] bg-pink-950 text-white py-4 rounded-2xl font-black text-[10px] tracking-widest hover:bg-pink-800 transition-all shadow-xl active:scale-95 uppercase"
                >
                  Primeni filtere
                </button>
                </div>
              </div>
            )}
          </div>

          {/* SORTIRANJE */}
          <div className="flex items-center gap-4 border-l border-pink-50 pl-10">
            <label className="text-[10px] font-black uppercase tracking-widest text-pink-400">
              Sortiranje
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-transparent font-bold text-pink-950 outline-none cursor-pointer text-sm"
            >
              <option value="default">Default</option>
              <option value="az">A - Z</option>
              <option value="za">Z - A</option>
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
          {prikazaneSale.map((sala) => (
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
