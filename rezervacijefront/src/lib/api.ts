const BASE_URL = "http://localhost:8080/api";

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
  const token = localStorage.getItem("token"); // Uzimamo token
  const res = await fetch(`${BASE_URL}/rezervacije`, {
    headers: {
      "Authorization": `Bearer ${token}`, // Dodajemo ga u zaglavlje
      "Accept": "application/json",
    },
  });
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
    const response = await fetch("http://localhost:8080/api/register", {
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
      const errorMsg = result.errors ? Object.values(result.errors).flat()[0] : result.message;
      throw new Error(errorMsg || "Greška pri registraciji");
    }
    return result;
  },

  otkaziRezervaciju: async (id: number) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8080/api/rezervacije/${id}/otkazi`, {
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

  createRezervacija: async (podaci: any) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/rezervacije`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Neophodno za Sanctum
        "Accept": "application/json",
      },
      body: JSON.stringify(podaci),
    });

    const result = await response.json();

    if (!response.ok) {
      // Ako Laravel validacija baci grešku (npr. termin zauzet), izvlačimo poruku
      const errorMsg = result.errors ? Object.values(result.errors).flat()[0] : result.message;
      throw new Error(errorMsg || "Greška pri kreiranju rezervacije");
    }

    return result;
  },

  async banujKorisnika(id: number) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/users/${id}/ban`, {
      method: 'PUT', 
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Greška pri banovanju');
    }

    return response.json();
  },

  async odbanujKorisnika(id: number) {
  const token = localStorage.getItem("token");
  console.log("Šaljem token:", token);
  const response = await fetch(`${BASE_URL}/users/${id}/unban`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  return response.json();
},

  async getUsers() {
 
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/users`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Nije moguće učitati listu korisnika');
  }

  return response.json();
},
};