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
    if (!res.ok) {
        console.error("Laravel Error Status:", res.status);
        throw new Error("Sala nije pronađena");
    }
    return res.json();
  },

  // Ovde ćemo kasnije dodati login, rezervacije itd.
  getRezervacije: async () => {
    const res = await fetch(`${BASE_URL}/rezervacije`);
    if (!res.ok) throw new Error("Greška pri učitavanju rezervacija");
    return res.json();
  },

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

  register: async (podaci: any) => {
    const response = await fetch("http://127.0.0.1:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(podaci),
    });

    const result = await response.json();

    if (!response.ok) {
      // Ako Laravel vrati grešku (npr. email zauzet), bacamo je da bi je catch u Reactu uhvatio
      // result.errors.email[0] izvlači konkretnu poruku iz Larabela
      const errorMsg = result.errors ? Object.values(result.errors).flat()[0] : result.message;
      throw new Error(errorMsg || "Greška pri registraciji");
    }

    return result;
  },
  
  otkaziRezervaciju: async (id: number) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://127.0.0.1:8000/api/rezervacije/${id}/otkazi`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Greška pri otkazivanju");
    }

    return response.json();
  },
};