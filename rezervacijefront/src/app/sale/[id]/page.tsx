"use client";

import { useState, useEffect, use } from "react";
import { useParams, notFound } from "next/navigation";
import { api } from "@/lib/api";
import { Sala } from "@/lib/types";
import Link from "next/link";
import Header from "@/components/Header";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default  function SalaDetalji({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [sala, setSala] = useState<Sala | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    api.getSalaById(Number(id))
      .then((data) => {
        setSala(data);
        setLoading(false);
        
      })
      .catch((err) => {
        console.error("Greška pri učitavanju sale:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-pink-600 font-bold animate-pulse">
      Učitavanje detalja...
    </div>
  );
  if (!sala) {
    notFound();
  }

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
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="text-green-500 font-bold text-sm uppercase">Dostupno</span>
                </div>
              </div>

              <button className="w-full mt-8 bg-pink-600 text-white py-4 rounded-2xl font-bold hover:bg-pink-700 transition-colors shadow-lg shadow-pink-200">
                REZERVIŠI TERMNIN
              </button>
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
    </div>
  );
}