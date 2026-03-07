"use client";

import { useState, useEffect, useMemo } from "react";
//import { mock_sale } from "@/lib/mock/sale";
import { api } from "@/lib/api";
import SalaCard from "@/components/SalaCard";
import Link from "next/link";
import { Instagram, Facebook, Youtube, Phone, Search } from "lucide-react";
import { User, Sala, TipDogadjaja } from "@/lib/types";
import { mock_karakteristike } from "@/lib/mock/karakteristike";
import Header from "../components/Header";
import RezervacijaModal from "@/components/RezervacijaModal";
import DeleteSalaModal from "@/components/DeleteSalaModal";

export default function HomePage() {
  // STANJE ZA PODATKE IZ BAZE ANJAA
  console.log("KOMPONENTA SE POKRENULA!");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sveSale, setSveSale] = useState<Sala[]>([]);
  const [saleIzBaze, setSaleIzBaze] = useState<Sala[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

  // Koristimo useMemo da bismo bezbedno izvukli tipove samo kada sale stignu

  const tipoviIzBaze = useMemo(() => {
    // Proveravamo da li saleIzBaze uopšte postoji i da li je niz
    if (!saleIzBaze || !Array.isArray(saleIzBaze)) {
      return [];
    }

    try {
      const map = new Map();
      saleIzBaze.forEach((s) => {
        // Proveravamo da li sala ima tipove i da li su niz
        if (s && Array.isArray(s.tipovi_dogadjaja)) {
          s.tipovi_dogadjaja.forEach((t) => {
            if (t && t.id) map.set(t.id, t);
          });
        }
      });
      return Array.from(map.values()).sort((a, b) =>
        (a.naziv || "").localeCompare(b.naziv || ""),
      );
    } catch (e) {
      console.error("Greška u tipoviIzBaze:", e);
      return [];
    }
  }, [saleIzBaze]);

  const karakteristikeIzBaze = useMemo(() => {
    if (!saleIzBaze || !Array.isArray(saleIzBaze)) {
      return [];
    }

    try {
      const map = new Map();
      saleIzBaze.forEach((s) => {
        if (s && Array.isArray(s.karakteristike)) {
          s.karakteristike.forEach((k) => {
            if (k && k.id) map.set(k.id, k);
          });
        }
      });
      return Array.from(map.values()).sort((a, b) =>
        (a.naziv || "").localeCompare(b.naziv || ""),
      );
    } catch (e) {
      console.error("Greška u karakteristikeIzBaze:", e);
      return [];
    }
  }, [saleIzBaze]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    appliedKapacitet,
    appliedTipovi,
    appliedKarakteristike,
    sortOrder,
  ]);

  useEffect(() => {
    console.log(
      "%c >>> PROVERA KOMPONENTE <<< ",
      "background: #222; color: #bada55",
    );

    const storedUser = localStorage.getItem("ulogovan_korisnik");
    const token = localStorage.getItem("token");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setCurrentUser(parsed);
    }

    setLoading(true);

    const requestOptions = {
      headers: {
        Authorization: `Bearer ${token}`, // Šaljemo token
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    api
      .getSale(
        currentPage,
        {
          sort: sortOrder,
          kapacitet: appliedKapacitet,
          tipovi: appliedTipovi,
          karakteristike: appliedKarakteristike,
          search: searchQuery,
        },
        requestOptions,
      )
      .then((response: any) => {
        const res = response;
        if (res && res.data) {
          setSaleIzBaze(res.data);
          setTotalPages(res.last_page || 1);
        } else {
          setSaleIzBaze(Array.isArray(res) ? res : []);
          setTotalPages(1);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Greška pri učitavanju:", err);
        setLoading(false);
      });
  }, [
    currentPage,
    sortOrder,
    appliedKapacitet,
    appliedTipovi,
    appliedKarakteristike,
    searchQuery,
  ]);

  // Učitava sve sale samo kada se otvori modal
  useEffect(() => {
    if (showDeleteModal) {
      api
        .getAllSale() // Podrazumevam da ćeš dodati ovu metodu u api.ts
        .then((res: any) => {
          setSveSale(res);
        })
        .catch((err) => console.error("Greška pri učitavanju svih sala:", err));
    }
  }, [showDeleteModal]);

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
    const pad = (n: number) => (n < 10 ? "0" + n : n);
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      " " +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds())
    );
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
        status: "na_cekanju",
      };

      await api.createRezervacija(payload);

      alert("Rezervacija uspešno kreirana!");
      setSelectedSala(null);
    } catch (error: any) {
      alert(error.message || "Greška pri rezervaciji.");
    }
  };

  const prikazaneSale = useMemo(() => {
    return saleIzBaze;
  }, [saleIzBaze]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto p-8">
        {/*BROJ STRANICE*/}
        <div className="flex justify-start mb-4">
          <p className="text-xs text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            Stranica: {currentPage} od {totalPages}
          </p>
        </div>

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
          {/* --- POLJE ZA PRETRAGU --- */}
          <div className="relative w-64 md:w-80">
            <input
              type="text"
              placeholder="Pretraži sale ili lokacije..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-50 bg-gray-50/50 focus:bg-white focus:border-pink-200 outline-none transition-all text-sm font-medium text-pink-950"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
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
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12 relative">
          <div className="text-center">
            <h2 className="text-4xl font-light text-pink-950 uppercase tracking-[0.3em]">
              Sale <span className="font-bold">Srbija</span>
            </h2>
            <p className="text-pink-800/60 mt-2 text-sm uppercase tracking-widest">
              Prostori za sve prilike
            </p>
          </div>

          {currentUser?.uloga === "administrator" && (
            <div className="md:absolute md:right-0 flex items-center gap-3">
              {/* Dugme za brisanje */}
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-xl font-bold transition-all text-xs uppercase tracking-widest border border-red-100 active:scale-95"
              >
                Obriši
              </button>

              {/* Dugme za dodavanje */}
              <Link
                href="/dodaj"
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-pink-200 active:scale-95 text-xs uppercase tracking-widest flex items-center gap-2"
              >
                <span className="text-lg">+</span> Dodaj salu
              </Link>
            </div>
          )}
        </div>

        {/* --- GRID SA SALAMA --- */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          {loading ? (
            /* 1. LOADING */
            <div className="col-span-full text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500 mb-4"></div>
              <p className="text-pink-900/60 italic text-xl">
                Učitavanje sala...
              </p>
            </div>
          ) : (
            /* 2. Kada LOADING postane false, prikazujemo GRID */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {prikazaneSale.map((sala) => (
                <SalaCard
                  key={sala.id}
                  sala={sala}
                  isKorisnik={
                    currentUser?.uloga === "ulogovan" ||
                    currentUser?.uloga === "administrator"
                  }
                  onRezervisi={() => setSelectedSala(sala)}
                />
              ))}
            </div>
          )}
        </section>

        {/* --- NAVIGACIJA --- */}

        <div className="flex justify-center items-center gap-6 mt-16 mb-12">
          <button
            onClick={() => {
              setCurrentPage((prev) => Math.max(prev - 1, 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={currentPage === 1}
            className="p-4 rounded-2xl bg-white border border-pink-100 text-pink-600 disabled:opacity-30 hover:bg-pink-50 transition-all shadow-sm active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-400 mb-1">
              Stranica
            </span>
            <div className="bg-pink-950 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-xl border-b-4 border-pink-800">
              {currentPage} <span className="text-pink-400 mx-1">/</span>{" "}
              {totalPages}
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentPage((prev) => Math.min(prev + 1, totalPages));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-4 rounded-2xl bg-white border border-pink-100 text-pink-600 disabled:opacity-30 hover:bg-pink-50 transition-all shadow-sm active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        {prikazaneSale.length === 0 && (
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

        {showDeleteModal && (
          <DeleteSalaModal
            sale={sveSale}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={async (id: any) => {
              // <-- Ovde dodaj : any
              try {
                await api.deleteSala(id);
                alert("Sala uspešno obrisana!");
                setShowDeleteModal(false);

                setSveSale((prev) => prev.filter((s) => s.id !== id));
                setSaleIzBaze((prev) => prev.filter((s) => s.id !== id));
              } catch (e) {
                alert("Greška pri brisanju!");
              }
            }}
          />
        )}
      </div>
    </main>
  );
}
