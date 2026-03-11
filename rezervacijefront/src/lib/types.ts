// src/lib/types.ts

export type User = {
  id: number;
  ime: string;
  prezime: string;
  korisnickoIme: string;
  password?: string; // Upitnik znači da je opciono (obično je ne šaljemo sa backenda)
  uloga: string;
  banovan: boolean;
  otkazane_count?: number;
};

export type Karakteristika = {
  id: number;
  naziv: string;
};

export type TipDogadjaja = {
  id: number;
  naziv: string;
};

export type Sala = {
  id: number;
  naziv: string;
  slug: string;
  kapacitet: number;
  opis: string;
  lokacija: string;
  slike?: string; // ovde ce da budu putanje do slika
  // Ako uz salu šalješ i njene karakteristike ili tipove:
  karakteristike: Karakteristika[];
  tipovi_dogadjaja: TipDogadjaja[];
  latitude: number;
  longitude: number;
};

export type Rezervacija = {
  id: number;
  pocetak: string; // U JS/TS datumi iz API-ja stižu kao stringovi (ISO format)
  kraj: string;
  status: string;
  idKorisnika: number;
  idSale: number;
  idTipDogadjaja: number;
  // Opciono: ako  API uz rezervaciju šalje ceo objekat Sale ili Korisnika
  sala?: Sala;
  korisnik?: User;
  tip_dogadjaja?: TipDogadjaja;
};
