"use client";

import { useState, useEffect, use } from "react";
import { useParams, notFound } from "next/navigation";
import { api } from "@/lib/api";
import { Sala } from "@/lib/types";
import Link from "next/link";
import Header from "@/components/Header";
import RezervacijaModal from "@/components/RezervacijaModal";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default  function SalaDetalji({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [sala, setSala] = useState<Sala | null>(null);
  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [sveKarakteristike, setSveKarakteristike] = useState<any[]>([]);
  const [sviTipovi, setSviTipovi] = useState<any[]>([]);

  const [selectedKarakteristike, setSelectedKarakteristike] = useState<number[]>([]);
  const [selectedTipovi, setSelectedTipovi] = useState<number[]>([]);

  const [isRezervacijaModalOpen, setIsRezervacijaModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {

    api.getSalaById(Number(id))
      .then((data) => {
        setSala(data);
        setSelectedKarakteristike(data.karakteristike?.map((k: any) => k.id) || []);
        setSelectedTipovi(data.tipovi_dogadjaja?.map((t: any) => t.id) || []);
        setLoading(false);
        
      })
      .catch((err) => {
        console.error("Greška pri učitavanju sale:", err);
        setLoading(false);
      });
      //novo
      fetch("http://localhost:8080/api/karakteristike").then(res => res.json()).then(setSveKarakteristike).catch(err => console.error("Greška karakteristike:", err));
      fetch("http://localhost:8080/api/tipovidogadjaja").then(res => res.json()).then(setSviTipovi).catch(err => console.error("Greška tipovi:", err));
      const userJson = localStorage.getItem("user");
    if (userJson) {
  const user = JSON.parse(userJson);
  setCurrentUser(user);
  if (user.uloga && user.uloga.toLowerCase() === "administrator") {
    setIsAdmin(true);
  }
} else{
      // Ako nema korisnika u localStorage, isprazni state
      setCurrentUser(null);
      setIsAdmin(false);
    }
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-pink-600 font-bold animate-pulse">
      Učitavanje detalja...
    </div>
  );
  if (!sala) {
    notFound();
  }
const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  // Sakupljamo podatke
  const target = e.target as any;
  const formElements = e.currentTarget as HTMLFormElement;
  /*
  const updatedData = {
    naziv: target[0].value,
    kapacitet: target[1].value,
    lokacija: target[2].value,
    opis: target[3].value,
    karakteristike: selectedKarakteristike, 
    tipovi_dogadjaja: selectedTipovi,      
  };*/
  const updatedData = {
    naziv: (formElements[0] as HTMLInputElement).value,
    kapacitet: (formElements[1] as HTMLInputElement).value,
    lokacija: (formElements[2] as HTMLInputElement).value,
    opis: (formElements[3] as HTMLTextAreaElement).value,
    slike: sala?.slike, // Zadržavamo trenutne slike
    karakteristike: selectedKarakteristike, 
    tipovi_dogadjaja: selectedTipovi,      
  };

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:8080/api/sale/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`, //token za proveru admina
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      const novaSala = await response.json();
      setSala(novaSala.data || novaSala); // osvezavanje prikaz na stranici
      setIsEditModalOpen(false); 
      alert("Uspešno sačuvano!");
    } else {
      const errorData = await response.json();
      alert("Greška pri čuvanju: " + (errorData.message || "Proverite podatke."));
    }
  } catch (error) {
    console.error("Greška:", error);
    alert("Serverska greška.");
  } finally {
    setLoading(false);
  }
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
    alert("Morate biti ulogovani da biste rezervisali.");
    return;
  }

  try {
    const payload = {
      idKorisnika: currentUser.id,
      idSale: sala.id,
      idTipDogadjaja: data.idTipDogadjaja,
      pocetak: data.pocetak, // ← DIREKTNO iz modala (string)
      kraj: data.kraj,       // ← DIREKTNO iz modala (string)
      status: 'na_cekanju'
    };

    await api.createRezervacija(payload);
    
    alert("Rezervacija uspešno poslata! Status: Na čekanju.");
    setIsRezervacijaModalOpen(false);
  } catch (error: any) {
    alert(error.message || "Došlo je do greške.");
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/*HEADER */}
      <Header />
      {/* Navigacija */}
      <nav className="bg-white border-b px-8 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-pink-600 font-bold flex items-center gap-2 hover:translate-x-[-4px] transition-transform">
            ← NAZAD NA SVE SALE
          </Link>
          <span className="text-gray-400 text-sm">ID Sale: #{sala.id}</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEVA KOLONA: Slike i Opis */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-3xl overflow-hidden shadow-xl bg-gray-200 aspect-video">
              <img 
                src={
                  sala.slike && typeof sala.slike === 'string'
                    ? `/slike/${sala.slike.split(",")[0].trim()}` 
                    : "/slike/placeholder.jpg"
                } 
                alt={sala.naziv} 
                className="w-full h-full object-cover"
              />
            </div>

            <section>
              <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-4">
                {sala.naziv}
              </h1>
              <p className="text-xl text-gray-600 mb-6 italic">📍 {sala.lokacija}</p>
           
              {isAdmin && (
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
                  >
                    <span>⚙️</span> IZMENI
                  </button>
                )}
              <hr className="mb-6" />
              <p className="text-gray-700 text-lg leading-relaxed">
                {sala.opis}
              </p>
            </section>
          </div>

          {/* DESNA KOLONA: Info Box i Karakteristike */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold uppercase text-gray-400 mb-4 tracking-widest">Detalji</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Kapacitet</span>
                  <span className="font-bold text-gray-900">{sala.kapacitet} osoba</span>
                </div>
                
              </div>

              {!isAdmin ? (
              <button
               /*onClick={() => setIsRezervacijaModalOpen(true)}*/
                onClick={() => {
                  if (!currentUser) {
                    alert("Morate biti ulogovani da biste rezervisali termin!");
                    
                    return;
                  }
                  setIsRezervacijaModalOpen(true);
                }}
               className="w-full mt-8 bg-pink-600 text-white py-4 rounded-2xl font-bold hover:bg-pink-700 transition-colors shadow-lg shadow-pink-200">
                REZERVIŠI TERMIN
              </button>
              ) : (
                <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-700 text-sm font-medium text-center">
                  Prijavljeni ste kao administrator. <br/> 
                  <span className="text-xs opacity-75 italic">Rezervacije su onemogućene za ovaj nalog.</span>
                </div>
              )}
            </div>

            {/* Karakteristike */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold uppercase text-gray-400 mb-4 tracking-widest">Oprema i Karakteristike</h3>
             <div className="flex flex-wrap gap-2">
                {sala.karakteristike && sala.karakteristike.length > 0 ? (
                sala.karakteristike.map((k) => (
                <span key={k.id} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  {k.naziv}
                </span>
                    ))
                    ) : (
                  <span className="text-gray-400 text-xs italic">Nema dostupne opreme</span>
                   )}
                </div>
          </div>

            {/* Tipovi Događaja */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold uppercase text-gray-400 mb-4 tracking-widest">Pogodno za</h3>
              <div className="flex flex-wrap gap-2">
                {sala.tipovi_dogadjaja && sala.tipovi_dogadjaja.length > 0 ? (
                  sala.tipovi_dogadjaja.map((t) => (
                    <span key={t.id} className="bg-pink-50 text-pink-700 px-3 py-1.5 rounded-full text-sm font-medium">
                      {t.naziv}
                    </span>
                  ))
              ) : (
                <span className="text-gray-400 text-xs italic">Nema definisanih tipova događaja</span>
               )}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/*  MODAL KOMPONENTA */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
    <div className="bg-white rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 shadow-2xl relative">
      
      {/* Dugme za zatvaranje */}
      <button 
        onClick={() => setIsEditModalOpen(false)}
        className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
      >
        <span className="text-3xl">×</span>
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900">
          Uredi detalje sale
        </h2>
        <p className="text-gray-500 font-medium">Sve izmene će biti odmah vidljive na sajtu.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSave}>
        {/* Naziv */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">Naziv sale</label>
          <input 
            type="text" 
            defaultValue={sala.naziv} 
            className="w-full bg-gray-50 border-2 border-transparent focus:border-pink-500 focus:bg-white rounded-2xl p-4 outline-none transition-all font-semibold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kapacitet */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">Kapacitet (broj osoba)</label>
            <input 
              type="number" 
              defaultValue={sala.kapacitet} 
              className="w-full bg-gray-50 border-2 border-transparent focus:border-pink-500 focus:bg-white rounded-2xl p-4 outline-none transition-all font-semibold"
            />
          </div>
          {/* Lokacija */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">Lokacija</label>
            <input 
              type="text" 
              defaultValue={sala.lokacija} 
              className="w-full bg-gray-50 border-2 border-transparent focus:border-pink-500 focus:bg-white rounded-2xl p-4 outline-none transition-all font-semibold"
            />
          </div>
        </div>

        {/* Opis */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">Opis sale</label>
          <textarea 
            rows={5} 
            defaultValue={sala.opis} 
            className="w-full bg-gray-50 border-2 border-transparent focus:border-pink-500 focus:bg-white rounded-2xl p-4 outline-none transition-all font-semibold resize-none"
          />
        </div>
        {/* KARAKTERISTIKE */}
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1 italic">
            Oprema i karakteristike
          </label>
          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-6 rounded-[25px] border border-gray-100">
            {sveKarakteristike.map((k) => (
              <label key={k.id} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={selectedKarakteristike.includes(k.id)}
                  onChange={() => {
                    setSelectedKarakteristike(prev => 
                      prev.includes(k.id) ? prev.filter(id => id !== k.id) : [...prev, k.id]
                    );
                  }}
                  className="w-5 h-5 rounded-lg border-gray-300 text-pink-600 focus:ring-pink-500 transition-all"
                />
                <span className="text-sm font-semibold text-gray-700 group-hover:text-pink-600 transition-colors">
                  {k.naziv}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* TIPOVI DOGAĐAJA */}
        <div className="space-y-4 mt-6">
          <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1 italic">
            Pogodno za događaje
          </label>
          <div className="flex flex-wrap gap-3">
            {sviTipovi.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setSelectedTipovi(prev => 
                    prev.includes(t.id) ? prev.filter(id => id !== t.id) : [...prev, t.id]
                  );
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-2 ${
                  selectedTipovi.includes(t.id) 
                    ? "border-pink-600 bg-pink-600 text-white shadow-md shadow-pink-200" 
                    : "border-gray-100 bg-white text-gray-400 hover:border-pink-200"
                }`}
              >
                {t.naziv}
              </button>
            ))}
          </div>
        </div>

        {/* Dugmad */}
        <div className="flex gap-4 pt-4">
          <button 
            type="button"
            onClick={() => setIsEditModalOpen(false)}
            className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
          >
            OTKAŽI
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="flex-1 bg-pink-600 text-white py-4 rounded-2xl font-bold hover:bg-pink-700 transition-all shadow-lg shadow-pink-200"
           /*
            onClick={(e) => {
                e.preventDefault();
                alert("Ovde ćemo pozvati Laravel update!");
            }} */
          >
            {loading ? "ČUVANJE..." : "SAČUVAJ IZMENE"}
          </button>
        </div>
      </form>
    </div>
    
  </div>
)}
    {isRezervacijaModalOpen && sala && (
            <RezervacijaModal 
              sala={sala} 
              tipoviDogadjaja={sala.tipovi_dogadjaja} 
              onClose={() => setIsRezervacijaModalOpen(false)}
              onConfirm={handleFinalnaRezervacija}
            />
          )}
    </div>
  );
}