import { useState } from "react";
import { galeraDB, type Galera as GaleraRecord } from "../lib/db";
import ConfirmDialog from "./ConfirmDialog";

interface Props {
  showToast: (message: string, type?: "success" | "error") => void;
}

const emptyItem = { repuesto: "", precio_lps: "" };

export default function Galera({ showToast }: Props) {
  const [records, setRecords] = useState(() => galeraDB.getAll());
  const [clientName, setClientName] = useState("");
  const [item, setItem] = useState(emptyItem);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  function refresh() {
    setRecords(galeraDB.getAll());
  }

  function createGalera(event: React.FormEvent) {
    event.preventDefault();
    if (!clientName.trim()) {
      showToast("Escribe el nombre del cliente", "error");
      return;
    }
    const record = galeraDB.create({ nombre_cliente: clientName.trim() });
    setClientName("");
    addItem(record.id_galera);
  }

  function addItem(id: number) {
    const price = Number(item.precio_lps);
    if (!item.repuesto.trim() || !Number.isFinite(price) || price < 0) {
      showToast("Escribe el repuesto y un precio válido", "error");
      return;
    }
    galeraDB.addItem(id, { repuesto: item.repuesto.trim(), precio_lps: price });
    setItem(emptyItem);
    refresh();
    showToast("Repuesto agregado");
  }

  function addToExisting(record: GaleraRecord, event: React.FormEvent) {
    event.preventDefault();
    addItem(record.id_galera);
  }

  function markPaid(id: number) {
    galeraDB.delete(id);
    showToast("Galera pagada y eliminada");
    refresh();
  }

  function deleteItem(id: number) {
    galeraDB.deleteItem(id);
    refresh();
    showToast("Repuesto eliminado");
  }

  const totalPending = records.reduce((sum, record) => sum + Number(record.total_lps), 0);
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
          onConfirm={() => { markPaid(confirmId); setConfirmId(null); }}
          onCancel={() => setConfirmId(null)}
        />
      )}

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 700, color: "#e8eaf0", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>Galera</h1>
        <p style={{ color: "#8b909e", fontSize: 13, margin: "4px 0 0" }}>Repuestos retirados por clientes pendientes de pago.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 12, marginBottom: 20 }}>
        <form onSubmit={createGalera} style={{ background: "#16191f", border: "1px solid #252830", borderRadius: 10, padding: "18px 20px" }}>
          <div style={{ ...labelStyle, marginBottom: 14 }}>Nueva galera</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, alignItems: "end" }}>
            <div><label style={labelStyle}>Nombre del cliente</label><input style={inputStyle} value={clientName} placeholder="Ej. Juan Pérez" onChange={(event) => setClientName(event.target.value)} /></div>
            <div><label style={labelStyle}>Primer repuesto</label><input style={inputStyle} value={item.repuesto} placeholder="Ej. Kit de clutch" onChange={(event) => setItem((current) => ({ ...current, repuesto: event.target.value }))} /></div>
            <div><label style={labelStyle}>Precio L</label><input style={{ ...inputStyle, width: 130 }} type="number" min="0" step="0.01" value={item.precio_lps} placeholder="0.00" onChange={(event) => setItem((current) => ({ ...current, precio_lps: event.target.value }))} /></div>
            <button type="submit" style={{ padding: "9px 16px", border: "none", borderRadius: 6, background: "#f97316", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Crear galera</button>
          </div>
        </form>
        <div style={{ background: "#16191f", border: "1px solid #252830", borderLeft: "3px solid #f97316", borderRadius: 8, padding: "14px 16px" }}>
          <div style={{ color: "#f97316", fontFamily: "'JetBrains Mono', monospace", fontSize: 21 }}>{money(totalPending)}</div>
          <div style={{ color: "#8b909e", fontSize: 11, marginTop: 4 }}>Total pendiente de cobro</div>
        </div>
      </div>

      {records.length === 0 ? (
        <div style={{ background: "#16191f", border: "1px solid #252830", borderRadius: 10, padding: 48, textAlign: "center", color: "#8b909e", fontSize: 13 }}>No hay galeras pendientes.</div>
      ) : records.map((record) => (
        <section key={record.id_galera} style={{ background: "#16191f", border: "1px solid #252830", borderRadius: 10, marginBottom: 12, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "#1c1f28", borderBottom: "1px solid #252830" }}>
            <div><div style={{ color: "#e8eaf0", fontWeight: 600, fontSize: 15 }}>{record.nombre_cliente}</div><div style={{ color: "#8b909e", fontSize: 11, marginTop: 3 }}>{record.items.length} repuesto{record.items.length !== 1 ? "s" : ""}</div></div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}><strong style={{ color: "#f97316", fontFamily: "'JetBrains Mono', monospace" }}>{money(Number(record.total_lps))}</strong><button type="button" onClick={() => setConfirmId(record.id_galera)} style={{ padding: "8px 13px", border: "1px solid rgba(34,197,94,0.35)", borderRadius: 6, background: "rgba(34,197,94,0.1)", color: "#22c55e", cursor: "pointer", fontWeight: 600 }}>Pagado</button></div>
          </div>
          <div style={{ padding: "4px 18px 14px" }}>
            {record.items.map((entry) => <div key={entry.id_item} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #1e2128", color: "#e8eaf0", fontSize: 13 }}><span>{entry.repuesto}</span><span style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ color: "#8b909e", fontFamily: "'JetBrains Mono', monospace" }}>{money(Number(entry.precio_lps))}</span><button type="button" onClick={() => deleteItem(entry.id_item)} style={{ border: "none", background: "transparent", color: "#ef4444", cursor: "pointer", fontSize: 12 }}>Quitar</button></span></div>)}
            <form onSubmit={(event) => addToExisting(record, event)} style={{ display: "grid", gridTemplateColumns: "1fr 150px auto", gap: 10, marginTop: 12 }}>
              <input style={inputStyle} value={item.repuesto} placeholder="Agregar otro repuesto" onChange={(event) => setItem((current) => ({ ...current, repuesto: event.target.value }))} />
              <input style={inputStyle} type="number" min="0" step="0.01" value={item.precio_lps} placeholder="Precio en L" onChange={(event) => setItem((current) => ({ ...current, precio_lps: event.target.value }))} />
              <button type="submit" style={{ padding: "9px 14px", border: "1px solid #363a46", borderRadius: 6, background: "transparent", color: "#e8eaf0", cursor: "pointer" }}>+ Agregar</button>
            </form>
          </div>
        </section>
      ))}
    </div>
  );
}
