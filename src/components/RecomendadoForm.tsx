import { useState } from "react";
import { recomendadoDB } from "../lib/db";
import { PIECE_CATEGORIES } from "../lib/schema";
import type { Recomendado } from "../lib/schema";
import type { View } from "../App";

interface Props {
  recomendadoId?: number;
  navigate: (view: View, params?: Record<string, number>) => void;
  showToast: (message: string, type?: "success" | "error") => void;
}

function emptyForm(): Record<string, string | number | null> {
  const form: Record<string, string | number | null> = {
    marca: "",
    modelo: "",
    anio: null,
    cilindraje: "",
    tipo_motor: "",
    refrigeracion: "",
    sistema_combustible: "",
  };

  for (const category of PIECE_CATEGORIES) {
    for (const field of category.fields) {
      form[String(field.key)] = "";
      form[`posible_adaptacion_${String(field.key)}`] = "";
    }
  }

  return form;
}

export default function RecomendadoForm({ recomendadoId, navigate, showToast }: Props) {
  const existing = recomendadoId ? recomendadoDB.getById(recomendadoId) : undefined;
  const isEdit = Boolean(existing);
  const [form, setForm] = useState<Record<string, string | number | null>>(() => ({
    ...emptyForm(),
    ...(existing ?? {}),
  }));
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set(["motor"])
  );

  function setField(key: string, value: string | number | null) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleCategory(id: string) {
    setOpenCategories((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!String(form.marca ?? "").trim() || !String(form.modelo ?? "").trim()) {
      showToast("Marca y modelo son obligatorios", "error");
      return;
    }

    if (isEdit) {
      recomendadoDB.update(recomendadoId!, form as Partial<Omit<Recomendado, "id_recomendado">>);
      showToast("Recomendado actualizado");
      navigate("recomendado-detail", { recomendadoId: recomendadoId! });
    } else {
      const created = recomendadoDB.create(form as Omit<Recomendado, "id_recomendado">);
      showToast("Recomendado creado");
      navigate("recomendado-detail", { recomendadoId: created.id_recomendado });
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    background: "#0f1117",
    border: "1px solid #363a46",
    borderRadius: 5,
    padding: "7px 10px",
    color: "#e8eaf0",
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
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
    marginBottom: 5,
  };

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1100 }}>
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
          {isEdit ? "Editar recomendado" : "Nuevo recomendado"}
        </h1>
        <p style={{ color: "#8b909e", fontSize: 13, margin: "4px 0 0" }}>
          Define las piezas de referencia y sus posibles adaptaciones por modelo.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <section
          style={{
            background: "#16191f",
            border: "1px solid #252830",
            borderRadius: 10,
            padding: "20px 22px",
            marginBottom: 16,
          }}
        >
          <div style={{ ...labelStyle, marginBottom: 14 }}>Información del modelo</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 14,
            }}
          >
            {[
              ["marca", "Marca *", "Ej. Bajaj"],
              ["modelo", "Modelo *", "Ej. NS200"],
              ["anio", "Año", "Ej. 2022"],
              ["cilindraje", "Cilindraje", "Ej. 200cc"],
              ["tipo_motor", "Tipo de motor", "Ej. Monocilíndrico 4T"],
              ["refrigeracion", "Refrigeración", "Ej. Por aceite"],
              ["sistema_combustible", "Combustible", "Ej. Inyección"],
            ].map(([key, label, placeholder]) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input
                  style={inputStyle}
                  type={key === "anio" ? "number" : "text"}
                  value={form[key] ?? ""}
                  placeholder={placeholder}
                  min={key === "anio" ? 1980 : undefined}
                  max={key === "anio" ? 2030 : undefined}
                  onChange={(event) =>
                    setField(key, key === "anio" ? (event.target.value ? Number(event.target.value) : null) : event.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </section>

        <div style={{ marginBottom: 80 }}>
          <div style={{ ...labelStyle, padding: "0 2px", marginBottom: 10 }}>
            Piezas y adaptaciones
          </div>
          {PIECE_CATEGORIES.map((category) => {
            const isOpen = openCategories.has(category.id);
            const filled = category.fields.filter((field) => String(form[String(field.key)] ?? "").trim()).length;
            return (
              <section
                key={category.id}
                style={{
                  border: "1px solid #252830",
                  borderRadius: 8,
                  overflow: "hidden",
                  marginBottom: 6,
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    background: isOpen ? "#1c1f28" : "#16191f",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "#e8eaf0",
                  }}
                >
                  <span style={{ ...labelStyle, flex: 1, margin: 0 }}>{category.label}</span>
                  <span style={{ color: filled ? "#22c55e" : "#8b909e", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                    {filled}/{category.fields.length}
                  </span>
                  <span style={{ color: "#8b909e", transform: isOpen ? "rotate(180deg)" : undefined }}>▾</span>
                </button>

                {isOpen && (
                  <div style={{ background: "#16191f", borderTop: "1px solid #252830" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 1fr", gap: 12, padding: "8px 16px", background: "#1c1f28" }}>
                      <span style={labelStyle}>Pieza</span>
                      <span style={labelStyle}>Recomendada</span>
                      <span style={labelStyle}>Posible adaptación</span>
                    </div>
                    {category.fields.map((field) => {
                      const key = String(field.key);
                      const adaptationKey = `posible_adaptacion_${key}`;
                      return (
                        <div key={key} style={{ display: "grid", gridTemplateColumns: "220px 1fr 1fr", alignItems: "center", gap: 12, padding: "7px 16px", borderBottom: "1px solid #1e2128" }}>
                          <label style={{ color: "#8b909e", fontSize: 12 }}>{field.label}</label>
                          <input style={inputStyle} value={String(form[key] ?? "")} placeholder="—" onChange={(event) => setField(key, event.target.value)} />
                          <input style={{ ...inputStyle, color: "#f97316" }} value={String(form[adaptationKey] ?? "")} placeholder="—" onChange={(event) => setField(adaptationKey, event.target.value)} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10, position: "sticky", bottom: 16, background: "#0f1117", padding: "14px 0", borderTop: "1px solid #252830" }}>
          <button type="submit" style={{ padding: "11px 24px", borderRadius: 7, border: "none", background: "#f97316", color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {isEdit ? "Guardar cambios" : "Guardar recomendado"}
          </button>
          <button type="button" onClick={() => navigate(isEdit ? "recomendado-detail" : "recomendados", isEdit ? { recomendadoId: recomendadoId! } : {})} style={{ padding: "11px 18px", borderRadius: 7, border: "1px solid #363a46", background: "transparent", color: "#8b909e", fontFamily: "'Inter', sans-serif", fontSize: 13, cursor: "pointer" }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
