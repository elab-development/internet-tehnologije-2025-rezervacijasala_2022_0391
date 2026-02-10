import { Rezervacija } from "@/lib/types";


const formatirajDatum = (datumString: string) => {
  if (!datumString) return "";

  try {
    // 1. Prvo zamenimo "T" razmakom, a onda isečemo sve posle sekundi
    // To pretvara "2026-02-13T14:33:20.000000Z" u "2026-02-13 14:33:20"
    const cistString = datumString.replace('T', ' ').split('.')[0];

    // 2. Sada ga delimo na datum i vreme
    const [datum, vreme] = cistString.split(' ');
    const [godina, mesec, dan] = datum.split('-');
    const [sati, minuti] = vreme.split(':');

    // 3. Vraćamo naš lep format
    return `${dan}.${mesec}.${godina}. u ${sati}:${minuti}h`;
  } catch (e) {
    return datumString; // U slučaju greške, ispiši sirov podatak
  }
};
export default function RezervacijaCard({ 
  res, 
  onOtkazi 
}: { 
  res: Rezervacija; 
  onOtkazi: (id: number) => void; 
}) {
  // Boje za bedževe (statusi)
  const statusColor = {
    potvrdjena: "bg-green-100 text-green-800",
    na_cekanju: "bg-yellow-100 text-yellow-800",
    otkazana: "bg-red-100 text-red-800",
    zavrsena: "bg-gray-100 text-gray-800",
    u_toku: "bg-pink-100 text-pink-800",
  }[res.status] || "bg-blue-100 text-blue-800";

  return (
    /* Klasa 'card' i 'card-hover' dolaze iz tvog globals.css */
    <div className="card card-hover flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-pink-900 dark:text-pink-200">
              Rezervacija #{res.id}
            </h3>
            <p className="text-sm text-pink-700 dark:text-pink-400 opacity-70">
              Sala ID: {res.idSale}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${statusColor}`}>
            {res.status.replace('_', ' ')}
          </span>
        </div>

        
        <div className="space-y-3 mb-6 text-pink-900 dark:text-pink-100">
          <p className="text-sm flex items-center gap-2">
            <span>📅</span> 
            <span><strong>Početak:</strong> {formatirajDatum(res.pocetak)}</span>
          </p>
          <p className="text-sm flex items-center gap-2">
            <span>🏁</span> 
            <span><strong>Kraj:</strong> {formatirajDatum(res.kraj)}</span>
          </p>
        </div>
      </div>

      {/* DUGMAD */}
      <div className="flex gap-2 mt-auto">
        <button className="flex-1 bg-pink-600 text-white py-2.5 rounded-xl hover:bg-pink-700 transition-colors text-sm font-semibold shadow-sm">
          Detalji
        </button>
        
        {/* Dugme OTKAŽI */}
        {(res.status === 'na_cekanju' || res.status === 'potvrdjena') && (
          <button 
          onClick={() => onOtkazi(res.id)}
          className="px-4 py-2.5 border-2 border-pink-200 text-pink-700 rounded-xl 
                             transition-all duration-300 ease-in-out
                             hover:bg-red-500 hover:border-red-500 hover:text-white 
                             text-sm font-medium">
            Otkaži
          </button>
        )}
      </div>
    </div>
  );
}