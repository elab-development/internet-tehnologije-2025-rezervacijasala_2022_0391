"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Facebook, Youtube, Phone } from "lucide-react";
import { User } from "@/lib/types";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const pathname = usePathname();

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
    // Ako smo na stranici za rezervacije, moramo se vratiti na home jer nismo više ulogovani
    if (window.location.pathname === "/rezervacije") {
      window.location.href = "/";
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="bg-white border-b py-6 px-8 flex justify-between items-center shadow-sm">
      {/* Telefon - LEVA KOLONA */}
      <div className="flex items-center gap-2 text-pink-800 font-semibold group cursor-pointer">
        <div className="bg-pink-100 p-2 rounded-full group-hover:bg-pink-200 transition-colors">
          <Phone size={18} className="text-pink-600" />
        </div>
        <span className="text-sm">+381 66 777 888</span>
      </div>

      {/* Naslov - SREDNJA KOLONA */}
      <div className="text-center">
        <h1 className="text-3xl font-serif text-pink-950 tracking-[0.2em] uppercase font-light">
          Rezervacije Sala
        </h1>
        <div className="h-1 w-20 bg-pink-200 mx-auto mt-1 rounded-full"></div>
        
        {/* DODATO: Navigacija ispod naslova */}
        <div className="flex justify-center gap-6 mt-4">
          <Link 
            href="/" 
            className={`text-[10px] uppercase tracking-[0.2em] font-black transition-all ${
              pathname === "/" ? "text-pink-600 border-b border-pink-600" : "text-gray-400 hover:text-pink-600"
            }`}
          >
            Pregled sala
          </Link>
          {currentUser && (
            <Link 
              href="/rezervacije" 
              className={`text-[10px] uppercase tracking-[0.2em] font-black transition-all ${
                pathname === "/rezervacije" ? "text-pink-600 border-b border-pink-600" : "text-gray-400 hover:text-pink-600"
              }`}
            >
             {currentUser?.uloga === "administrator" ? "Sve Rezervacije" : "Moje Rezervacije"}
            </Link>
          )}
        </div>
      </div>

      {/* Socijalne mreže i Menu - DESNA KOLONA */}
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
                  <div className="px-6 py-4 border-b border-pink-50 bg-pink-50/30 text-xs text-pink-900 font-bold uppercase tracking-wider">
                    {currentUser.ime} {currentUser.prezime}
                    <div className="text-[9px] text-pink-400 font-medium lowercase italic mt-1">
                      role: {currentUser.uloga}
                    </div>
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
  );
}