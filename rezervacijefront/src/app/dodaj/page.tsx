"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import axios from "axios";

export default function DodajSalu() {
  const router = useRouter();
  const [podaci, setPodaci] = useState({ karakteristike: [], tipovi: [] });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    naziv: "",
    //kapacitet: 1,
    kapacitet:"",
    opis: "",
    lokacija: "",
    latitude: "",
    longitude: "",
    slike: null as File | null,
    izabraneKarakteristike: [] as number[],
    izabraniTipovi: [] as number[],
  });

  useEffect(() => {
    const ucitajPodatke = async () => {
      try {
        const kar = await api.getKarakteristike();
        const tip = await api.getTipovi();
        setPodaci({ karakteristike: kar, tipovi: tip });
      } catch (err) {
        console.error("Greška pri učitavanju:", err);
      }
    };
    ucitajPodatke();
  }, []);

  // pocetak dodato
  const validate = () => {
    let tempErrors: { [key: string]: string } = {};
    if (!formData.naziv) tempErrors.naziv = "Naziv je obavezan";
    if (!formData.kapacitet || Number(formData.kapacitet) < 1) tempErrors.kapacitet = "Kapacitet mora biti broj veći od 0";
    if (!formData.lokacija) tempErrors.lokacija = "Lokacija je obavezna";
    if (!formData.latitude) tempErrors.latitude = "Geografska širina je obavezna";
    if (!formData.longitude) tempErrors.longitude = "Geografska dužina je obavezna";
    if (formData.izabraniTipovi.length === 0) tempErrors.tipovi = "Morate izabrati bar jedan tip događaja";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  // kraj dodato
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return; //dodato

    const token = localStorage.getItem("token");

    // Pravimo FormData paket koji može da nosi fajlove
    const data = new FormData();
    data.append("naziv", formData.naziv);
    data.append("kapacitet", formData.kapacitet.toString());
    data.append("opis", formData.opis);
    data.append("lokacija", formData.lokacija);
    data.append("latitude", formData.latitude);
    data.append("longitude", formData.longitude);

    // KLJUČNO: ovde šaljemo fajl
    if (formData.slike) {
      data.append("slike", formData.slike); // Mora da se zove 'slike' da bi Laravel video
    }

    formData.izabraneKarakteristike.forEach((id) =>
      data.append("karakteristike[]", id.toString()),
    );
    formData.izabraniTipovi.forEach((id) =>
      data.append("tipovi_dogadjaja[]", id.toString()),
    );

   
    try {
      // 2. Dodaj 'Authorization' zaglavlje
      await axios.post("http://localhost:8080/api/sale", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, 
        },
      });
      //alert("Sala uspešno dodata!");
      router.push("/");
    } catch (err: any) {
      if (err.response && err.response.status === 422) {
        // Ako Laravel vrati greške validacije (npr. pogrešan format fajla)
        const backErrors = err.response.data;
        let mappedErrors: any = {};
        Object.keys(backErrors).forEach(key => {
            mappedErrors[key] = backErrors[key][0];
        });
        setErrors(mappedErrors);
      } else {
        console.error("Greška pri slanju:", err);
      }
    }
  };

  //dodato pocetak
  // Pomoćna komponenta za grešku
  const ErrorMsg = ({ name }: { name: string }) => 
  errors[name] ? <p className="text-red-500 text-[10px] mt-[-12px] mb-3 ml-2 font-bold uppercase">{errors[name]}</p> : null;
  //dodaro kraj

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-8 bg-[#fdf2f2] border-2 border-pink-100 rounded-2xl shadow-sm"
      >
        <h1 className="text-2xl font-black mb-6 text-pink-950 uppercase tracking-widest border-b border-pink-200 pb-4">
          Dodaj novu salu
        </h1>

        {/* NAZIV */}
        <input
          type="text"
          placeholder="Naziv sale *"
          className={`w-full p-3 border ${errors.naziv ? 'border-red-500' : 'border-pink-200'} mb-4 rounded-xl outline-none focus:border-pink-500`}
          onChange={(e) => {
            setFormData({ ...formData, naziv: e.target.value });
            if(errors.naziv) setErrors({...errors, naziv: ""});
          }}
        />
        <ErrorMsg name="naziv" />

        {/* KAPACITET */}
        <input
          type="number"
          min="1"
          placeholder="Kapacitet (broj osoba) *"
          className={`w-full p-3 border ${errors.kapacitet ? 'border-red-500' : 'border-pink-200'} mb-4 rounded-xl outline-none focus:border-pink-500`}
          onChange={(e) =>{
            setFormData({ ...formData, kapacitet: e.target.value });
            if(errors.kapacitet) setErrors({...errors, kapacitet: ""});
          }}
        />
        <ErrorMsg name="kapacitet" />

        <textarea
          placeholder="Opis sale"
          rows={4}
          className="w-full p-3 border border-pink-200 mb-4 rounded-xl outline-none focus:border-pink-500"
          onChange={(e) => setFormData({ ...formData, opis: e.target.value })}
        />

        {/* LOKACIJA */}
        <input
          type="text"
          placeholder="Lokacija *"
          className="w-full p-3 border border-pink-200 mb-4 rounded-xl outline-none focus:border-pink-500"
          onChange={(e) =>{
              setFormData({ ...formData, lokacija: e.target.value });
              if(errors.lokacija) setErrors({...errors, lokacija: ""});
          }}
        />
        <ErrorMsg name="lokacija" />

        <input
          type="number"
          step="any"
          placeholder="Geografska širina (Latitude) *"
          className={`w-full p-3 border ${errors.latitude ? 'border-red-500' : 'border-pink-200'} mb-4 rounded-xl outline-none focus:border-pink-500`}
          onChange={(e) =>{
                    setFormData({ ...formData, latitude: e.target.value });
                    if(errors.latitude) setErrors({...errors, latitude: ""});
                }}
        />
        <input
          type="number"
          step="any"
          placeholder="Geografska dužina (Longitude) *"
          className={`w-full p-3 border ${errors.longitude ? 'border-red-500' : 'border-pink-200'} mb-4 rounded-xl outline-none focus:border-pink-500`}
          onChange={(e) =>{
                    setFormData({ ...formData, longitude: e.target.value });
                    if(errors.longitude) setErrors({...errors, longitude: ""});
                }}
        />

        {/* KARAKTERISTIKE */}
        <div className="mb-6 border border-pink-100 p-4 rounded-xl bg-white/50">
          <label className="block text-[10px] font-black uppercase tracking-widest text-pink-400 mb-3">
            Karakteristike
          </label>
          {podaci.karakteristike.map((k: any) => (
            <label
              key={k.id}
              className="flex items-center gap-2 mb-1 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                className="accent-pink-600"
                onChange={(e) => {
                  const novi = e.target.checked
                    ? [...formData.izabraneKarakteristike, k.id]
                    : formData.izabraneKarakteristike.filter(
                        (id) => id !== k.id,
                      );
                  setFormData({ ...formData, izabraneKarakteristike: novi });
                }}
              />
              {k.naziv}
            </label>
          ))}
        </div>

        {/* TIPOVI DOGAĐAJA */}
        <div className={`mb-6 border ${errors.tipovi ? 'border-red-500' : 'border-pink-100'} p-4 rounded-xl bg-white/50`}>
          <label className="block text-[10px] font-black uppercase tracking-widest text-pink-400 mb-3">
            Tipovi događaja * {errors.tipovi && <span className="text-red-500 inline lowercase font-normal italic">- {errors.tipovi}</span>}
          </label>
          {podaci.tipovi.map((t: any) => (
            <label
              key={t.id}
              className="flex items-center gap-2 mb-1 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                className="accent-pink-600"
                onChange={(e) => {
                  const novi = e.target.checked
                    ? [...formData.izabraniTipovi, t.id]
                    : formData.izabraniTipovi.filter((id) => id !== t.id);
                  setFormData({ ...formData, izabraniTipovi: novi });
                  if(errors.tipovi) setErrors({...errors, tipovi: ""});
                }}
              />
              {t.naziv}
            </label>
          ))}
        </div>

        {/* FILE INPUT */}
        <input
          type="file"
          className="w-full p-3 border border-pink-200 mb-6 rounded-xl bg-white"
          onChange={(e) =>
            setFormData({ ...formData, slike: e.target.files?.[0] || null })
          }
        />

        <button
          type="submit"
          className="w-full bg-pink-950 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-pink-900 transition-all shadow-lg"
        >
          Sačuvaj salu
        </button>
      </form>
    </div>
  );
}
