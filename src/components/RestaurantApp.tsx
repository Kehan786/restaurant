"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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

export default function RestaurantApp() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [menuType, setMenuType] = useState<MenuType>("speisen");
  const [newTableNumber, setNewTableNumber] = useState<string>("");

  const menu: MenuData = {
    speisen: [
      {
        name: "Pizza",
        items: [
          { id: 1, name: "Pizza Margherita", price: 8 },
          { id: 2, name: "Pizza Salami", price: 9 },
        ],
      },
      {
        name: "Pasta",
        items: [
          { id: 3, name: "Pasta Carbonara", price: 10 },
          { id: 4, name: "Pasta Bolognese", price: 11 },
        ],
      },
    ],
    getraenke: [
      {
        name: "Softdrinks",
        items: [
          { id: 5, name: "Cola", price: 3 },
          { id: 6, name: "Fanta", price: 3 },
        ],
      },
      {
        name: "Bier",
        items: [
          { id: 7, name: "Pils", price: 4 },
          { id: 8, name: "Weizen", price: 4.5 },
        ],
      },
    ],
  };

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
  };

  const removeFromTable = (item: MenuItem) => {
    if (!selectedTable) return;
    const updatedTables = tables.map((table) => {
      if (table.id === selectedTable.id) {
        const newOrders = table.orders
          .map((order) =>
            order.item.id === item.id
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
  };

  const addTable = () => {
    if (newTableNumber.trim() === "") return;
    const newTable = {
      id: tables.length + 1,
      name: `Tisch ${newTableNumber}`,
      orders: [],
      total: 0,
    };
    setTables([...tables, newTable]);
    setNewTableNumber("");
  };

  const [receiptNumber, setReceiptNumber] = useState<number>(170803);

  const printReceipt = () => {
    // Client-only Guard
    if (typeof window === "undefined" || !selectedTable) return;

    // Quittungsnummer erhöhen
    const currentReceiptNumber = receiptNumber;
    setReceiptNumber((prev) => prev + 1);

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
          <Card
            key={table.id}
            className={`p-4 mb-2 cursor-pointer ${
              selectedTable?.id === table.id ? "bg-blue-500" : ""
            }`}
            onClick={() => setSelectedTable(table)}
          >
            {table.name} - {table.total.toFixed(2)}€
          </Card>
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
            menu[menuType].map((category) => (
              <Button
                key={category.name}
                className="block w-full mb-2"
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </Button>
            ))
          ) : (
            <>
              {menu[menuType]
                .find((cat) => cat.name === selectedCategory)
                ?.items.map((item) => (
                  <Button
                    key={item.id}
                    className="block w-full mb-2"
                    onClick={() => addToTable(item)}
                  >
                    {item.name} - {item.price.toFixed(2)}€
                  </Button>
                ))}
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
                <Button
                  className="bg-gray-500 text-white"
                  onClick={() => removeFromTable(order.item)}
                >
                  -
                </Button>
              </div>
            ))}
          <h3 className="font-bold">Gesamt: {selectedTable.total.toFixed(2)}€</h3>
        </div>
      )}

      {/* Rechnung drucken */}
      <Button
        className="bg-blue-500 text-white w-full mt-4"
        onClick={printReceipt}
      >
        Rechnung drucken
      </Button>
    </div>
  );
}