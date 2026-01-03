import { TableData } from "@/components/RestaurantApp";

  export const generateReceiptJSON = (selectedTable: TableData, receiptNumber: number) => {
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
      defaultCharactersPerLine: 48,
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
              name: `${String(order.quantity).padEnd(5)}${order.item.name.padEnd(25)}${order.item.price.toFixed(2).replace(".", ",").padStart(7)}`,
              value: order.item.price * order.quantity, // Stellt sicher, dass value ohne Euro ist
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
          text: (() => {
            const { speisenBrutto, getraenkeBrutto } = selectedTable.orders.reduce(
              (acc, order) => {
                const type = order.type === "getraenke" ? "getraenke" : "speisen"; // Fallback für alte Daten
                const brutto = order.item.price * order.quantity;
                if (type === "getraenke") acc.getraenkeBrutto += brutto;
                else acc.speisenBrutto += brutto;
                return acc;
              },
              { speisenBrutto: 0, getraenkeBrutto: 0 }
            );
            const lines: string[] = [];
            if (speisenBrutto > 0) {
              const speisenMwst = speisenBrutto - speisenBrutto / 1.07;
              lines.push(
                `A: MwSt. 7% auf ${speisenBrutto.toFixed(2).replace(".", ",")}€: ${speisenMwst
                  .toFixed(2)
                  .replace(".", ",")}€`
              );
            }
            if (getraenkeBrutto > 0) {
              const getraenkeMwst = getraenkeBrutto - getraenkeBrutto / 1.19;
              lines.push(
                `B: MwSt. 19% auf ${getraenkeBrutto.toFixed(2).replace(".", ",")}€: ${getraenkeMwst
                  .toFixed(2)
                  .replace(".", ",")}€`
              );
            }
            return lines.join("\n");
          })(),
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
            type: "image" as const,
            url: "https://mendoza-ahrensburg.de/wp-content/uploads/2025/03/frame.png",
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
