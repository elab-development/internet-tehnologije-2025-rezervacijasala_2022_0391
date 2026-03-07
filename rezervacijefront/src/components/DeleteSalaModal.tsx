import { useState } from "react"; 

export default function DeleteSalaModal({ sale, onClose, onConfirm }: any) {
  const [selectedId, setSelectedId] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
        <h3 className="text-xl font-bold text-pink-950 mb-6 uppercase tracking-widest">Obriši salu</h3>
        
        <select 
          className="w-full p-4 border border-gray-200 rounded-xl mb-6"
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">Izaberi salu...</option>
          {sale.map((s: any) => (
            <option key={s.id} value={s.id}>{s.naziv}</option>
          ))}
        </select>

        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 text-gray-500 font-bold">Otkaži</button>
          <button 
            onClick={() => onConfirm(selectedId)}
            disabled={!selectedId}
            className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold disabled:opacity-50"
          >
            Obriši
          </button>
        </div>
      </div>
    </div>
  );
}