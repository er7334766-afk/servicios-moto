import { useState } from "react";
import { galeraDB, type Galera as GaleraRecord, type GaleraPagada } from "../lib/db";
import ConfirmDialog from "./ConfirmDialog";

interface Props {
  showToast: (message: string, type?: "success" | "error") => void;
}

interface ItemDraft {
  repuesto: string;
  precio_lps: string;
}

const emptyDraft = (): ItemDraft => ({ repuesto: "", precio_lps: "" });

export default function Galera({ showToast }: Props) {
  const [records, setRecords] = useState(() => galeraDB.getAll());
  const [paidRecords, setPaidRecords] = useState<GaleraPagada[]>([]);
  const [showPaid, setShowPaid] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [drafts, setDrafts] = useState<Record<number, ItemDraft>>({});
  const [confirmId, setConfirmId] = useState<number | null>(null);

  function refresh() {
    setRecords(galeraDB.getAll());
    if (showPaid) setPaidRecords(galeraDB.getPaid());
  }

  function createGalera(event: React.FormEvent) {
    event.preventDefault();
    if (!clientName.trim()) {
      showToast("Escribe el nombre del cliente", "error");
      return;
    }
    const record = galeraDB.create({ nombre_cliente: clientName.trim() });
    setClientName("");
    setDrafts((current) => ({ ...current, [record.id_galera]: emptyDraft() }));
    refresh();
    showToast("Galera creada; agrega los repuestos");
  }

  function updateDraft(id: number, field: keyof ItemDraft, value: string) {
    setDrafts((current) => ({
      ...current,
      [id]: { ...(current[id] ?? emptyDraft()), [field]: value },
    }));
  }

  function addItem(id: number, event: React.FormEvent) {
    event.preventDefault();
    const draft = drafts[id] ?? emptyDraft();
    const price = Number(draft.precio_lps);
    if (!draft.repuesto.trim() || !Number.isFinite(price) || price < 0) {
      showToast("Escribe el repuesto y un precio válido", "error");
      return;
    }
    galeraDB.addItem(id, { repuesto: draft.repuesto.trim(), precio_lps: price });
    setDrafts((current) => ({ ...current, [id]: emptyDraft() }));
    refresh();
    showToast("Repuesto agregado");
  }

  function markPaid(id: number) {
    galeraDB.markPaid(id);
    setConfirmId(null);
    setDrafts((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    refresh();
    showToast("Galera pagada y eliminada");
  }

  function togglePaidHistory() {
    const next = !showPaid;
    setShowPaid(next);
    if (next) setPaidRecords(galeraDB.getPaid());
  }

  function deleteItem(id: number) {
    galeraDB.deleteItem(id);
    refresh();
    showToast("Repuesto eliminado");
  }

  const totalPending = records.reduce((sum, record) => sum + Number(record.total_lps), 0);
  const normalizedSearch = search.trim().toLowerCase();
  const filteredRecords = records.filter((record) =>
    record.nombre_cliente.toLowerCase().includes(normalizedSearch)
  );
  const filteredPaidRecords = paidRecords.filter((record) =>
    record.nombre_cliente.toLowerCase().includes(normalizedSearch)
  );
  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    background: "#0f1117",
    border: "1px solid #363a46",
    borderRadius: 6,
    padding: "9px 11px",
    color: "#e8eaf0",
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    color: "#8b909e",
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    marginBottom: 6,
  };
  const money = (value: number) => `L ${value.toFixed(2)}`;

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1050 }}>
      {confirmId !== null && (
        <ConfirmDialog
          title="Marcar como pagado"
          message="Al marcar esta galera como pagada se eliminará de la lista. ¿Continuar?"
          confirmLabel="Pagado"
          onConfirm={() => markPaid(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 700, color: "#e8eaf0", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>Galera</h1>
        <p style={{ color: "#8b909e", fontSize: 13, margin: "4px 0 0" }}>Varias cuentas abiertas; cada cliente tiene sus propios repuestos y total.</p>
        <button type="button" onClick={() => { setSearchOpen((open) => !open); if (searchOpen) setSearch(""); }} style={{ marginTop: 12, padding: "8px 14px", border: "1px solid #363a46", borderRadius: 6, background: searchOpen ? "#1c1f28" : "transparent", color: searchOpen ? "#f97316" : "#8b909e", cursor: "pointer", fontSize: 12 }}>
          {searchOpen ? "Cerrar búsqueda" : "Buscar cliente"}
        </button>
        <button type="button" onClick={togglePaidHistory} style={{ marginTop: 12, padding: "8px 14px", border: "1px solid #363a46", borderRadius: 6, background: showPaid ? "#1c1f28" : "transparent", color: showPaid ? "#f97316" : "#8b909e", cursor: "pointer", fontSize: 12 }}>
          {showPaid ? "Ver galeras pendientes" : "Ver galeras pagadas"}
        </button>
      </div>

      {!showPaid && <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 12, marginBottom: 20 }}>
        <form onSubmit={createGalera} style={{ background: "#16191f", border: "1px solid #252830", borderRadius: 10, padding: "18px 20px" }}>
          <div style={{ ...labelStyle, marginBottom: 14 }}>Nueva galera para otro cliente</div>
          <div style={{ display: "flex", gap: 10, alignItems: "end" }}>
            <div style={{ flex: 1 }}><label style={labelStyle}>Nombre del cliente</label><input style={inputStyle} value={clientName} placeholder="Ej. Juan Pérez" onChange={(event) => setClientName(event.target.value)} /></div>
            <button type="submit" style={{ padding: "9px 16px", border: "none", borderRadius: 6, background: "#f97316", color: "#fff", fontWeight: 600, cursor: "pointer" }}>+ Nueva galera</button>
          </div>
        </form>
        <div style={{ background: "#16191f", border: "1px solid #252830", borderLeft: "3px solid #f97316", borderRadius: 8, padding: "14px 16px" }}>
          <div style={{ color: "#f97316", fontFamily: "'JetBrains Mono', monospace", fontSize: 21 }}>{money(totalPending)}</div>
          <div style={{ color: "#8b909e", fontSize: 11, marginTop: 4 }}>Total pendiente de cobro</div>
        </div>
      </div>}

      {searchOpen && <div style={{ display: "flex", gap: 10, alignItems: "center", background: "#16191f", border: "1px solid #363a46", borderRadius: 8, padding: "0 12px", marginBottom: 20 }}>
        <span style={{ color: "#8b909e", fontSize: 16 }}>🔍</span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar galera por nombre del cliente..."
          style={{ ...inputStyle, border: "none", background: "transparent", paddingLeft: 0 }}
        />
        {search && <button type="button" onClick={() => setSearch("")} style={{ border: "none", background: "transparent", color: "#8b909e", cursor: "pointer", fontSize: 18 }}>×</button>}
      </div>}

      {!showPaid && (filteredRecords.length === 0 ? (
        <div style={{ background: "#16191f", border: "1px solid #252830", borderRadius: 10, padding: 48, textAlign: "center", color: "#8b909e", fontSize: 13 }}>No hay galeras pendientes.</div>
      ) : filteredRecords.map((record: GaleraRecord) => {
        const draft = drafts[record.id_galera] ?? emptyDraft();
        return (
          <section key={record.id_galera} style={{ background: "#16191f", border: "1px solid #252830", borderRadius: 10, marginBottom: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "#1c1f28", borderBottom: "1px solid #252830" }}>
              <div><div style={{ color: "#e8eaf0", fontWeight: 600, fontSize: 15 }}>{record.nombre_cliente}</div><div style={{ color: "#8b909e", fontSize: 11, marginTop: 3 }}>{record.items.length} repuesto{record.items.length !== 1 ? "s" : ""}</div></div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}><strong style={{ color: "#f97316", fontFamily: "'JetBrains Mono', monospace" }}>{money(Number(record.total_lps))}</strong><button type="button" onClick={() => setConfirmId(record.id_galera)} style={{ padding: "8px 13px", border: "1px solid rgba(34,197,94,0.35)", borderRadius: 6, background: "rgba(34,197,94,0.1)", color: "#22c55e", cursor: "pointer", fontWeight: 600 }}>Pagado</button></div>
            </div>
            <div style={{ padding: "4px 18px 14px" }}>
              {record.items.length === 0 && <div style={{ padding: "12px 0", color: "#8b909e", fontSize: 12 }}>Aún no hay repuestos en esta galera.</div>}
              {record.items.map((entry) => <div key={entry.id_item} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #1e2128", color: "#e8eaf0", fontSize: 13 }}><span>{entry.repuesto}</span><span style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ color: "#8b909e", fontFamily: "'JetBrains Mono', monospace" }}>{money(Number(entry.precio_lps))}</span><button type="button" onClick={() => deleteItem(entry.id_item)} style={{ border: "none", background: "transparent", color: "#ef4444", cursor: "pointer", fontSize: 12 }}>Quitar</button></span></div>)}
              <form onSubmit={(event) => addItem(record.id_galera, event)} style={{ display: "grid", gridTemplateColumns: "1fr 150px auto", gap: 10, marginTop: 12 }}>
                <input style={inputStyle} value={draft.repuesto} placeholder="Agregar repuesto a este cliente" onChange={(event) => updateDraft(record.id_galera, "repuesto", event.target.value)} />
                <input style={inputStyle} type="number" min="0" step="0.01" value={draft.precio_lps} placeholder="Precio en L" onChange={(event) => updateDraft(record.id_galera, "precio_lps", event.target.value)} />
                <button type="submit" style={{ padding: "9px 14px", border: "1px solid #363a46", borderRadius: 6, background: "transparent", color: "#e8eaf0", cursor: "pointer" }}>+ Agregar</button>
              </form>
            </div>
          </section>
        );
      }))}

      {showPaid && (
        <section style={{ marginTop: 28, background: "#16191f", border: "1px solid #252830", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", background: "#1c1f28", borderBottom: "1px solid #252830", color: "#e8eaf0", fontWeight: 600 }}>Historial de galeras pagadas</div>
          {filteredPaidRecords.length === 0 ? (
            <div style={{ padding: 28, color: "#8b909e", fontSize: 13 }}>Todavía no hay galeras pagadas.</div>
          ) : filteredPaidRecords.map((record) => (
            <div key={record.id_galera_pagada} style={{ padding: "14px 18px", borderBottom: "1px solid #1e2128" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <strong style={{ color: "#e8eaf0", fontSize: 13 }}>{record.nombre_cliente}</strong>
                <span style={{ color: "#22c55e", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>{money(Number(record.total_lps))}</span>
              </div>
              <div style={{ color: "#8b909e", fontSize: 12 }}>{record.items.map((item) => `${item.repuesto} (${money(Number(item.precio_lps))})`).join(" · ")}</div>
              <div style={{ color: "#4a4f5e", fontSize: 11, marginTop: 6 }}>Pagado: {record.pagado_en}</div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
