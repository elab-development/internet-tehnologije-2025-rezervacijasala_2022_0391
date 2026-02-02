"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Ovo nam treba za prebacivanje stranica

export default function LoginStranica() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Za poruku ako pogrešiš podatke
  
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Resetuj grešku na početku

    // PROVERA: Da li je korisnik administrator?
    if (email === "admin@primer.com" && password === "admin123") {
      // Ako je tačno, prebaci ga na glavnu stranicu sa rezervacijama
      router.push("/");
    } else {
      // Ako nije tačno, izbaci crvenu poruku
      setError("Pogrešan email ili lozinka. Samo administrator ima pristup.");
    }
  };

  return (
    <main className="min-h-screen bg-pink-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-10 rounded-[30px] shadow-2xl shadow-pink-200 w-full max-w-md border border-pink-100">
        <h1 className="text-4xl font-black text-pink-900 mb-2 text-center tracking-tight">Prijava</h1>
        <p className="text-pink-600 mb-8 text-center font-medium opacity-70">Admin pristup sistemu</p>
        
        {/* PORUKA O GREŠCI */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100 text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-pink-800 mb-2 ml-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-2xl border-2 border-pink-50 focus:border-pink-500 focus:outline-none transition-all outline-none text-gray-800"
              placeholder="admin@primer.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-pink-800 mb-2 ml-1">Lozinka</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-2xl border-2 border-pink-50 focus:border-pink-500 focus:outline-none transition-all outline-none text-gray-800"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="w-full bg-pink-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-pink-700 transition-all shadow-lg shadow-pink-200 active:scale-95 mt-4">
            UĐI U SISTEM
          </button>
        </form>
      </div>
    </main>
  );
}