"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import "./RestaurantApp.css"; // Pfad zur CSS-Datei

// Typen für Menüstruktur
type MenuItem = {
  id: number;
  name: string;
  price: number;
};

type MenuCategory = {
  name: string;
  items: MenuItem[];
};

type MenuType = "speisen" | "getraenke";

type MenuData = {
  speisen: MenuCategory[];
  getraenke: MenuCategory[];
};

type OrderItem = {
  item: MenuItem;
  quantity: number;
};

type TableData = {
  id: number;
  name: string;
  orders: OrderItem[];
  total: number;
};

// Funktion zum Speichern der Tische im Local Storage
const saveTablesToLocalStorage = (tables: TableData[]) => {
  localStorage.setItem("tables", JSON.stringify(tables));
};

export default function RestaurantApp() {
  const [tables, setTables] = useState<TableData[]>([]);
  
    useEffect(() => {
      // Beim Initialisieren der App: Tische aus dem Local Storage laden
      const tablesJSON = localStorage.getItem("tables");
      if (tablesJSON) {
        setTables(JSON.parse(tablesJSON));
      }
    }, []); // Leeres Array bedeutet: Nur einmal beim Mounten ausführen
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [menuType, setMenuType] = useState<MenuType>("speisen");
  const [newTableNumber, setNewTableNumber] = useState<string>("");
  const [diversAmount, setDiversAmount] = useState<string>("");


  // Funktion zur automatischen Generierung von IDs
  const generateMenuWithIds = (menuData: MenuData): MenuData => {
    let currentId = 1;

    const generateIdsForCategory = (category: MenuCategory): MenuCategory => {
      return {
        ...category,
        items: category.items.map((item) => ({
          ...item,
          id: currentId++,
        })),
      };
    };

    return {
      speisen: menuData.speisen.map(generateIdsForCategory),
      getraenke: menuData.getraenke.map(generateIdsForCategory),
    };
  }

  const initialMenu: MenuData = {
    speisen: [
      {
        name: "Vorpseise/Suppen",
        items: [
          { id: 1, name: "Tomatensuppe", price: 6.90 },
          { id: 2, name: "Gulaschsuppe", price: 8.50 },
          { id: 3, name: "Bruschetta", price: 7.90 },
          { id: 4, name: "Zwiebelringe", price: 7.90 },
        ],
      },
      {
        name: "Salate",
        items: [
          { id: 5, name: "Mixed Salat", price: 6 },
          { id: 6, name: "Tomatensalat", price: 6 },
          { id: 7, name: "American Salat", price: 15.90 },
          { id: 8, name: "Caesar Salat", price: 16.90 },
          { id: 9, name: "Mendoza Club Salat", price: 17.90 },
          { id: 10, name: "Scampi Salat", price: 19.90 },
        ],
      },
      {
        name: "Steaks",
        items: [
          { id: 11, name: "Hüftsteak 200gr", price: 18.90 },
          { id: 12, name: "Hüftsteak 260gr", price: 22.90 },
          { id: 13, name: "Hüftsteak 500gr", price: 37.90 },
          { id: 14, name: "Rumpsteak 200gr", price: 23.90 },
          { id: 15, name: "Rumpsteak 260gr", price: 27.90 },
          { id: 16, name: "Rumpsteak 500gr", price: 44.90 },
          { id: 17, name: "Ribeye Steak 250gr", price: 24.90 },
          { id: 18, name: "Ribeye Steak 350gr", price: 31.90 },
          { id: 19, name: "Ribeye Steak 500gr", price: 42.90 },
          { id: 20, name: "Super Cut 230gr", price: 27.90 },
          { id: 21, name: "Super Cut 450gr", price: 45.50 },
          { id: 22, name: "Filet Steak 200gr", price: 28.90 },
          { id: 23, name: "Filet Steak 400gr", price: 49.50 },
          { id: 24, name: "Sirloin Filet 200gr", price: 22.90 },
          { id: 25, name: "Sirloin Filet 400gr", price: 39.90 },
          { id: 26, name: "Dry Aged Rumpsteak", price: 37.90 },
          { id: 27, name: "Dry Aged Entrecôte", price: 39.90 },
          { id: 28, name: "Dry Aged Filet", price: 45.90 },
        ],
      },
      {
        name: "Bistro",
        items: [
          { id: 17, name: "Gambas Al Aioli", price: 15.90 },
          { id: 18, name: "Roastbeef", price: 18.90 },
          { id: 19, name: "Rinderhacksteak", price: 12.90 },
          { id: 20, name: "Steakstreifen", price: 15.90 },
          { id: 21, name: "Carpaccio", price: 13.50 },
          { id: 22, name: "Country Potato", price: 14.90 },
          { id: 23, name: "Beef Potato", price: 15.90 },
          { id: 24, name: "Black Tiger Potato", price: 20.90 },
        ],
      },
      {
        name: "Specials",
        items: [
          { id: 25, name: "Rinderpfanne", price: 23.90 },
          { id: 26, name: "Putensteak", price: 16.90 },
          { id: 27, name: "Hauspfanne", price: 22.90 },
          { id: 28, name: "Schweinemedaillons", price: 18.90 },
          { id: 25, name: "Schweinefiletpfanne", price: 23.90 },
          { id: 26, name: "Champignon Steak", price: 21.90 },
          { id: 27, name: "Holzfällersteak", price: 17.90 },
          { id: 28, name: "Spare Ribs", price: 20.90 },
          { id: 25, name: "Pfeffersteak", price: 23.90 },
          { id: 26, name: "Mendoza Grillteller", price: 20.90 },
          { id: 27, name: "Filet Tournedos", price: 30.90 },
          { id: 28, name: "Wiener Schnitzel", price: 24.90 },
          { id: 25, name: "Mendoza Schnitzel", price: 24.50 },
          { id: 26, name: "Lammfilet", price: 28.90 },
        ],
      },
      {
        name: "Fisch",
        items: [
          { id: 27, name: "Lachsfilet", price: 22.90 },
          { id: 28, name: "Zanderfilet", price: 23.90 },
          { id: 27, name: "Mendoza Fischplatte", price: 25.90 },
        ],
      },
      {
        name: "Burger Mania",
        items: [
          { id: 27, name: "Royal Burger 160gr", price: 11.90 },
          { id: 28, name: "Royal Burger 320gr", price: 17.90 },
          { id: 27, name: "Champi Burger 160gr", price: 14.90 },
          { id: 28, name: "Champi Burger 320gr", price: 19.90 },
          { id: 27, name: "Hawaii Burger 160gr", price: 13.90 },
          { id: 28, name: "Hawaii Burger 320gr", price: 17.50 },
          { id: 27, name: "Chili-Cheese 160gr", price: 14.90 },
          { id: 28, name: "Chili-Cheese 320gr", price: 18.90 },
          { id: 27, name: "Bacon Burger 160gr", price: 14.90 },
          { id: 28, name: "Bacon Burger 320gr", price: 19.90 },
          { id: 27, name: "Giant Burger 160gr", price: 13.90 },
          { id: 28, name: "Giant Burger 320gr", price: 17.90 },
          { id: 27, name: "Big Danmark 160gr", price: 14.90 },
          { id: 28, name: "Big Danmark 320gr", price: 17.90 },
          { id: 27, name: "Onion Crisp 160gr", price: 15.90 },
          { id: 28, name: "Onion Crisp 320gr", price: 18.90 },
          { id: 27, name: "Dry Aged 160gr", price: 16.90 },
          { id: 28, name: "Dry Aged 320gr", price: 20.90 },
          { id: 27, name: "Wagyu Burger 200gr", price: 22.90 },
        ],
      },
      {
        name: "Vegetarisch",
        items: [
          { id: 27, name: "Feta Paniert", price: 9.90 },
          { id: 28, name: "Broccolir. m. Kartoffelr.", price: 13.90 },
          { id: 27, name: "Green Potato", price: 12.90 },
          { id: 28, name: "Gemüse Burger", price: 13.90 },
          { id: 27, name: "Veg. Schnitzel", price: 15.90 },
        ],
      },
      {
        name: "Dessert",
        items: [
          { id: 27, name: "Crème Brûlée", price: 7.90 },
          { id: 28, name: "Tiramisu", price: 7.50 },
          { id: 27, name: "Schokoladensoufflé", price: 7.90 },
          { id: 28, name: "Apfelstrudel mit Eis", price: 7.90 },
          { id: 27, name: "Apfelstrudel mit Soße", price: 6.90 },
          { id: 28, name: "Kugel Eis", price: 2.50 },
          { id: 27, name: "Port. Sahne", price: 1.00 },
          { id: 28, name: "Eis & Heiß", price: 9.90 },
          { id: 28, name: "Queen Marry", price: 9.90 },
        ],
      },
      {
        name: "Kinder",
        items: [
          { id: 27, name: "Dinosaurier", price: 6.50 },
          { id: 28, name: "Nemo", price: 6.90 },
          { id: 27, name: "Lucky Luke R", price: 7.90 },
          { id: 28, name: "Lucky Luke H", price: 7.90 },
          { id: 27, name: "Ferkel", price: 7.50 },
          { id: 28, name: "Eisbär", price: 1.90 },
        ],
      },
      {
        name: "Angebote",
        items: [
          { id: 27, name: "Camembert", price: 8.90 },
          { id: 28, name: "Büsumer", price: 7.90 },
          { id: 27, name: "Rinderroulade", price: 16.90 },
          { id: 28, name: "Kalbsleber", price: 19.90 },
          { id: 27, name: "Hirschsteak", price: 27.90 },
          { id: 28, name: "Viererlei Filet", price: 34.90 },
          { id: 27, name: "Kaiserschmarrn", price: 7.90 },
          { id: 28, name: "Mexican Burger", price: 19.90 },
          { id: 27, name: "Mexican Pfanne", price: 23.90 },
          { id: 28, name: "Steak Menü", price: 24.90 },
          { id: 27, name: "Burger Satt", price: 19.90 },
        ],
      },
      {
        name: "Beilagen",
        items: [
          { id: 27, name: "Pommes Frites", price: 4.50 },
          { id: 28, name: "Ofenkartoffel", price: 5.00 },
          { id: 27, name: "Bratkartoffeln", price: 5.00 },
          { id: 28, name: "Pfannengemüse", price: 7.00 },
          { id: 27, name: "Champi-Zwiebel", price: 6.50 },
          { id: 28, name: "Broccoli", price: 4.50 },
          { id: 27, name: "Maiskörner", price: 4.50 },
          { id: 28, name: "Blattspinat", price: 5.00 },
          { id: 27, name: "Röstbrot", price: 2.00 },
          { id: 28, name: "Süßkartoffelpommes", price: 6.00 },
          { id: 27, name: "Country Potatoes", price: 4.50 },
          { id: 28, name: "Kroketten", price: 5.00 },
          { id: 27, name: "Salzkartoffeln", price: 5.50 },
          { id: 28, name: "Kartoffelpüree", price: 5.00 },
          { id: 27, name: "Rosmarinkartoffeln", price: 5.50 },
          { id: 28, name: "Reis", price: 4.00 },
          { id: 27, name: "gebratene Zwiebeln", price: 4.00 },
          { id: 28, name: "Champignonrahmsoße", price: 4.90 },
          { id: 27, name: "Pfefferrahmsoße", price: 4.50 },
          { id: 28, name: "Steaksoße", price: 1.50 },
          { id: 27, name: "Sourcreme", price: 2.00 },
          { id: 28, name: "Kräuterbutter", price: 1.50 },
          { id: 27, name: "Sauce Hollandaise", price: 3.90 },
        ],
      },
      {
        name: "Mittag",
        items: [
          { id: 27, name: "Mittag 1", price: 11.90 },
          { id: 28, name: "Mittag 2", price: 10.90 },
          { id: 27, name: "Mittag 3", price: 10.90 },
          { id: 28, name: "Mittag 4", price: 11.90 },
          { id: 27, name: "Mittag 5", price: 10.90 },
          { id: 28, name: "Mittag 6", price: 12.90 },
        ],
      },
    ],
    getraenke: [
      {
        name: "Alkfr. Getränke 0,2l",
        items: [
          { id: 12, name: "Magnus Still 0,25l", price: 3.50 },
          { id: 13, name: "Magnus Feinp. 0,25l", price: 3.50 },
          { id: 12, name: "Tafelwasser 0,2l", price: 2.00 },
          { id: 13, name: "Coca Cola 0,2l", price: 3.50 },
          { id: 12, name: "Coca Cola Zero 0,2l", price: 3.50 },
          { id: 13, name: "Fanta 0,2l", price: 3.50 },
          { id: 12, name: "Sprite 0,2l", price: 3.50 },
          { id: 13, name: "Mezzo Mix 0,2l", price: 3.50 },
          { id: 12, name: "Bitter Lemon 0,2l", price: 3.50 },
          { id: 13, name: "Ginger Ale 0,2l", price: 3.50 },
          { id: 13, name: "Tonic Water 0,2l", price: 3.50 },
        ],
      },
      {
        name: "Alkfr. Getränke 0,4l",
        items: [
          { id: 12, name: "Magnus Still 0,75l", price: 7.90 },
          { id: 13, name: "Magnus Feinp. 0,75l", price: 7.90 },
          { id: 12, name: "Tafelwasser 0,4l", price: 3.60 },
          { id: 13, name: "Coca Cola 0,4l", price: 4.80 },
          { id: 12, name: "Coca Cola Zero 0,4l", price: 4.80 },
          { id: 13, name: "Fanta 0,4l", price: 4.80 },
          { id: 12, name: "Sprite 0,4l", price: 4.80 },
          { id: 13, name: "Mezzo Mix 0,4l", price: 4.80 },
          { id: 12, name: "Bitter Lemon 0,4l", price: 5.00 },
          { id: 13, name: "Ginger Ale 0,4l", price: 5.00 },
          { id: 13, name: "Tonic Water 0,4l", price: 5.00 },
          { id: 13, name: "Fassbr. Holunder", price: 4.50 },
          { id: 13, name: "Fassbr. Rhabarber", price: 4.50 },
          { id: 13, name: "Fassbr. Maracuja", price: 4.50 },
        ],
      },
      {
        name: "Säfte",
        items: [
          { id: 12, name: "Apfelsaft 0,2l", price: 3.90 },
          { id: 13, name: "Apfelsaft 0,4l", price: 5.80 },
          { id: 12, name: "Bananennektar 0,2l", price: 3.90 },
          { id: 13, name: "Bananennektar 0,4l", price: 5.80 },
          { id: 12, name: "Johannissaft 0,2l", price: 3.90 },
          { id: 13, name: "Johannissaft 0,4l", price: 5.80 },
          { id: 12, name: "KiBa 0,2l", price: 3.90 },
          { id: 13, name: "KiBa 0,4l", price: 5.80 },
          { id: 12, name: "Kirschnektar 0,2l", price: 3.90 },
          { id: 13, name: "Kirschnektar 0,4l", price: 5.80 },
          { id: 13, name: "Maracujanektar 0,2l", price: 3.90 },
          { id: 12, name: "Maracujanektar 0,4l", price: 5.80 },
          { id: 13, name: "Orangensaft 0,2l", price: 3.90 },
          { id: 12, name: "Orangensaft 0,4l", price: 5.80 },
          { id: 13, name: "Rhabarbersaft 0,2l", price: 3.90 },
          { id: 12, name: "Rhabarbersaft 0,4l", price: 5.80 },
          { id: 13, name: "Tomatensaft 0,2l", price: 3.90 },
          { id: 12, name: "Tomatensaft 0,4l", price: 6.00 },
        ],
      },
      {
        name: "Schorlen",
        items: [
          { id: 12, name: "Apfelschorle 0,2l", price: 3.90 },
          { id: 13, name: "Apfelschorle 0,4l", price: 5.80 },
          { id: 12, name: "Bananenschorle 0,2l", price: 3.90 },
          { id: 13, name: "Bananenschorle 0,4l", price: 5.80 },
          { id: 12, name: "Johannisschorle 0,2l", price: 3.90 },
          { id: 13, name: "Johannisschorle 0,4l", price: 5.80 },
          { id: 12, name: "Kirschschorle 0,2l", price: 3.90 },
          { id: 13, name: "Kirschschorle 0,4l", price: 5.80 },
          { id: 12, name: "Maracujaschorle 0,2l", price: 3.90 },
          { id: 13, name: "Maracujaschorle 0,4l", price: 5.80 },
          { id: 12, name: "Orangenschorle 0,2l", price: 3.90 },
          { id: 13, name: "Orangenschorle 0,4l", price: 5.80 },
          { id: 12, name: "Rhabarberschorle 0,2l", price: 3.90 },
          { id: 13, name: "Rhabarberschorle 0,4l", price: 5.80 },
        ],
      },
      {
        name: "Biere vom Fass",
        items: [
          { id: 12, name: "Pils 0,3l", price: 3.90 },
          { id: 13, name: "Pils 0,5l", price: 5.90 },
          { id: 12, name: "Dunkelbier 0,3l", price: 3.90 },
          { id: 13, name: "Dunkelbier 0,5l", price: 5.90 },
          { id: 12, name: "Alsterwasser 0,3l", price: 3.90 },
          { id: 13, name: "Alsterwasser 0,5l", price: 5.90 },
          { id: 12, name: "Krefelder 0,3l", price: 3.90 },
          { id: 13, name: "Krefelder 0,5l", price: 5.90 },
          { id: 12, name: "Kellerbier 0,3l", price: 3.90 },
          { id: 13, name: "Kellerbier 0,5l", price: 5.90 },
          { id: 13, name: "Hefeweizen", price: 5.90 },
          { id: 13, name: "Bierprobe", price: 7.50 },
        ],
      },
      {
        name: "Fl. Biere",
        items: [
          { id: 12, name: "Kristallweizen", price: 5.90 },
          { id: 13, name: "Dunkelweizen", price: 5.90 },
          { id: 12, name: "Vitamalz", price: 3.90 },
          { id: 13, name: "Alkfr. Weizen", price: 5.90 },
          { id: 12, name: "Alkfr. Pils", price: 3.90 },
          { id: 13, name: "Berliner Weisse", price: 5.50 },
        ],
      },
      {
        name: "Cocktail",
        items: [
          { id: 12, name: "Piña Colada", price: 9.90 },
          { id: 13, name: "Sex on the Beach", price: 9.90 },
          { id: 12, name: "Sportsman", price: 7.90 },
          { id: 13, name: "Tequila Sunrise", price: 9.90 },
        ],
      },
      {
        name: "Digestif",
        items: [
          { id: 12, name: "Averna 4cl", price: 5.00 },
          { id: 13, name: "Cardenal Mendoza 4cl", price: 6.50 },
          { id: 12, name: "Grappa 2cl", price: 4.00 },
          { id: 13, name: "Helbingkümmel 2cl", price: 3.50 },
          { id: 12, name: "Hennessy 4cl", price: 7.90 },
          { id: 13, name: "Jubiläums Aquavit 2cl", price: 4.00 },
          { id: 12, name: "Jägermeister 4cl", price: 5.00 },
          { id: 13, name: "Linie Aquavit 2cl", price: 4.00 },
          { id: 12, name: "Malteser Aquavit 2cl", price: 4.00 },
          { id: 13, name: "V. - Zwetschge 2cl", price: 6.90 },
          { id: 13, name: "V. - Orangengeist 2cl", price: 6.90 },
          { id: 12, name: "V. -  Pfirsich 2cl", price: 6.90 },
          { id: 13, name: "V. - Himbeergeist 2cl", price: 6.90 },
          { id: 13, name: "V. - Birne 2cl", price: 6.90 },
        ],
      },
      {
        name: "Aperitif",
        items: [
          { id: 12, name: "Aperol 4cl", price: 4.00 },
          { id: 13, name: "Aperol-Spritz", price: 8.90 },
          { id: 12, name: "Campari 4cl", price: 4.00 },
          { id: 13, name: "Dry White 5cl ", price: 4.50 },
          { id: 12, name: "Fine Ruby 5cl ", price: 4.50 },
          { id: 13, name: "Martini Bianco 5cl", price: 4.70 },
          { id: 12, name: "Martini Rosso 5cl", price: 4.70 },
          { id: 13, name: "Lillet Wild Berry", price: 6.50 },
        ],
      },
      {
        name: "Spirits",
        items: [
          { id: 12, name: "Amaretto 4cl", price: 4.50 },
          { id: 13, name: "Baileys 4cl", price: 5.00 },
          { id: 12, name: "Glenfiddich 4cl", price: 7.50 },
          { id: 13, name: "Havana Club Braun 4cl", price: 7.50 },
          { id: 12, name: "Havana Club Weiß 4cl", price: 5.00 },
          { id: 13, name: "Hendricks Gin 4cl", price: 8.50 },
          { id: 12, name: "Jack Daniel's 4cl", price: 5.00 },
          { id: 13, name: "Nordisch Vodka 4cl", price: 5.00 },
          { id: 12, name: "Ouzo 2cl", price: 3.00 },
          { id: 13, name: "Ramazzotti 4cl ", price: 5.00 },
          { id: 12, name: "Sambuca 2cl", price: 3.50 },
          { id: 13, name: "Southern Comfort 4cl", price: 5.00 },
          { id: 12, name: "Tequila Braun 2cl", price: 3.00 },
          { id: 13, name: "Tequila Weiß 2cl", price: 3.00 },
        ],
      },
      {
        name: "Schaumweine",
        items: [
          { id: 12, name: "Piccolo 0,2l", price: 7.40 },
          { id: 13, name: "Paul Delane 0,75l", price: 33.00 },
        ],
      },
      {
        name: "Weißweine",
        items: [
          { id: 12, name: "Weißburgunder 0,2l", price: 6.80 },
          { id: 13, name: "Weißburgunder 0,5l", price: 13.90 },
          { id: 12, name: "Weißburgunder 1l", price: 27.00 },
          { id: 13, name: "Chardonnay 0,2l", price: 7.00 },
          { id: 12, name: "Chardonnay 0,5l", price: 14.50 },
          { id: 13, name: "Chardonnay 0,75l", price: 21.50 },
          { id: 12, name: "Sauvignon Blanc 0,2l", price: 7.90 },
          { id: 13, name: "Sauvignon Blanc 0,5l", price: 18.90 },
          { id: 12, name: "Sauvignon Blanc 0,75l", price: 27.00 },
          { id: 13, name: "Weinschorle 0,2l", price: 5.00 },
          { id: 13, name: "Weinschorle 0,5l", price: 10.80 },
        ],
      },
      {
        name: "Rotweine",
        items: [
          { id: 12, name: "Tempr. Crianza 0,2l", price: 5.50 },
          { id: 13, name: "Tempr. Crianza 0,5l", price: 12.50 },
          { id: 12, name: "Tempr. Crianza 0,75l", price: 17.50 },
          { id: 13, name: "Cabernet Sauv. 0,2l", price: 6.50 },
          { id: 12, name: "Cabernet Sauv. 0,5l", price: 13.90 },
          { id: 13, name: "Cabernet Sauv. 0,75l", price: 20.90 },
          { id: 12, name: "Shiraz 0,2l", price: 6.90 },
          { id: 13, name: "Shiraz 0,5l", price: 14.90 },
          { id: 12, name: "Shiraz 0,75l", price: 22.50 },
          { id: 13, name: "Carménère 0,2l", price: 7.90 },
          { id: 12, name: "Carménère 0,5l", price: 18.90 },
          { id: 13, name: "Carménère 0,75l", price: 27.00 },
        ],
      },
      {
        name: "Rosé Weine",
        items: [
          { id: 12, name: "Portugieser Rosé 0,2l", price: 6.40 },
          { id: 13, name: "Portugieser Rosé 0,5l", price: 13.50 },
          { id: 12, name: "Portugieser Rosé 1l", price: 24.90 },
          { id: 13, name: "Petite Rosée 0,2l", price: 6.80 },
          { id: 12, name: "Petite Rosée 0,5l", price: 14.50 },
          { id: 13, name: "Petite Rosée 0,75l", price: 21.50 },
        ],
      },
      {
        name: "Heiße Getränke",
        items: [
          { id: 12, name: "Cappuccino", price: 4.50 },
          { id: 13, name: "Espresso", price: 2.50 },
          { id: 12, name: "Espresso Doppelt", price: 4.50 },
          { id: 13, name: "Espresso Macchiato", price: 3.20 },
          { id: 12, name: "Heiße Schokolade", price: 5.50 },
          { id: 13, name: "Latte Macchiato", price: 5.50 },
          { id: 12, name: "Milchkaffee", price: 4.90 },
          { id: 13, name: "Tasse Kaffee", price: 3.50 },
          { id: 12, name: "Tee", price: 4.50 },
          { id: 13, name: "Glühwein", price: 4.90 },
        ],
      },
    ],
  };

  const menu = generateMenuWithIds(initialMenu);

  const handleMenuTypeChange = (type: MenuType) => {
    setMenuType(type);
    setSelectedCategory(null);
  };

  const addToTable = (item: MenuItem) => {
    if (!selectedTable) return;
    const updatedTables = tables.map((table) => {
      if (table.id === selectedTable.id) {
        const existingOrder = table.orders.find((order) => order.item.id === item.id);
        let newOrders;
        if (existingOrder) {
          newOrders = table.orders.map((order) =>
            order.item.id === item.id ? { ...order, quantity: order.quantity + 1 } : order
          );
        } else {
          newOrders = [...table.orders, { item, quantity: 1 }];
        }
        const updatedTable = { ...table, orders: newOrders, total: table.total + item.price };
        setSelectedTable(updatedTable);
        return updatedTable;
      }
      return table;
    });
    setTables(updatedTables);
    saveTablesToLocalStorage(updatedTables); // Speichern im Local Storage
  };

  const removeFromTable = (item: MenuItem) => {
    if (!selectedTable) return;
    const updatedTables = tables.map((table) => {
      if (table.id === selectedTable.id) {
        const newOrders = table.orders
          .map((order) =>
            order.item.id === item.id && order.item.price === item.price
              ? { ...order, quantity: order.quantity - 1 }
              : order
          )
          .filter((order) => order.quantity > 0);
        const updatedTable = {
          ...table,
          orders: newOrders,
          total: table.total - item.price,
        };
        setSelectedTable(updatedTable);
        return updatedTable;
      }
      return table;
    });
    setTables(updatedTables);
    saveTablesToLocalStorage(updatedTables); // Local Storage aktualisieren
  };

  const increaseQuantity = (item: MenuItem) => {
    if (!selectedTable) return;
    const updatedTables = tables.map((table) => {
      if (table.id === selectedTable.id) {
        const newOrders = table.orders.map((order) =>
          order.item.id === item.id && order.item.price === item.price
            ? { ...order, quantity: order.quantity + 1 }
            : order
        );
        const updatedTable = {
          ...table,
          orders: newOrders,
          total: table.total + item.price,
        };
        setSelectedTable(updatedTable);
        return updatedTable;
      }
      return table;
    });
    setTables(updatedTables);
    saveTablesToLocalStorage(updatedTables); // Local Storage aktualisieren
  };

  const addTable = () => {
    if (newTableNumber.trim() === "") return;
    const newTable = {
      id: tables.length + 1,
      name: `Tisch ${newTableNumber}`,
      orders: [],
      total: 0,
    };
    const updatedTables = [...tables, newTable];
    setTables([...tables, newTable]);
    saveTablesToLocalStorage(updatedTables);
    setNewTableNumber("");
  };

  const handleDiversConfirm = () => {
    if (!selectedTable || !diversAmount) return;
  
    const amount = parseFloat(diversAmount);
    if (isNaN(amount) || amount <= 0) return;
  
    const diversItem: MenuItem = {
      id: -1, // Spezielle ID für Divers-Einträge
      name: "Divers",
      price: amount,
    };
  
    const updatedTables = tables.map((table) => {
      if (table.id === selectedTable.id) {
        // Überprüfen, ob bereits ein Divers-Eintrag mit demselben Betrag existiert
        const existingDiversOrder = table.orders.find(
          (order) => order.item.name === "Divers" && order.item.price === amount
        );
  
        let newOrders;
        if (existingDiversOrder) {
          // Wenn ja, erhöhe die Menge
          newOrders = table.orders.map((order) =>
            order.item.name === "Divers" && order.item.price === amount
              ? { ...order, quantity: order.quantity + 1 }
              : order
          );
        } else {
          // Wenn nein, füge einen neuen Eintrag hinzu
          newOrders = [...table.orders, { item: diversItem, quantity: 1 }];
        }
  
        const updatedTable = {
          ...table,
          orders: newOrders,
          total: table.total + amount,
        };
        setSelectedTable(updatedTable);
        return updatedTable;
      }
      return table;
    });
  
    setTables(updatedTables);
    saveTablesToLocalStorage(updatedTables); // Local Storage aktualisieren
    setDiversAmount("");
  };

  const deleteTable = (tableId: number) => {
    const updatedTables = tables.filter((table) => table.id !== tableId);
    setTables(updatedTables);
    saveTablesToLocalStorage(updatedTables); // Speichern im Local Storage
    if (selectedTable?.id === tableId) {
      setSelectedTable(null); // Auswahl zurücksetzen, wenn der gelöschte Tisch ausgewählt war
    }
  };

  const [receiptNumber, setReceiptNumber] = useState<number>(170803); // Standardwert

useEffect(() => {
  // Nur im Browser ausführen
  if (typeof window !== "undefined") {
    const savedReceiptNumber = localStorage.getItem("receiptNumber");
    if (savedReceiptNumber) {
      setReceiptNumber(parseInt(savedReceiptNumber, 10));
    }
  }
}, []);

  const printReceipt = () => {
    // Client-only Guard
    if (typeof window === "undefined" || !selectedTable) return;

    // Quittungsnummer erhöhen
    const currentReceiptNumber = receiptNumber;
    setReceiptNumber((prev) => prev + 1);
    localStorage.setItem("receiptNumber", (currentReceiptNumber + 1).toString());

    // JSON für den Druck generieren
    const receiptData = generateReceiptJSON(selectedTable, currentReceiptNumber);

    // JSON für URL encodieren
    const encodedData = encodeURIComponent(JSON.stringify(receiptData));

    // IAMPrintReceipt-URL zum Drucken
    const printURL = `IAMPrintReceipt://?ticketJSON=${encodedData}`;

    // Debugging: JSON Vorschau anzeigen
    console.log("IAMPrintReceipt JSON:", receiptData);

    // App öffnen & Beleg drucken
    window.location.href = printURL;
  };

  const generateReceiptJSON = (selectedTable: TableData, receiptNumber: number) => {
    const date = new Date().toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

    const time = new Date().toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      defaultAlign: "left" as const,
      defaultTextSize: 1,
      defaultCharactersPerLine: 42,
      sections: [
        {
          type: "image" as const,
          url: "https://mendoza-ahrensburg.de/wp-content/uploads/2025/03/Logo.png",
          align: "center" as const,
        },
        {
          type: "text" as const,
          text: `MENDOZA AHRENSBURG\nNeue Straße 9\n22926 Ahrensburg\nTel.: 04102/2057779\nwww.mendoza-ahrensburg.de`,
          align: "center" as const,
        },
        {
          type: "divider" as const,
          lines: 3,
        },
        {
          type: "text" as const,
          text: `Quittung ${receiptNumber}\n${date}, ${time}`,
          align: "left" as const, // Linksbündig
        },
        {
          type: "divider" as const,
          lines: 2,
        },
        {
          type: "text" as const,
          text: `Innen, ${selectedTable.name}`,
          bold: true,
          align: "center" as const,
        },
        {
          type: "divider" as const,
          lines: 2,
        },
        {
          type: "items" as const,
          items: selectedTable.orders.map((order) => ({
            name: `${order.quantity} ${" ".repeat(5)} ${order.item.name} ${" ".repeat(5)} ${order.item.price}`, //klappt so nicht, weil nicht gleichmäßig
            value: order.item.price * order.quantity,
          })),
        },
        {
          type: "divider" as const,
          lines: 2,
        },
        {
          type: "items" as const,
          textSize: 2,
          bold: true,
          items: [
            {
              name: "Summe",
              value: selectedTable.total,
            },
          ],
        },
        {
          type: "divider" as const,
          lines: 3,
        },
        {
          type: "text" as const,
          text: `MwSt. 19% auf ${selectedTable.total.toFixed(2)}€: ${(selectedTable.total - selectedTable.total / 1.19).toFixed(2)}€`,
        },
        {
          type: "divider" as const,
          lines: 2,
        },
        {
          type: "text" as const,
          text: "MwSt.-Nummer: DE328075928\n3015204397",
        },
        {
          type: "divider" as const,
          lines: 3,
        },
        {
          type: "text" as const,
          text: "Vielen Dank für Ihren Besuch!",
          bold: true,
          align: "center" as const,
        },
        {
          type: "divider" as const,
          lines: 2,
        },
        {
          type: "text" as const,
          text: "Für Ihre Festlichkeiten\n bieten wir Ihnen unseren\n Clubraum für bis zu 50 Personen.",
          align: "center" as const,
        },
        {
          type: "divider" as const,
          lines: 2,
        },
        {
          type: "text" as const,
          text: "Ihr MENDOZA Team",
          bold: true,
          align: "center" as const,
        },
        {
          type: "divider" as const,
          lines: 3,
        },
        {
          type: "cut" as const,
        },
      ],
    };
  };

  return (
    <div className="row">
      <h1 className="text-xl font-bold text-center">Restaurant Bestell-App</h1>

      {/* Tischauswahl */}
      <div>
        <div className="mb-4"></div>
        <h2 className="font-semibold mb-2">Tische</h2>
        <div className="flex space-x-2 mb-2">
          <Input
            type="text"
            placeholder="Tisch Nr."
            value={newTableNumber}
            onChange={(e) => setNewTableNumber(e.target.value)}
          />
          <Button onClick={addTable} className="bg-green-500 text-white">
            +
          </Button>
        </div>
        {tables.map((table) => (
          <div key={table.id} className="flex items-center space-x-2 mb-2">
            <Card
              className={`p-4 cursor-pointer flex-grow ${
                selectedTable?.id === table.id ? "bg-blue-500" : ""
              }`}
              onClick={() => {
                setSelectedTable(table);
                setSelectedCategory(null); // Hauptgruppen anzeigen
                setMenuType("speisen"); // Speisen-Ansicht zurücksetzen
              }}
              
            >
              {table.name} - {table.total.toFixed(2)}€
            </Card>
            <Button
              className="bg-red-500 text-white"
              onClick={() => deleteTable(table.id)}
            >
              🗑️ {/* Mülleimer-Symbol */}
            </Button>
          </div>
        ))}
      </div>

      {/* Menüauswahl */}
      {selectedTable && (
        <div>
          <div className="mb-4"></div>
          <h2 className="font-semibold mb">Menü</h2>
          <div className="flex space-x-2 mb-2">
            <Button
              className="bg-green-500"
              onClick={() => handleMenuTypeChange("speisen")}
            >
              Speisen
            </Button>
            <Button
              className="bg-green-500"
              onClick={() => handleMenuTypeChange("getraenke")}
            >
              Getränke
            </Button>
          </div>
          {!selectedCategory ? (
            <div className="grid grid-cols-2 gap-2">
              {menu[menuType].map((category) => (
                <Button
                  key={category.name}
                  className="w-full mb-2"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </Button>
              ))}
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Betrag"
                  value={diversAmount}
                  onChange={(e) => setDiversAmount(e.target.value)}
                  className="w-full"
                />
                <Button
                  className="bg-gray-500 text-white"
                  onClick={handleDiversConfirm}
                >
                  Divers
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                {menu[menuType]
                  .find((cat) => cat.name === selectedCategory)
                  ?.items.map((item) => (
                    <Button
                      key={item.id}
                      className="w-full mb-2"
                      onClick={() => addToTable(item)}
                    >
                      {item.name} - {item.price.toFixed(2)}€
                    </Button>
                  ))}
              </div>
              <Button
                className="w-full bg-gray-500"
                onClick={() => setSelectedCategory(null)}
              >
                Zurück
              </Button>
            </>
          )}
        </div>
      )}

      {/* Bestellübersicht */}
      {selectedTable && (
        <div>
          <div className="mb-4"></div>
          <h3 className="font-semibold">Bestellung</h3>
          {selectedTable.orders
            .sort((a) => (a.item.id > 4 ? -1 : 1))
            .map((order, index) => (
              <div
                key={index}
                className="flex justify-between items-center space-x-4 mb-2"
              >
                <p>
                  {order.quantity}x {order.item.name} - {order.item.price.toFixed(2)}€
                </p>
                <p>{(order.quantity * order.item.price).toFixed(2)}€</p>
                <div className="flex space-x-2">
                  <Button
                    className="bg-green-500 text-white"
                    onClick={() => increaseQuantity(order.item)}
                  >
                    +
                  </Button>
                  <Button
                    className="bg-red-500 text-white"
                    onClick={() => removeFromTable(order.item)}
                  >
                    -
                  </Button>
                </div>
              </div>
            ))}
          <h3 className="font-bold">Gesamt: {selectedTable.total.toFixed(2)}€</h3>
        </div>
      )}

      {/* Rechnung drucken */}
      {selectedTable && selectedTable.total > 0 && (
        <Button
          className="bg-blue-500 text-white w-full mt-4"
          onClick={printReceipt}
        >
          Rechnung drucken
        </Button>
      )}
    </div>
  );
}