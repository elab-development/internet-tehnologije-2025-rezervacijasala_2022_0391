"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Sala, TipDogadjaja } from "@/lib/types";

interface Props {
  sala: Sala;
  tipoviDogadjaja: TipDogadjaja[];
  onClose: () => void;
  onConfirm: (data: any) => void;
}

export default function RezervacijaModal({ sala, tipoviDogadjaja, onClose, onConfirm }: Props) {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date(new Date().getTime() + 60 * 60 * 1000));
  const [selectedTip, setSelectedTip] = useState(tipoviDogadjaja[0]?.id || "");

  const handleSave = () => {
    if (!startDate || !endDate) return;
    
    onConfirm({
      idSale: sala.id,
      idTipDogadjaja: selectedTip,
      pocetak: startDate,
      kraj: endDate,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header Modala */}
        <div className="bg-pink-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold uppercase tracking-wider">Rezervacija Sale</h2>
          <p className="opacity-90 font-light">{sala.naziv}</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Tip Događaja */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tip Događaja</label>
            <select 
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-pink-500 outline-none transition-all"
              value={selectedTip}
              onChange={(e) => setSelectedTip(e.target.value)}
            >
              {tipoviDogadjaja.map(t => (
                <option key={t.id} value={t.id}>{t.naziv}</option>
              ))}
            </select>
          </div>

          {/* Datum i Vreme Početka */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Početak</label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              showTimeSelect
              dateFormat="dd.MM.yyyy. HH:mm"
              timeIntervals={30}
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-pink-500 outline-none transition-all"
            />
          </div>

          {/* Datum i Vreme Kraja */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Kraj</label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              showTimeSelect
              dateFormat="dd.MM.yyyy. HH:mm"
              timeIntervals={30}
              minDate={startDate || undefined}
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-pink-500 outline-none transition-all"
            />
          </div>

          {/* Dugmići */}
          <div className="flex gap-3 pt-4">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
            >
              ODUSTANI
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 py-3 px-6 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 shadow-lg shadow-pink-200 transition-all"
            >
              POTVRDI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}