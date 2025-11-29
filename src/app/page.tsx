// src/app/page.tsx
"use client";

import { useState } from "react";
import RestaurantApp from "@/components/RestaurantApp";
import OrderApp from "@/components/OrderApp";
import Button from "@/components/ui/Button";

type View = "kasse" | "bestellung";

export default function Home() {
  const [view, setView] = useState<View>("kasse");

  return (
    <div className="p-4 space-y-4">
      {/* "Homepage" Auswahl */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          onClick={() => setView("kasse")}
          className={view === "kasse" ? "" : "bg-gray-400"}
        >
          Kasse
        </Button>
        <Button
          onClick={() => setView("bestellung")}
          className={view === "bestellung" ? "" : "bg-gray-400"}
        >
          Bestellung
        </Button>
      </div>

      {/* Inhalt */}
      {view === "kasse" ? <RestaurantApp /> : <OrderApp />}
    </div>
  );
}