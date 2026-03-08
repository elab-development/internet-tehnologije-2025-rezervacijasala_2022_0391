
const BASE_URL = "http://localhost:8080/api";

export const api = {
  getSale: async (page: number = 1, params: any = {}, options: any = {}) => {
    // rucno pravimo query string
    let queryString = `?page=${page}`;

    Object.keys(params).forEach((key) => {
      const value = params[key];

      if (Array.isArray(value)) {
        // za nizove (tipovi, karakteristike)
        value.forEach((v) => {
          queryString += `&${encodeURIComponent(key)}[]=${encodeURIComponent(v)}`;
        });
      } else if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== "sve"
      ) {
        // za obične vrednosti
        queryString += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }
    });

    const finalUrl = `${BASE_URL}/sale${queryString}`;
    console.log("FINALNI URL KOJI ZOVEEM:", finalUrl);

    try {
      const res = await fetch(finalUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...options.headers, // OVO JE KLJUČ: spaja tvoje default hedere sa onima koje pošalješ
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server Error ${res.status}: ${errorText}`);
      }

      return await res.json();
    } catch (err) {
      console.error("KRITIČNA GREŠKA PRI FETCH-U:", err);
      throw err;
    }
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
        Authorization: `Bearer ${token}`, // Dodajemo ga u zaglavlje
        Accept: "application/json",
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
        email: podaci.email, // Ključ koji Laravel Validator traži
        password: podaci.password, // Ključ koji Laravel Validator traži
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
        Accept: "application/json",
      },
      body: JSON.stringify(podaci),
    });

    const result = await response.json();

    if (!response.ok) {
      // Ako Laravel vrati grešku (npr. email zauzet), bacamo je da bi je catch u Reactu uhvatio
      const errorMsg = result.errors
        ? Object.values(result.errors).flat()[0]
        : result.message;
      throw new Error(errorMsg || "Greška pri registraciji");
    }
    return result;
  },

  otkaziRezervaciju: async (id: number) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:8080/api/rezervacije/${id}/otkazi`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

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
        Authorization: `Bearer ${token}`, // Neophodno za Sanctum
        Accept: "application/json",
      },
      body: JSON.stringify(podaci),
    });

    const result = await response.json();

    if (!response.ok) {
      // Ako Laravel validacija baci grešku (npr. termin zauzet), izvlačimo poruku
      const errorMsg = result.errors
        ? Object.values(result.errors).flat()[0]
        : result.message;
      throw new Error(errorMsg || "Greška pri kreiranju rezervacije");
    }

    return result;
  },

  async banujKorisnika(id: number) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/users/${id}/ban`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Greška pri banovanju");
    }

    return response.json();
  },

  async odbanujKorisnika(id: number) {
    const token = localStorage.getItem("token");
    console.log("Šaljem token:", token);
    const response = await fetch(`${BASE_URL}/users/${id}/unban`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.json();
  },

  async getUsers() {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Nije moguće učitati listu korisnika");
    }

    return response.json();
  },

  potvrdiRezervaciju: async (id: number) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/rezervacije/${id}/potvrdi`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Greška pri potvrđivanju");
    }

    return response.json();
  },

  createSala: async (data: FormData) => {
    const token = localStorage.getItem("token");

    console.log("Šaljem token:", localStorage.getItem("token"));

    const response = await fetch(`${BASE_URL}/sale`, {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      throw new Error("Nisi ulogovana ili je token istekao!");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Greška pri kreiranju sale");
    }

    return response.json();
  },

  getKarakteristike: async () => {
    const res = await fetch(`${BASE_URL}/karakteristike`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error("Greška pri učitavanju karakteristika");
    return res.json();
  },

  getTipovi: async () => {
    const res = await fetch(`${BASE_URL}/tipovidogadjaja`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error("Greška pri učitavanju tipova događaja");
    return res.json();
  },

deleteSala: async (id: any) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8080/api/sale/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      //throw new Error(errorData.message || "Greška pri brisanju sale");
      const error = new Error(errorData.message || "Greška pri brisanju sale") as any;
      error.response = { data: errorData }; 
      throw error;
    }

    return response.json();
  },

  getAllSale: async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/sale/all`, {
      headers: {
        Accept: "application/json",
      },
    });
    if (!res.ok) throw new Error("Greška pri učitavanju");
    return res.json();
  },
};
