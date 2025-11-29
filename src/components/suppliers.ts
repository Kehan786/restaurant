// src/components/suppliers.ts

export type ContactType = "whatsapp" | "email";

export interface SupplierItem {
  id: string;
  articleNumber: string;
  name: string;
  unit: string; // z.B. KG, Kiste, Sack, Karton
}

export interface Supplier {
  id: string;
  name: string;
  contactType: ContactType;
  contact: string; // Telefonnummer für WhatsApp ODER E-Mail-Adresse
  items: SupplierItem[];
}

// HIER kannst du deine echten Lieferanten + Standard-Bestellformulare eintragen.
// Die Beispiele sind nur Platzhalter.
export const suppliers: Supplier[] = [
  {
    id: "belen-gemuese",
    name: "Belen Gemüse (K-Nr.: 20225)",
    contactType: "whatsapp",
    contact: "+49 176 55950747",
    items: [
      { id: "bg1", articleNumber: "", name: "Kartoffel (25 Kg)", unit: "Sack" },
      { id: "bg2", articleNumber: "", name: "Grill Kartoffeln (25 Kg)", unit: "Sack" },
      { id: "bg3", articleNumber: "", name: "Zwiebeln rot (60/80 10 Kg)", unit: "Sack" },
      { id: "bg4", articleNumber: "", name: "Gemüsezwiebeln (25 Kg)", unit: "Sack" },
      { id: "bg5", articleNumber: "", name: "Möhren (XL) (10 Kg)", unit: "Sack" },
      { id: "bg6", articleNumber: "", name: "Paprika mix (5 Kg)", unit: "Kiste" },
      { id: "bg7", articleNumber: "", name: "Gurken", unit: "Kiste" },
      { id: "bg8", articleNumber: "", name: "Zucchini (5 Kg)", unit: "Kiste" },
      { id: "bg9", articleNumber: "", name: "Strauch-Rispentomaten (5 Kg)", unit: "Kiste" },
      { id: "bg10", articleNumber: "", name: "Champignon weiß (3 Kg)", unit: "Kiste" },
      { id: "bg11", articleNumber: "", name: "M-Eier", unit: "Karton" },
      { id: "bg12", articleNumber: "", name: "Schnittlauch", unit: "Bund" },
      { id: "bg13", articleNumber: "", name: "Eisbergsalat (10er)", unit: "Kiste" },
      { id: "bg14", articleNumber: "", name: "Salat-Mix", unit: "Kiste" },
      { id: "bg15", articleNumber: "", name: "Römersalat", unit: "Kiste" },
      { id: "bg16", articleNumber: "", name: "Radicchio", unit: "Kiste" },
      { id: "bg17", articleNumber: "", name: "Lollorosso", unit: "Kiste" },
      { id: "bg18", articleNumber: "", name: "Physalis", unit: "Schale" },
      { id: "bg19", articleNumber: "", name: "Zitronen", unit: "Kg" },
      { id: "bg20", articleNumber: "", name: "Saft-Orangen", unit: "Kg" },
      { id: "bg21", articleNumber: "", name: "Knoblauch geschälter China", unit: "Kg" },
    ],
  },
  {
    id: "stockhausen",
    name: "Stockhausen Gastro Service (K-Nr.: 32474)",
    contactType: "email",
    contact: "info@stockhausen-gastro.de",
    items: [
      { id: "st1", articleNumber: "3780", name: "American-Dressing (5kg)", unit: "Eimer" },
      { id: "st2", articleNumber: "3781", name: "French Dressing (5kg)", unit: "Eimer" },
      { id: "st3", articleNumber: "3258", name: "Italien Dressing (5kg)", unit: "Eimer" },
      { id: "st4", articleNumber: "3165", name: "Caesar’s Dressing (5kg)", unit: "Eimer" },
      { id: "st5", articleNumber: "3050", name: "Remoulade (Stockhausen) (5kg)", unit: "Eimer" },
      { id: "st6", articleNumber: "3214", name: "Knoblauch Dressing/Dip (5kg)", unit: "Eimer" },
      { id: "st7", articleNumber: "3209", name: "Knoblauchcreme (4,5kg)", unit: "Eimer" },
      { id: "st8", articleNumber: "3161", name: "Balsamico Dressing (1000ml)", unit: "Eimer" },
      { id: "st9", articleNumber: "3253", name: "Curry-Gewürzketchup (10kg)", unit: "Eimer" },
      { id: "st10", articleNumber: "3782", name: "Sour Cream (10kg)", unit: "Eimer" },
      { id: "st11", articleNumber: "3555", name: "Pommes Frites 10mm frisch", unit: "Karton" },
      { id: "st12", articleNumber: "3827", name: "Paniermehl (20kg)", unit: "Sack" },
      { id: "st13", articleNumber: "3414", name: "Vegeta (5kg)", unit: "Eimer" },
      { id: "st14", articleNumber: "3255", name: "Kräuterbutter (250g) TK", unit: "Karton" },
      { id: "st15", articleNumber: "3137", name: "Broccoli (40/60er) TK", unit: "Karton" },
      { id: "st16", articleNumber: "3428", name: "Blattspinat TK (4×2,5kg)", unit: "Karton" },
      { id: "st17", articleNumber: "2027", name: "S-Schnitzel (180g) paniert", unit: "Karton" },
      { id: "st18", articleNumber: "3376", name: "Gastrometer (ca. 375g) TK", unit: "Karton" },
      { id: "st19", articleNumber: "4219", name: "Tiramisu Con Savoiardi (1050g) TK", unit: "Karton" },
      { id: "st20", articleNumber: "3164", name: "Back-Hirtenkäse TK paniert", unit: "Karton" },
      { id: "st21", articleNumber: "3941", name: "Carpaccio Rind (800g) TK", unit: "Paket" },
      { id: "st22", articleNumber: "3350", name: "Hamburger Bun Rustikal", unit: "Karton" },
      { id: "st23", articleNumber: "3448", name: "Wildpreiselbeeren (2/1)", unit: "Eimer" },
      { id: "st24", articleNumber: "2075", name: "Hähnchen-Dino’s paniert TK", unit: "Karton" }
    ]
  },
];