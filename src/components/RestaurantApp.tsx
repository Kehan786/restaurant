"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import "./RestaurantApp.css"; // Pfad zur CSS-Datei
import { initialMenu, MenuItem, MenuCategory, MenuType, MenuData } from "@/components/alleArtikeln";
import { generateReceiptJSON } from "@/components/rechnungsvorlage";

type OrderItem = {
  item: MenuItem;
  quantity: number;
  type: MenuType; // Neues Feld hinzufügen
};

export type TableData = {
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
            order.item.id === item.id ? { 
              ...order, 
              quantity: order.quantity + 1 
            } : order
          );
        } else {
          newOrders = [
            ...table.orders, 
            { 
              item, 
              quantity: 1, 
              type: menuType // Hier wird MenuType verwendet
            }
          ];
        }
        const updatedTable = { 
          ...table, 
          orders: newOrders,
          total: table.total + item.price 
        };
        setSelectedTable(updatedTable);
        return updatedTable;
      }
      return table;
    });
    setTables(updatedTables);
    saveTablesToLocalStorage(updatedTables);
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
    
    // Generate new unique ID based on highest existing ID
    const newId = tables.length > 0 
      ? Math.max(...tables.map(t => t.id)) + 1 
      : 1;
  
    const newTable = {
      id: newId,
      name: `Tisch ${newTableNumber}`,
      orders: [],
      total: 0,
    };
    
    const updatedTables = [...tables, newTable];
    setTables(updatedTables);
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
  
    const newOrder: OrderItem = {
      item: diversItem,
      quantity: 1,
      type: "speisen", // Explizit als MenuType
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
          newOrders = [...table.orders, newOrder];
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
    setDiversAmount(""); // Eingabefeld zurücksetzen
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
      .reduce(
        (acc, order) => {
          // Getränke und Speisen trennen
          order.type === "getraenke" 
            ? acc.drinks.push(order) 
            : acc.speisen.push(order);
          return acc;
        },
        { drinks: [] as OrderItem[], speisen: [] as OrderItem[] }
      )
      // Kombiniere die Gruppen korrekt
      .drinks.concat(
        // Zugriff auf speisen über das Reduce-Ergebnis
        selectedTable.orders
          .reduce(
            (acc, order) => {
              order.type === "speisen" && acc.speisen.push(order);
              return acc;
            },
            { speisen: [] as OrderItem[] }
          ).speisen
      )
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