const BASE_URL = "http://127.0.0.1:8000/api";

export const api = {
  // Funkcija za dobavljanje svih sala
  getSale: async () => {
    const res = await fetch(`${BASE_URL}/sale`);
    if (!res.ok) throw new Error("Greška pri učitavanju sala");
    return res.json();
  },

  // Funkcija za jednu salu po ID-u
  getSalaById: async (id: number) => {
    const res = await fetch(`${BASE_URL}/sale/${id}`);
    if (!res.ok) throw new Error("Sala nije pronađena");
    return res.json();
  },

  // Ovde ćemo kasnije dodati login, rezervacije itd.
  async login(podaci: { email: string; password: string }) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        email: podaci.email,     // Ključ koji Laravel Validator traži
        password: podaci.password // Ključ koji Laravel Validator traži
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    // Ako Laravel baci 422 (validacija), greška je u errorData.errors
    // Ako baci 401 (pogrešni podaci), greška je u errorData.message
    throw new Error(errorData.poruka || "Pogrešni podaci");
  }

  return res.json(); // Vraća korisnika iz baze
  },
};