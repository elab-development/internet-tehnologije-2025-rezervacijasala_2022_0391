import { Sala } from "../types";

export const mock_sale: Sala[] = [
    {
        idSale: 1,
        naziv: "Velika Konferencijska Sala",
        slug: "velika-konferencijska-sala",
        kapacitet: 150,
        lokacija: "Beograd, Vračar",
        slike:[
            "/slike/konfverencijskaSala.jpg"
        ],
        opis: "Moderna sala opremljena najnovijom audio-vizuelnom tehnikom, idealna za velike seminare.",
        karakteristike: [
            { idKarakteristika: 2, naziv: "Projektor" },
            { idKarakteristika: 1, naziv: "Klima uređaj" },
            { idKarakteristika: 5, naziv: "Brzi internet (Wi-Fi)" }
        ],
        tipoviDogadjaja: [
            { idTipDogadjaja: 2, naziv: "Konferencija" },
            { idTipDogadjaja: 6, naziv: "Seminar" }
        ]
    },
    {
        idSale: 2,
        naziv: "Plavi Salon",
        slug: "plavi-salon",
        kapacitet: 30,
        lokacija: "Novi Sad, Centar",
        slike:[
            "/slike/plaviSalon.jpg"
        ],
        opis: "Intiman prostor pogodan za poslovne sastanke i manje radionice.",
        karakteristike: [
            { idKarakteristika: 1, naziv: "Klima uređaj" },
            { idKarakteristika: 5, naziv: "Brzi internet (Wi-Fi)" },
            { idKarakteristika: 3, naziv: "Bela tabla" }
        ],
        tipoviDogadjaja: [
            { idTipDogadjaja: 1, naziv: "Poslovni sastanak" },
            { idTipDogadjaja: 3, naziv: "Radionica (Workshop)" }
        ]
    },
    {
        idSale: 3,
        naziv: "IT Lab 404",
        slug: "it-lab-404",
        kapacitet: 30,
        lokacija: "Niš, Medijana",
        slike:[
            "/slike/ITLab.jpg"
        ],
        opis: "Sala sa računarskom opremom za tehničke obuke.",
        karakteristike: [
            { idKarakteristika: 11, naziv: "Računari" },
            { idKarakteristika: 2, naziv: "Projektor" }
        ],
        tipoviDogadjaja: [
            { idTipDogadjaja: 3, naziv: "Radionica (Workshop)" }
        ]
    },
    {
        idSale: 4,
        naziv: "Amfiteatar",
        slug: "amfiteatar",
        kapacitet: 300,
        lokacija: "Beograd, Novi Beograd",
        slike:[
            "/slike/amfiteatar.jpg"
        ],
        opis: "Idealan za masovna predavanja, seminare i svečane akademije.",
        karakteristike: [
            { idKarakteristika: 2, naziv: "Projektor" },
            { idKarakteristika: 1, naziv: "Klima uređaj" },
            { idKarakteristika: 4, naziv: "Ozvučenje" }
        ],
        tipoviDogadjaja: [
            { idTipDogadjaja: 6, naziv: "Seminar" },
            { idTipDogadjaja: 9, naziv: "Kulturni događaj" }
        ]
    },
    {
        idSale: 5,
        naziv: "Mala sala za sastanke",
        slug: "mala-sala-za-sastanke",
        kapacitet: 10,
        lokacija: "Beograd, Voždovac",
        slike:[
            "/slike/malaSala.jpg"
        ],
        opis: "Tiha sala za brze konsultacije i timske sastanke.",
        karakteristike: [
            { idKarakteristika: 5, naziv: "Brzi internet (Wi-Fi)" },
            { idKarakteristika: 3, naziv: "Bela tabla" }
        ],
        tipoviDogadjaja: [
            { idTipDogadjaja: 1, naziv: "Poslovni sastanak" }
        ]
    },
    {
        idSale: 6,
        naziv: "Laboratorija za fiziku",
        slug: "laboratorija-za-fiziku",
        kapacitet: 25,
        lokacija: "Novi Sad, Liman",
        slike:[
            "/slike/fizika.jpg"
        ],
        opis: "Specijalizovana sala sa laboratorijskim stolovima i opremom za eksperimente.",
        karakteristike: [
            { idKarakteristika: 11, naziv: "Računari" },
            { idKarakteristika: 5, naziv: "Brzi internet (Wi-Fi)" }
        ],
        tipoviDogadjaja: [
            { idTipDogadjaja: 3, naziv: "Radionica (Workshop)" }
        ]
    },
    {
        idSale: 7,
        naziv: "Sala Mali Princ",
        slug: "sala-mali-princ",
        kapacitet: 80,
        lokacija: "Beograd, Dorćol",
        slike:[
            "/slike/salamaliprinc.jpg"
        ],
        opis: "Uživajte u prigušenim svetlima i toploj atmosferi našeg prostora, stvorenog za proslave koje se pamte po bliskosti, a ne po gužvi.",
        karakteristike: [
            { idKarakteristika: 1, naziv: "Klima uređaj" },
            { idKarakteristika: 4, naziv: "Ozvučenje" },
            { idKarakteristika: 10, naziv: "Ergonomske stolice" }
        ],
        tipoviDogadjaja: [
            { idTipDogadjaja: 5, naziv: "Venčanje" },
            { idTipDogadjaja: 9, naziv: "Kulturni događaj" }
        ]
    },
    {
        idSale: 8,
        naziv: "Coworking zona",
        slug: "coworking-zona",
        kapacitet: 50,
        lokacija: "Beograd, Zemun",
        slike:[
            "/slike/coworking.jpg"
        ],
        opis: "Otvoren prostor za zajednički rad studenata u opuštenoj atmosferi.",
        karakteristike: [
            { idKarakteristika: 5, naziv: "Brzi internet (Wi-Fi)" },
            { idKarakteristika: 9, naziv: "Aparat za kafu" },
            { idKarakteristika: 10, naziv: "Ergonomske stolice" }
        ],
        tipoviDogadjaja: [
            { idTipDogadjaja: 3, naziv: "Radionica (Workshop)" },
            { idTipDogadjaja: 7, naziv: "Team building" }
        ]
    },
    {
        idSale: 9,
        naziv: "Sala za video konferencije",
        slug: "sala-za-video-konferencije",
        kapacitet: 15,
        lokacija: "Kragujevac, Bresnica",
        slike:[
            "/slike/videoKonferencija.jpg"
        ],
        opis: "Specijalizovana sala sa kamerama visoke rezolucije za online sastanke.",
        karakteristike: [
            { idKarakteristika: 8, naziv: "Televizor 4K" },
            { idKarakteristika: 2, naziv: "Projektor" },
            { idKarakteristika: 5, naziv: "Brzi internet (Wi-Fi)" }
        ],
        tipoviDogadjaja: [
            { idTipDogadjaja: 1, naziv: "Poslovni sastanak" },
            { idTipDogadjaja: 8, naziv: "Prezentacija proizvoda" }
        ]
    },
    {
        idSale: 10,
        naziv: "Svečana dvorana",
        slug: "svecana-dvorana",
        kapacitet: 200,
        lokacija: "Beograd, Stari grad",
        slike:[
            "/slike/svecanaDvorana.jpg"
        ],
        opis: "Prostrana dvorana pogodna za proslave i velike prezentacije.",
        karakteristike: [
            { idKarakteristika: 4, naziv: "Ozvučenje" },
            { idKarakteristika: 1, naziv: "Klima uređaj" },
            { idKarakteristika: 6, naziv: "Video nadzor" }
        ],
        tipoviDogadjaja: [
            { idTipDogadjaja: 4, naziv: "Proslava rođendana" },
            { idTipDogadjaja: 5, naziv: "Venčanje" }
        ]
    }
];