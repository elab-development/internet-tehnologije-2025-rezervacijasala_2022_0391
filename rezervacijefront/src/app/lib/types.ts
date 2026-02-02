// src/lib/types.ts

export type User = {
    idKorisnika: number;
    ime: string;
    prezime: string;
    korisnickoIme: string;
    password?: string; // Upitnik znači da je opciono (obično je ne šaljemo sa backenda)
    uloga: string;
    banovan: boolean;
};

export type Karakteristika = {
    idKarakteristika: number;
    naziv: string;
};

export type TipDogadjaja = {
    idTipDogadjaja: number;
    naziv: string;
};

export type Sala = {
    idSale: number;
    naziv: string;
    kapacitet: number;
    opis: string;
    lokacija: string;
    // Ako uz salu šalješ i njene karakteristike ili tipove:
    karakteristike?: Karakteristika[];
    tipoviDogadjaja?: TipDogadjaja[];
};

export type Rezervacija = {
    idRezervacije: number;
    pocetak: string; // U JS/TS datumi iz API-ja stižu kao stringovi (ISO format)
    kraj: string;
    status: string;
    idKorisnika: number;
    idSale: number;
    idTipDogadjaja: number;
    // Opciono: ako  API uz rezervaciju šalje ceo objekat Sale ili Korisnika
    sala?: Sala;
    korisnik?: User;
    tipDogadjaja?: TipDogadjaja;
};