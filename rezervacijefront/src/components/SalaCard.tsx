import { Sala } from "@/lib/types";
import { useState } from "react";
import Link from "next/link"

export default function SalaCard({
  sala,
  isKorisnik,
  onRezervisi,
}: {
  sala: Sala;
  isKorisnik: boolean;
  onRezervisi: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const userJson = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const currentUser = userJson ? JSON.parse(userJson) : null;
  const isAdmin = currentUser?.uloga?.toLowerCase() === "administrator";

  let naslovnaSlika = "/slike/placeholder.jpg";
  if (sala.slike) {
    // Ako ima više slika odvojenih zarezom, uzimamo prvu
    const nizSlika = sala.slike.split(","); 
    const imeSlike = nizSlika[0];
    
    naslovnaSlika = `/slike/${imeSlike}`;
  }

  return (
    <div className="card card-hover flex flex-col h-full overflow-hidden p-0 bg-white">
      {/* SLIKA SA KAPACITETOM */}
      <div className="relative h-60 w-full">
        <img
          //src={sala.slike[0] || "/slike/placeholder.jpg"}
          //src={(sala.slike && sala.slike.length > 0) ? sala.slike[0] : "/slike/placeholder.jpg"}
          src={naslovnaSlika} // Koristimo našu novu putanju
          alt={sala.naziv}
          className="w-full h-full object-cover"
        />
        {/* KAPACITET (gore desno na prozoru sale) */}
        <div className="absolute top-0 right-0 bg-[#222] text-white px-4 py-2 font-bold text-sm">
          {sala.kapacitet} <br />{" "}
          <span className="font-light text-xs uppercase">kapacitet</span>
        </div>
      </div>

      {/* DETALJI ISPOD SLIKE U PROZORU SALE*/}
      <div className="p-5 flex flex-col flex-grow text-left">
        <h3 className="text-xl font-bold text-gray-900 uppercase mb-1">
          {sala.naziv}
        </h3>
        <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
          <span className="text-orange-400">📍</span> {sala.lokacija}
        </p>
        
        <div className="flex items-center justify-between mb-auto">
        <p className="text-sm font-semibold text-pink-950 italic">
          Cena na upit
        </p>
        <Link 
            href={`/sale/${sala.id}`}
            className="text-xs font-bold uppercase text-pink-600 hover:text-pink-800 transition-colors border-b border-pink-600"
          >
            Detalji o sali
          </Link>
          </div>
        <div className="mt-auto space-y-2">
          {/* DUGME REZERVIŠI (samo za ulogovane korisnike) */}
          {isKorisnik && !isAdmin && (
            <button 
            onClick={onRezervisi} 
            className="w-full bg-pink-600 text-white py-3 font-bold uppercase hover:bg-pink-700 transition-all">
              Rezerviši salu
            </button>
          )}
         
          


          {/* DUGME POZOVITE */}
          <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full border border-gray-300 py-1 font-bold uppercase flex items-center justify-center gap-2 hover:bg-gray-50 transition-all text-gray-700"
          >
            <span>📞</span>
            {isHovered ? "+381 66 777 888" : "Pozovite"}
          </button>
        </div>
      </div>
    </div>
  );
}
