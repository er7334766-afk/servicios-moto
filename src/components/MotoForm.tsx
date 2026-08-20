import { useState } from "react";
import { motosDB, clientesDB } from "../lib/db";
import { PIECE_CATEGORIES, emptyMoto } from "../lib/schema";
import type { Moto } from "../lib/schema";
import PieceAccordion from "./PieceAccordion";
import type { View } from "../App";

interface Props {
  motoId?: number;
  preClienteId?: number;
  navigate: (v: View, params?: Record<string, number>) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function MotoForm({ motoId, preClienteId, navigate, showToast }: Props) {
  const existing = motoId ? motosDB.getById(motoId) : undefined;
  const isEdit = !!existing;

  const [form, setForm] = useState<Omit<Moto, "id_moto">>(() => {
    if (existing) {
      const { id_moto, ...rest } = existing;
      void id_moto;
      return rest;
    }
    const base = emptyMoto();
    if (preClienteId) base.id_cliente = preClienteId;
    return base;
  });

  const clientes = clientesDB.getAll();

  function setField(key: string, value: string | number | null) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.marca.trim() || !form.modelo.trim()) {
      showToast("Marca y modelo son obligatorios", "error");
      return;
    }
    if (isEdit) {
      motosDB.update(motoId!, form);
      showToast("Motocicleta actualizada");
      navigate("moto-detail", { motoId: motoId! });
    } else {
      const nueva = motosDB.create(form);
      showToast("Motocicleta registrada");
      navigate("moto-detail", { motoId: nueva.id_moto });
    }
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: "#8b909e",
    marginBottom: 5,
    fontFamily: "'Barlow Condensed', sans-serif",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#0f1117",
    border: "1px solid #363a46",
    borderRadius: 6,
    padding: "9px 12px",
    color: "#e8eaf0",
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ padding: "32px 36px", maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 28,
            fontWeight: 700,
            color: "#e8eaf0",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            margin: 0,
          }}
        >
          {isEdit ? "Editar motocicleta" : "Nueva motocicleta"}
        </h1>
        <p style={{ color: "#8b909e", fontSize: 13, margin: "4px 0 0" }}>
          {isEdit
            ? "Modifica la información de la moto y sus piezas"
            : "Registra la información básica y las piezas de la moto"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Info base */}
        <div
          style={{
            background: "#16191f",
            border: "1px solid #252830",
            borderRadius: 10,
            padding: "20px 22px",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#8b909e",
              marginBottom: 16,
            }}
          >
            Información general
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 14,
              marginBottom: 14,
            }}
          >
            <div>
              <label style={labelStyle}>Marca *</label>
              <input
                style={inputStyle}
                value={form.marca}
                onChange={(e) => setField("marca", e.target.value)}
                placeholder="Ej. Bajaj"
                required
                onFocus={(e) => (e.currentTarget.style.borderColor = "#f97316")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#363a46")}
              />
            </div>
            <div>
              <label style={labelStyle}>Modelo *</label>
              <input
                style={inputStyle}
                value={form.modelo}
                onChange={(e) => setField("modelo", e.target.value)}
                placeholder="Ej. NS200"
                required
                onFocus={(e) => (e.currentTarget.style.borderColor = "#f97316")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#363a46")}
              />
            </div>
            <div>
              <label style={labelStyle}>Año</label>
              <input
                style={inputStyle}
                type="number"
                value={form.anio ?? ""}
                onChange={(e) =>
                  setField("anio", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="Ej. 2022"
                min={1980}
                max={2030}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#f97316")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#363a46")}
              />
            </div>
            <div>
              <label style={labelStyle}>Cilindraje</label>
              <input
                style={inputStyle}
                value={form.cilindraje}
                onChange={(e) => setField("cilindraje", e.target.value)}
                placeholder="Ej. 200cc"
                onFocus={(e) => (e.currentTarget.style.borderColor = "#f97316")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#363a46")}
              />
            </div>
            <div>
              <label style={labelStyle}>Tipo de motor</label>
              <input
                style={inputStyle}
                value={form.tipo_motor}
                onChange={(e) => setField("tipo_motor", e.target.value)}
                placeholder="Ej. Monocilíndrico 4T"
                onFocus={(e) => (e.currentTarget.style.borderColor = "#f97316")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#363a46")}
              />
            </div>
            <div>
              <label style={labelStyle}>Refrigeración</label>
              <input
                style={inputStyle}
                value={form.refrigeracion}
                onChange={(e) => setField("refrigeracion", e.target.value)}
                placeholder="Ej. Por aire / Por agua"
                onFocus={(e) => (e.currentTarget.style.borderColor = "#f97316")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#363a46")}
              />
            </div>
            <div>
              <label style={labelStyle}>Sistema de combustible</label>
              <input
                style={inputStyle}
                value={form.sistema_combustible}
                onChange={(e) => setField("sistema_combustible", e.target.value)}
                placeholder="Ej. Carburador / Inyección"
                onFocus={(e) => (e.currentTarget.style.borderColor = "#f97316")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#363a46")}
              />
            </div>
            <div>
              <label style={labelStyle}>Cliente asociado</label>
              <select
                style={{
                  ...inputStyle,
                  appearance: "none",
                  cursor: "pointer",
                }}
                value={form.id_cliente ?? ""}
                onChange={(e) =>
                  setField("id_cliente", e.target.value ? Number(e.target.value) : null)
                }
                onFocus={(e) => (e.currentTarget.style.borderColor = "#f97316")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#363a46")}
              >
                <option value="">Sin cliente asignado</option>
                {clientes.map((c) => (
                  <option key={c.id_cliente} value={c.id_cliente}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Piezas */}
        <div
          style={{
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#8b909e",
              marginBottom: 10,
              padding: "0 2px",
            }}
          >
            Piezas y componentes
            <span
              style={{
                fontSize: 11,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                color: "#4a4f5e",
                textTransform: "none",
                letterSpacing: 0,
                marginLeft: 8,
              }}
            >
              — Todos los campos son opcionales
            </span>
          </div>

          {PIECE_CATEGORIES.map((cat) => (
            <PieceAccordion
              key={cat.id}
              category={cat}
              moto={form as Moto}
              readOnly={false}
              onChange={(key, value) => setField(key, value)}
            />
          ))}
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: 10,
            position: "sticky",
            bottom: 16,
            background: "#0f1117",
            padding: "14px 0",
            borderTop: "1px solid #252830",
          }}
        >
          <button
            type="submit"
            style={{
              padding: "11px 24px",
              borderRadius: 7,
              border: "none",
              background: "#f97316",
              color: "#fff",
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {isEdit ? "Guardar cambios" : "Guardar motocicleta"}
          </button>
          <button
            type="button"
            onClick={() =>
              navigate(isEdit ? "moto-detail" : "motos-list", isEdit ? { motoId: motoId! } : {})
            }
            style={{
              padding: "11px 18px",
              borderRadius: 7,
              border: "1px solid #363a46",
              background: "transparent",
              color: "#8b909e",
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
