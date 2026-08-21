import { useState } from "react";
import { galeraDB, type Galera as GaleraRecord } from "../lib/db";
import ConfirmDialog from "./ConfirmDialog";

interface Props {
  showToast: (message: string, type?: "success" | "error") => void;
}

const emptyForm = {
  nombre_cliente: "",
  repuestos: "",
  total_lps: "",
  trabajo_terminado: false,
};

export default function Galera({ showToast }: Props) {
  const [records, setRecords] = useState(() => galeraDB.getAll());
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  function refresh() {
    setRecords(galeraDB.getAll());
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const total = Number(form.total_lps);
    if (!form.nombre_cliente.trim() || !form.repuestos.trim()) {
      showToast("Nombre del cliente y repuestos son obligatorios", "error");
      return;
    }
    if (!Number.isFinite(total) || total < 0) {
      showToast("El total debe ser un monto válido en lempiras", "error");
      return;
    }

    const data = {
      nombre_cliente: form.nombre_cliente.trim(),
      repuestos: form.repuestos.trim(),
      total_lps: total,
      trabajo_terminado: form.trabajo_terminado ? 1 : 0,
    };

    if (editingId === null) {
      galeraDB.create(data);
      showToast("Galera registrada");
    } else {
      galeraDB.update(editingId, data);
      showToast("Galera actualizada");
    }

    setForm(emptyForm);
    setEditingId(null);
    refresh();
  }

  function startEdit(record: GaleraRecord) {
    setEditingId(record.id_galera);
    setForm({
      nombre_cliente: record.nombre_cliente,
      repuestos: record.repuestos,
      total_lps: String(record.total_lps),
      trabajo_terminado: Boolean(record.trabajo_terminado),
    });
  }

  function toggleFinished(record: GaleraRecord) {
    galeraDB.update(record.id_galera, {
      trabajo_terminado: record.trabajo_terminado ? 0 : 1,
    });
    refresh();
  }

  function handleDelete() {
    if (confirmId === null) return;
    galeraDB.delete(confirmId);
    setConfirmId(null);
    showToast("Galera eliminada");
    refresh();
  }

  const totalPendiente = records
    .filter((record) => !record.trabajo_terminado)
    .reduce((sum, record) => sum + Number(record.total_lps), 0);
  const totalGeneral = records.reduce((sum, record) => sum + Number(record.total_lps), 0);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    background: "#0f1117",
    border: "1px solid #363a46",
    borderRadius: 6,
    padding: "10px 12px",
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
    <div style={{ padding: "32px 36px", maxWidth: 1100 }}>
      {confirmId !== null && (
        <ConfirmDialog
          title="Eliminar galera"
          message="¿Eliminar este registro de galera? Esta acción no se puede deshacer."
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 700, color: "#e8eaf0", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
          Galera
        </h1>
        <p style={{ color: "#8b909e", fontSize: 13, margin: "4px 0 0" }}>
          Repuestos retirados que el cliente paga al terminar el trabajo.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          ["Pendiente de cobro", money(totalPendiente), "#f97316"],
          ["Total registrado", money(totalGeneral), "#3b82f6"],
          ["Trabajos abiertos", String(records.filter((record) => !record.trabajo_terminado).length), "#eab308"],
        ].map(([label, value, color]) => (
          <div key={label} style={{ background: "#16191f", border: "1px solid #252830", borderLeft: `3px solid ${color}`, borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ color, fontFamily: "'JetBrains Mono', monospace", fontSize: 20 }}>{value}</div>
            <div style={{ color: "#8b909e", fontSize: 11, marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ background: "#16191f", border: "1px solid #252830", borderRadius: 10, padding: "20px 22px", marginBottom: 20 }}>
        <div style={{ ...labelStyle, marginBottom: 14 }}>{editingId === null ? "Nueva galera" : "Editar galera"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr 180px", gap: 14, alignItems: "end" }}>
          <div>
            <label style={labelStyle}>Nombre del cliente *</label>
            <input style={inputStyle} value={form.nombre_cliente} placeholder="Ej. Juan Pérez" onChange={(event) => setForm((current) => ({ ...current, nombre_cliente: event.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Repuestos que ha sacado *</label>
            <textarea style={{ ...inputStyle, minHeight: 42, resize: "vertical" }} value={form.repuestos} placeholder="Ej. Kit de clutch, aceite, pastillas de freno" onChange={(event) => setForm((current) => ({ ...current, repuestos: event.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Total en lempiras *</label>
            <input style={inputStyle} type="number" min="0" step="0.01" value={form.total_lps} placeholder="0.00" onChange={(event) => setForm((current) => ({ ...current, total_lps: event.target.value }))} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
          <input id="galera-finished" type="checkbox" checked={form.trabajo_terminado} onChange={(event) => setForm((current) => ({ ...current, trabajo_terminado: event.target.checked }))} />
          <label htmlFor="galera-finished" style={{ color: "#e8eaf0", fontSize: 13 }}>Trabajo terminado / listo para cobrar</label>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button type="submit" style={{ padding: "9px 18px", border: "none", borderRadius: 6, background: "#f97316", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
            {editingId === null ? "Agregar a galera" : "Guardar cambios"}
          </button>
          {editingId !== null && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} style={{ padding: "9px 18px", border: "1px solid #363a46", borderRadius: 6, background: "transparent", color: "#8b909e", cursor: "pointer" }}>Cancelar</button>}
        </div>
      </form>

      <div style={{ background: "#16191f", border: "1px solid #252830", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1c1f28", borderBottom: "1px solid #252830" }}>
              {[
                "Cliente",
                "Repuestos retirados",
                "Total",
                "Trabajo",
                "Acciones",
              ].map((heading) => <th key={heading} style={{ padding: "10px 16px", textAlign: heading === "Acciones" ? "right" : "left", color: "#8b909e", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>{heading}</th>)}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#8b909e", fontSize: 13 }}>No hay registros en galera</td></tr>
            ) : records.map((record) => (
              <tr key={record.id_galera} style={{ borderBottom: "1px solid #1e2128" }}>
                <td style={{ padding: "12px 16px", color: "#e8eaf0", fontSize: 13, fontWeight: 600 }}>{record.nombre_cliente}</td>
                <td style={{ padding: "12px 16px", color: "#8b909e", fontSize: 12, whiteSpace: "pre-wrap" }}>{record.repuestos}</td>
                <td style={{ padding: "12px 16px", color: "#f97316", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>{money(Number(record.total_lps))}</td>
                <td style={{ padding: "12px 16px" }}>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: 7, color: record.trabajo_terminado ? "#22c55e" : "#eab308", fontSize: 12, cursor: "pointer" }}>
                    <input type="checkbox" checked={Boolean(record.trabajo_terminado)} onChange={() => toggleFinished(record)} />
                    {record.trabajo_terminado ? "Terminado" : "Pendiente"}
                  </label>
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right", whiteSpace: "nowrap" }}>
                  <button type="button" onClick={() => startEdit(record)} style={{ marginRight: 8, border: "none", background: "transparent", color: "#3b82f6", cursor: "pointer", fontSize: 12 }}>Editar</button>
                  <button type="button" onClick={() => setConfirmId(record.id_galera)} style={{ border: "none", background: "transparent", color: "#ef4444", cursor: "pointer", fontSize: 12 }}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
