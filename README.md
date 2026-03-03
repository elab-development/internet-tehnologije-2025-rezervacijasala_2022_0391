# Aplikacija za rezervaciju sala
Ovaj projekat predstavlja aplikaciju za upravljanje i rezervaciju sala za različite vrste događaja. Projekat je rađen za potrebe predmeta Internet Tehnologije.

## Opis projekta
Ova aplikacija predstavlja platformu za upravljanje i rezervaciju višenamenskih prostora. Sistem je dizajniran da olakša proces organizacije različitih događaja — od poslovnih sastanaka i velikih konferencija, pa sve do privatnih proslava poput venčanja i tim bilding događaja.

Glavni cilj projekta je da korisnicima omogući brz i intuitivan uvid u dostupnost sala, dok administratorima pruža moćne alate za kontrolu svih aktivnosti. Ključni fokus prilikom izrade bio je na stabilnosti, modernom korisničkom iskustvu i visokom stepenu bezbednosti podataka, koristeći razdvajanje klijentskog (React) i serverskog (Laravel) dela aplikacije.

## Tehnologije koje su korišćene

**Frontend:** Next.js (React), TypeScript, Tailwind CSS

**Backend:** Laravel 11 (PHP) kao REST API

**Baza podataka:** MySQL

**Kontejnerizacija:** Docker i Docker Compose

**HTTP klijent:** Fetch API za komunikaciju između frontend-a i backend-a

**Eksterni API:** - Abstract API Holidays - korišćen za sinhronizaciju sa bazom podataka o državnim praznicima

                  - Leaflet i React-Leaflet - korišćeni za vizuelni prikaz lokacija sala

## Šta je potrebno instalirati?
Da bi aplikacija mogla da se pokrene potrebno je instalirati sledeće:
- Docker Desktop - Docker nam omogućava pokretanje baze, backend-a i frontend-a u izolovanom okruženju
- Git - koristi se za kloniranje repozitorijuma i verzionisanje koda

## Preuzimanje i pokretanje projekta
1. Kloniranje repozitorijuma

    U terminalu kucati:

```
git clone https://github.com/elab-development/internet-tehnologije-2025-rezervacijasala_2022_0391.git
```
```
cd <IME_FOLDERA>
```

2. Podešavanje Laravel aplikacije

    U folderu rezervacijeapi podesiti .env fajl (ako ne postoji, kopirati iz .env.example) i postaviti da ima sledeća podešavanja za DB_*

```
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=app_db
DB_USERNAME=app_user
DB_PASSWORD=app_pass
```

3. Pokretanje preko Docker-a

    U root folderu projekta u terminalu kucati:

```
docker-compose up -d --build
```

4. Instalacija zavisnosti

```
docker-compose exec app_laravel composer install
```

5. Osvežavanje konfiguracije

```
docker-compose exec app_laravel php artisan config:clear
```

6. Generisanje baze

```
docker exec -it app_laravel php artisan migrate:fresh --seed
```

7. Pristup aplikaciji
Nakon uspešnog pokretanja aplikaciji je moguće pristupiti preko sledećeg linka:
[text](http://localhost:3000/)
[text](http://localhost:8080/api )

## Opis funkcionalnosti projekta

Projekat implementira sledeće ključne funkcionalnosti:

### Pretraga i Filtriranje
* **Dinamička pretraga:** Pretraga sala po nazivu ili lokaciji u realnom vremenu (rezultati se ažuriraju dok korisnik kuca).
* **Napredno filtriranje:** Sužavanje izbora na osnovu kapaciteta, tipa događaja i specifičnih karakteristika sale.
* **Serverska Paginacija:** Omogućavanje brzog učitavanja podataka, slanje frontend-u samo onoliko sala koliko je potrebno za trenutni prikaz, uz informaciju o ukupnom broju stranica.
* **Sortiranje:** Organizacija prikaza po abecednom redu ili po kapacitetu.

### Sistem Rezervacija
* **Pregled dostupnosti:** Vizuelni uvid u zauzete termine, što omogućava lakši odabir slobodnog datuma.
* **Integracija sa kalendarom praznika:** Aplikacija koristi eksterni servis za preuzimanje informacija o praznicima. Ovo omogućava da sistem automatski prepozna neradne dane prilikom kreiranja rezervacija, sprečavajući zakazivanje događaja u terminima koji nisu dostupni zbog državnih praznika
* **Smart Booking:** Sistem automatski proverava dostupnost i sprečava dupliranje termina.
* **Upravljanje rezervacijama:** Korisnici prate svoje rezervacije, dok administrator ima hronološki pregled svih rezervacija u sistemu.

### Autentifikacija i Autorizacija
* **Registracija i prijava:** Siguran pristup sistemu putem email-a i lozinke.
* **Kontrola pristupa :** 
    * **Administrator:** Potpuni CRUD (Create, Read, Update, Delete) nad salama, upravljanje svim rezervacijama i mogućnost banovanja korisnika.
    * **Klijent:** Pregled, rezervisanje i otkazivanje isključivo sopstvenih termina.

### Administracija
* **Upravljanje resursima:** Izmena kartica sala, dodavanje novih prostora i brisanje zastarelih unosa.

## Bezbednost sistema
Aplikacija je razvijena uz poštovanje savremenih bezbednosnih standarda kako bi se osigurala zaštita podataka i integritet sistema:

* **IDOR zaštita:** Implementirana provera vlasništva nad resursima na nivou kontrolera. Korisnici ne mogu pristupati niti menjati tuđe rezervacije putem direktne manipulacije ID-evima u zahtevima.
* **XSS zaštita:** Sprečeno izvršavanje malicioznih skripti kroz automatski *escaping* podataka u React-u i validaciju ulaza na backend-u.
* **SQL Injection zaštita:** Kompletna komunikacija sa bazom vrši se putem *Prepared Statements* koristeći Laravel Eloquent ORM, čime je onemogućena maliciozna manipulacija upitima.
* **CORS polise:** Pristup API resursima je strogo ograničen samo na proverene domene (frontend aplikaciju) putem definisanog middleware-a.
* **Sigurna Autentifikacija:** Lozinke korisnika se čuvaju u bazi isključivo u kriptovanom obliku koristeći snažne algoritme.

## Autori
- Iva Perić 2022/0543
- Anja Perović 2022/0391
- Aleksandra Tomović 2022/0118
