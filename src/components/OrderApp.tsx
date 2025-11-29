// src/components/OrderApp.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Table from "@/components/ui/Table";
import { suppliers, Supplier, SupplierItem } from "@/components/suppliers";

type OrderRow = SupplierItem & {
  quantity: string; // Eingabe-Menge als String (für Input)
};

export default function OrderApp() {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(
    suppliers.length > 0 ? suppliers[0].id : null
  );
  const [rows, setRows] = useState<OrderRow[]>([]);

  const selectedSupplier: Supplier | undefined = useMemo(
    () => suppliers.find((s) => s.id === selectedSupplierId || null),
    [selectedSupplierId]
  );

  // Wenn Lieferant gewechselt wird: Standard-Bestellformular laden
  useEffect(() => {
    if (!selectedSupplier) {
      setRows([]);
      return;
    }
    const initialRows: OrderRow[] = selectedSupplier.items.map((item) => ({
      ...item,
      quantity: "",
    }));
    setRows(initialRows);
  }, [selectedSupplier]);

  const handleQuantityChange = (index: number, value: string) => {
    let safeValue = value;

    // Löschen erlauben: leere Eingabe bleibt leer
    if (value === "") {
      safeValue = "";
    } else {
      const numeric = parseFloat(value);
      // Wenn etwas eingegeben ist, aber keine gültige Zahl oder < 1, dann auf "1" setzen
      if (isNaN(numeric) || numeric < 1) {
        safeValue = "1";
      }
    }

    setRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity: safeValue };
      return updated;
    });
  };

  const handleFieldChange = (
    index: number,
    field: keyof SupplierItem,
    value: string
  ) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        articleNumber: "",
        name: "",
        unit: "",
        quantity: "",
      },
    ]);
  };

  const buildOrderLines = (): string[] => {
    return rows
      .filter((row) => row.quantity && row.quantity.trim() !== "")
      .map((row) => {
        const artNr = row.articleNumber?.trim();
        const name = row.name || "-";
        const unit = row.unit || "";
        const qty = row.quantity.trim();

        // Wenn Artikelnr. vorhanden ist: "10001 Beispiel 2 Kg"
        if (artNr) {
          return `- ${artNr} ${name} ${qty} ${unit}`.trim();
        }

        // Ohne Artikelnr.: "Beispiel 2 Kg"
        return `- ${name} ${qty} ${unit}`.trim();
      });
  };

  const getCustomerNumber = (): string | null => {
    if (!selectedSupplier) return null;
    // Versuch, "K-Nr.: 32474" aus dem Namen zu parsen
    const match = selectedSupplier.name.match(/K-Nr\.\s*:?\s*(\d+)/i);
    return match?.[1] ?? null;
  };

  const buildEmailBody = (): string => {
    if (!selectedSupplier) return "";

    const lines = buildOrderLines();
    const header = `Bestellung für morgen\n`;

    if (lines.length === 0) {
      return (
        header +
        "\n(Noch keine Mengen eingetragen)\n\nMit freundlichen Grüßen\nIrfan Majeed"
      );
    }

    return (
      header +
      "\n" +
      lines.join("\n") +
      "\n\nMit freundlichen Grüßen\nIrfan Majeed"
    );
  };

  const buildWhatsAppBody = (): string => {
    if (!selectedSupplier) return "";

    const lines = buildOrderLines();
    const customerNumber = getCustomerNumber();
    const firstLine = customerNumber
      ? `Bestellung für morgen – Kundennr. ${customerNumber}`
      : "Bestellung für morgen";

    if (lines.length === 0) {
      return (
        firstLine +
        "\n\n(Noch keine Mengen eingetragen)\n\nMit freundlichen Grüßen\nIrfan Majeed"
      );
    }

    return (
      firstLine +
      "\n\n" +
      lines.join("\n") +
      "\n\nMit freundlichen Grüßen\nIrfan Majeed"
    );
  };

  const handleSendWhatsApp = () => {
    if (!selectedSupplier || selectedSupplier.contactType !== "whatsapp") return;
    const text = buildWhatsAppBody();
    if (!text) return;

    // Nummer "sauber" machen (nur Ziffern + evtl. führendes +)
    const raw = selectedSupplier.contact.trim();
    const phone = raw.replace(/[^\d+]/g, "");
    const url = `https://wa.me/${encodeURIComponent(
      phone
    )}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleSendEmail = () => {
    if (!selectedSupplier || selectedSupplier.contactType !== "email") return;
    const text = buildEmailBody();
    if (!text) return;

    const customerNumber = getCustomerNumber();
    const subject = customerNumber
      ? `Bestellung für morgen – Kundennr. ${customerNumber}`
      : `Bestellung für morgen – ${selectedSupplier.name}`;
    const url = `mailto:${encodeURIComponent(
      selectedSupplier.contact
    )}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    window.location.href = url;
  };

  const orderPreview =
    selectedSupplier?.contactType === "whatsapp"
      ? buildWhatsAppBody()
      : buildEmailBody();
  const hasQuantities = rows.some(
    (row) => row.quantity && row.quantity.trim() !== ""
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Bestellungen</h1>

      {/* Lieferanten-Auswahl */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-1">
          <h2 className="font-semibold mb-2">Lieferanten</h2>
          <div className="space-y-2">
            {suppliers.map((supplier) => (
              <Card
                key={supplier.id}
                className={`cursor-pointer ${
                  supplier.id === selectedSupplierId
                    ? "bg-blue-600 text-white border-blue-700"
                    : "bg-white text-black"
                }`}
                onClick={() => setSelectedSupplierId(supplier.id)}
              >
                <div className="font-medium">{supplier.name}</div>
                <div className="text-sm text-black">
                  {supplier.contactType === "whatsapp"
                    ? `WhatsApp: ${supplier.contact}`
                    : `E-Mail: ${supplier.contact}`}
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Bestellformular */}
        <Card className="md:col-span-3">
          <h2 className="font-semibold mb-2">
            {selectedSupplier
              ? `Bestellformular – ${selectedSupplier.name}`
              : "Kein Lieferant ausgewählt"}
          </h2>

          {selectedSupplier ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <thead>
                    <tr>
                      <th className="border px-2 py-1 text-left">Art.-Nr.</th>
                      <th className="border px-2 py-1 text-left">Artikel</th>
                      <th className="border px-2 py-1 text-left">Einheit</th>
                      <th className="border px-2 py-1 text-left">Menge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={row.id}>
                        <td className="border px-2 py-1">
                          <Input
                            value={row.articleNumber}
                            onChange={(e) =>
                              handleFieldChange(
                                index,
                                "articleNumber",
                                e.target.value
                              )
                            }
                            className="w-full"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <Input
                            value={row.name}
                            onChange={(e) =>
                              handleFieldChange(index, "name", e.target.value)
                            }
                            className="w-full"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <Input
                            value={row.unit}
                            onChange={(e) =>
                              handleFieldChange(index, "unit", e.target.value)
                            }
                            className="w-full"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <Input
                            type="number"
                            value={row.quantity}
                            onChange={(e) =>
                              handleQuantityChange(index, e.target.value)
                            }
                            className="w-full"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <Button onClick={handleAddRow} className="mt-2">
                + Zeile hinzufügen
              </Button>

              {/* Aktionen */}
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedSupplier.contactType === "whatsapp" && (
                  <Button
                    onClick={handleSendWhatsApp}
                    className={!hasQuantities ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    Per WhatsApp senden
                  </Button>
                )}
                {selectedSupplier.contactType === "email" && (
                  <Button
                    onClick={handleSendEmail}
                    className={!hasQuantities ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    Per E-Mail senden
                  </Button>
                )}
              </div>

              {/* Vorschau */}
              <div className="mt-4">
                <h3 className="font-semibold mb-1">Vorschau der Nachricht</h3>
                <textarea
                  readOnly
                  className="w-full border rounded p-2 h-40 text-sm"
                  value={orderPreview}
                />
              </div>
            </div>
          ) : (
            <div>Bitte einen Lieferanten auswählen.</div>
          )}
        </Card>
      </div>
    </div>
  );
}