"use client";

import { useState, useEffect } from "react";
//import { mock_sale } from "@/lib/mock/sale";
import { api } from "@/lib/api";
import SalaCard from "@/components/SalaCard";
import Link from "next/link";
import { Instagram, Facebook, Youtube, Phone, Search } from "lucide-react";
import { User, Sala, TipDogadjaja } from "@/lib/types";
import { mock_karakteristike } from "@/lib/mock/karakteristike";
import Header from "../components/Header";
import RezervacijaModal from "@/components/RezervacijaModal";

/*
const TIPOVI_DOGADJAJA = [
  { id: 1, naziv: "Konferencija" },
  { id: 2, naziv: "Seminar" },
  { id: 3, naziv: "Venčanje" },
  { id: 4, naziv: "Proslava rođendana" },
  { id: 5, naziv: "Poslovni sastanak" },
  { id: 6, naziv: "Radionica (Wokrshop))" },
  { id: 7, naziv: "Team building" },
  { id: 8, naziv: "Kulturni dogadjaj" },
  
];
*/
export default function HomePage() {
  // STANJE ZA PODATKE IZ BAZE ANJAA
  const [saleIzBaze, setSaleIzBaze] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  //
  const [showFilters, setShowFilters] = useState(false);
  const [tempKapacitet, setTempKapacitet] = useState("sve");
  const [appliedKapacitet, setAppliedKapacitet] = useState("sve");
  const [tempTipovi, setTempTipovi] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [appliedTipovi, setAppliedTipovi] = useState<number[]>([]);
  const [tempKarakteristike, setTempKarakteristike] = useState<number[]>([]);
  const [appliedKarakteristike, setAppliedKarakteristike] = useState<number[]>(
    [],
  );
  const [showMenu, setShowMenu] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedSala, setSelectedSala] = useState<Sala | null>(null);

 
  // Koristimo Map da bismo dobili samo jedinstvene objekte (da se ne ponavljaju)
  const tipoviIzBaze = Array.from(
    new Map(
      saleIzBaze
        .flatMap((s) => s.tipovi_dogadjaja || [])
        .map((t) => [t.id, t])
    ).values()
  ).sort((a, b) => a.naziv.localeCompare(b.naziv));

  // DINAMIČKO IZVLAČENJE KARAKTERISTIKA
  const karakteristikeIzBaze = Array.from(
    new Map(
      saleIzBaze
        .flatMap((s) => s.karakteristike || [])
        .map((k) => [k.id, k])
    ).values()
  ).sort((a, b) => a.naziv.localeCompare(b.naziv));
  //novo
  useEffect(() => {
    const storedUser = localStorage.getItem("ulogovan_korisnik");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      console.log("Korisnik iz baze:", parsed); 
      setCurrentUser(parsed);
      // setCurrentUser(JSON.parse(storedUser)); ove tri linije iznad nove
    }
    //ANJA poziv laravel apija
    api.getSale()
      .then((data) => {
        console.log("Sale iz baze sa vezama:", data); // Pogledaj sve salu u konzoli
        setSaleIzBaze(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Greška pri učitavanju:", err);
        setLoading(false);
      });
    //
  }, []);

  const resetujFiltere = () => {
    setTempKapacitet("sve");
    setTempTipovi([]);
    setTempKarakteristike([]);
    setSearchQuery("");

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
  const formatirajDatumZaLaravel = (date: Date) => {
  const pad = (n: number) => n < 10 ? '0' + n : n;
  return date.getFullYear() + '-' +
    pad(date.getMonth() + 1) + '-' +
    pad(date.getDate()) + ' ' +
    pad(date.getHours()) + ':' +
    pad(date.getMinutes()) + ':' +
    pad(date.getSeconds());
};
 const handleFinalnaRezervacija = async (data: any) => {
  if (!currentUser) {
    alert("Morate biti ulogovani.");
    return;
  }

  try {
    const payload = {
      idKorisnika: Number(currentUser.id),
      idSale: Number(data.idSale),
      idTipDogadjaja: Number(data.idTipDogadjaja),
      pocetak: data.pocetak,
      kraj: data.kraj,
      status: 'na_cekanju'
    };

    await api.createRezervacija(payload);

    alert("Rezervacija uspešno kreirana!");
    setSelectedSala(null);
  } catch (error: any) {
    alert(error.message || "Greška pri rezervaciji.");
  }
};
  // LOGIKA FILTRIRANJA
  // pre iz mocka
  //const filtriraneSale = mock_sale.filter((sala) => {
  // poslee, iz baze
  const filtriraneSale = saleIzBaze.filter((sala) => {
    // PRETRAGA (Proverava naziv i lokaciju)
    const matchesSearch = 
      sala.naziv.toLowerCase().includes(searchQuery.toLowerCase()) || 
      sala.lokacija.toLowerCase().includes(searchQuery.toLowerCase());
    //KAPACITET
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
        ? sala.tipovi_dogadjaja?.some((t) =>
            appliedTipovi.includes(t.id),
          )
        : true;

        
    let matchesKarakteristike =
      appliedKarakteristike.length > 0
        ? appliedKarakteristike.every((izabraniId) =>
            sala.karakteristike?.some((k) => k.id === izabraniId), //zarez?
          )
        : true;

        return matchesSearch && matchesKapacitet && matchesTip && matchesKarakteristike; 
  });

  const prikazaneSale = [...filtriraneSale].sort((a, b) => {
    if (sortOrder === "az") {
      return a.naziv.localeCompare(b.naziv); // a-z
    } else if (sortOrder === "za") {
      return b.naziv.localeCompare(a.naziv); // obrnuto
    }else if (sortOrder === "kapacitet_asc") {
      return a.kapacitet - b.kapacitet; // Od najmanje ka najvećoj
    } else if (sortOrder === "kapacitet_desc") {
      return b.kapacitet - a.kapacitet; // Od najveće ka najmanjoj
    }
    return 0; // podrazumevano
  });

//  PRIKAZ LOADING STANJA
  if (loading) return <div className="min-h-screen flex items-center justify-center text-pink-600 font-bold uppercase tracking-widest animate-pulse">Učitavanje prostora...</div>;
//
  return (
    <main className="min-h-screen bg-gray-50">
      
    <Header />
   
      <div className="max-w-7xl mx-auto p-8">
        {/*FILTRIRANJE*/}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-12 flex justify-between items-center border border-pink-50 relative">
          {/*DUGME ZA FILTRIRANJE*/}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-pink-950 px-6 py-3 rounded-xl font-bold transition-all border border-gray-100 uppercase text-xs tracking-widest"
            >
              Filtriraj{" "}
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
                    {tipoviIzBaze.map((t) => (
                      <label
                        key={t.id}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={tempTipovi.includes(t.id)}
                          onChange={() => {
                            setTempTipovi((prev) =>
                              prev.includes(t.id)
                                ? prev.filter((id) => id !== t.id)
                                : [...prev, t.id],
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
                    {karakteristikeIzBaze.map((k) => (
                      <button
                        key={k.id}
                        type="button"
                        onClick={() => {
                          setTempKarakteristike((prev) =>
                            prev.includes(k.id)
                              ? prev.filter((id) => id !== k.id)
                              : [...prev, k.id],
                          );
                        }}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${
                          tempKarakteristike.includes(k.id)
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
              {/* --- DODATO: POLJE ZA PRETRAGU --- */}
    <div className="relative w-64 md:w-80">
      <input
        type="text"
        placeholder="Pretraži sale ili lokacije..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-50 bg-gray-50/50 focus:bg-white focus:border-pink-200 outline-none transition-all text-sm font-medium text-pink-950"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </div>
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
              <option value="podrazumevano">Podrazumevano</option>
              <option value="az">A - Z</option>
              <option value="za">Z - A</option>
              <option value="kapacitet_asc">Kapacitet: Manje ka većim</option>
              <option value="kapacitet_desc">Kapacitet: Veće ka manjim</option>
            </select>
          </div>
        </div>

        {/* --- NASLOV SEKCIJE --- */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-pink-950 uppercase tracking-[0.3em]">
            Sale <span className="font-bold">Srbija</span>
          </h2>
          <p className="text-pink-800/60 mt-2 text-sm uppercase tracking-widest">
            Prostori za sve prilike
          </p>
        </div>

        {/* --- GRID SA SALAMA --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {prikazaneSale.map((sala) => (
            <SalaCard
              key={sala.id}
              sala={sala}
              // Ovde menjamo: biće true samo ako je uloga "ulogovan"
              // i admin moze da vidi sale pa dodajemo i za njega dozvolu || currentUser?.uloga === "administrator"
              isKorisnik={currentUser?.uloga === "ulogovan" || currentUser?.uloga === "administrator"}
              onRezervisi={() => setSelectedSala(sala)}
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
        {selectedSala && (
          <RezervacijaModal 
            sala={selectedSala} 
            tipoviDogadjaja={selectedSala.tipovi_dogadjaja} 
            onClose={() => setSelectedSala(null)}
            onConfirm={handleFinalnaRezervacija}
          />
        )}
      </div>
    </main>
  );
}
