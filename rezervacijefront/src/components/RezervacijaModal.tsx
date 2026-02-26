"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Sala, TipDogadjaja } from "@/lib/types";

interface Props {
  sala: Sala;
  tipoviDogadjaja: TipDogadjaja[];
  onClose: () => void;
  onConfirm: (data: any) => void;
}

export default function RezervacijaModal({
  sala,
  tipoviDogadjaja,
  onClose,
  onConfirm,
}: Props) {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(new Date().getTime() + 60 * 60 * 1000)
  );
  const [selectedTip, setSelectedTip] = useState(
    tipoviDogadjaja[0]?.id || ""
  );
  const [praznikNaziv, setPraznikNaziv] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 "VRATAR" FUNKCIJA - Proverava da li je objekat zaista validan Date
  const isValidDate = (d: any): d is Date => {
    return d instanceof Date && !isNaN(d.getTime());
  };

  // FORMAT ZA BAZU (YYYY-MM-DD HH:MM:SS)
  const formatDateTime = (date: any): string => {
    if (!isValidDate(date)) return ""; // Ako nije validan datum, ne radi ništa
    const d = date;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  };

  // FORMAT ZA API PRAZNIKA (YYYY-MM-DD)
  const formatDateForAPI = (date: any): string => {
    if (!isValidDate(date)) return ""; // Sigurnosni ventil
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const proveriPraznik = async (date: Date | null) => {
    if (!isValidDate(date)) return null;

    try {
      const formatted = formatDateForAPI(date);
      const response = await fetch(
        `http://localhost:8080/api/proveri-praznik?date=${formatted}`
      );

      if (!response.ok) return null;

      const data = await response.json();
      return Array.isArray(data) && data.length > 0
        ? data[0].name_local || data[0].name
        : null;
    } catch {
      return null;
    }
  };

  // Auto +1h kad se promeni početak
  useEffect(() => {
    if (isValidDate(startDate)) {
      const newEnd = new Date(startDate.getTime() + 60 * 60 * 1000);
      setEndDate(newEnd);
    }
  }, [startDate]);

  // Provera praznika
  useEffect(() => {
    let isActive = true;

    const check = async () => {
      if (!isValidDate(startDate)) return;
      setLoading(true);
      try {
        const p1 = await proveriPraznik(startDate);
        const p2 = !p1 && isValidDate(endDate) ? await proveriPraznik(endDate) : null;
        if (isActive) setPraznikNaziv(p1 || p2);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    check();
    return () => { isActive = false; };
  }, [startDate, endDate]);

  const handleSave = () => {
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      alert("Molimo izaberite ispravne datume.");
      return;
    }

    if (endDate <= startDate) {
      alert("Kraj mora biti posle početka.");
      return;
    }

    onConfirm({
      idSale: sala.id,
      idTipDogadjaja: selectedTip,
      pocetak: formatDateTime(startDate),
      kraj: formatDateTime(endDate),
      status: "na_cekanju",
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* NASLOV */}
        <div className={`p-6 text-white text-center shrink-0 ${praznikNaziv ? "bg-amber-500" : "bg-pink-600"}`}>
          <h2 className="text-2xl font-bold uppercase tracking-wider">
            {praznikNaziv ? "Praznik" : "Rezervacija"}
          </h2>
          <p className="opacity-90">{sala.naziv}</p>
        </div>

        {/* SADRŽAJ */}
        <div className="p-8 space-y-5 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tip Događaja</label>
            <select
              className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none"
              value={selectedTip}
              onChange={(e) => setSelectedTip(e.target.value)}
            >
              {tipoviDogadjaja.map((t) => (
                <option key={t.id} value={t.id}>{t.naziv}</option>
              ))}
            </select>
          </div>

          {/* POČETAK */}
          <div>
            <label className="block text-xs font-bold text-pink-600 uppercase mb-2">Početak</label>
            <DatePicker
              selected={startDate}
              onChange={(date:Date|null) => setStartDate(date)}
              showTimeSelect
              timeIntervals={15}
              dateFormat="dd.MM.yyyy. HH:mm"
              className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none"
            />
          </div>

          {/* KRAJ */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Kraj</label>
            <DatePicker
              selected={endDate}
              onChange={(date:Date|null) => setEndDate(date)}
              showTimeSelect
              timeIntervals={15}
              dateFormat="dd.MM.yyyy. HH:mm"
              minDate={startDate || undefined}
              className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none"
            />
          </div>

          {praznikNaziv && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm italic">
              Izabrani datum je praznik: {praznikNaziv}
            </div>
          )}
        </div>

        {/* DUGMIĆI */}
        <div className="p-6 bg-gray-50 flex gap-3 shrink-0">
          <button onClick={onClose} className="flex-1 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-500">
            ODUSTANI
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`flex-1 py-3 rounded-xl font-bold text-white ${loading ? "bg-gray-300" : "bg-pink-600 shadow-lg"}`}
          >
            {loading ? "..." : "POTVRDI"}
          </button>
        </div>
      </div>
    </div>
  );
}