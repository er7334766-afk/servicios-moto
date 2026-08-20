import { useState } from "react";
import { recomendadoDB } from "../lib/db";
import { PIECE_CATEGORIES } from "../lib/schema";
import type { Recomendado } from "../lib/schema";
import type { View } from "../App";
import ConfirmDialog from "./ConfirmDialog";

interface Props {
  recomendadoId: number;
  navigate: (v: View, params?: Record<string, number>) => void;
  showToast: (message: string, type?: "success" | "error") => void;
}

export default function RecomendadoDetail({ recomendadoId, navigate, showToast }: Props) {
  const [openCats, setOpenCats] = useState<Set<string>>(new Set(["motor"]));
  const [showConfirm, setShowConfirm] = useState(false);

  const rec = recomendadoDB.getById(recomendadoId);
  if (!rec) {
    return (
      <div style={{ padding: 40, color: "#8b909e" }}>
        Modelo no encontrado en el catálogo.
      </div>
    );
  }

  function handleDelete() {
    recomendadoDB.delete(recomendadoId);
    showToast("Recomendado eliminado");
    navigate("recomendados");
  }

  function toggleCat(id: string) {
    setOpenCats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div style={{ padding: "32px 36px", maxWidth: 900 }}>
      {showConfirm && (
        <ConfirmDialog
          title="Eliminar recomendado"
          message={`¿Eliminar ${rec.marca} ${rec.modelo}? Esta acción no se puede deshacer.`}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Breadcrumb */}
      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
        <button
          onClick={() => navigate("recomendados")}
          style={{
            background: "none",
            border: "none",
            color: "#8b909e",
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "'Inter', sans-serif",
            padding: 0,
          }}
        >
          Recomendados
        </button>
        <span style={{ color: "#4a4f5e", fontSize: 12 }}>›</span>
        <span style={{ color: "#e8eaf0", fontSize: 12 }}>
          {rec.marca} {rec.modelo}
        </span>
      </div>

      {/* Header */}
      <div
        style={{
          background: "#16191f",
          border: "1px solid #252830",
          borderLeft: "3px solid #f97316",
          borderRadius: 10,
          padding: "20px 24px",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: 24 }}>⭐</span>
          <div>
            <h2
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 26,
                fontWeight: 700,
                color: "#e8eaf0",
                margin: 0,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Recomendaciones para {rec.marca} {rec.modelo}
            </h2>
            <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
              {[rec.cilindraje, rec.tipo_motor, rec.refrigeracion, rec.sistema_combustible]
                .filter((v) => v && String(v).trim())
                .map((v, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 11,
                      fontFamily: "'JetBrains Mono', monospace",
                      color: "#8b909e",
                      background: "#1e2128",
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {v}
                  </span>
                ))}
            </div>
          </div>
          <button
            onClick={() => navigate("recomendado-edit", { recomendadoId })}
            style={{
              marginLeft: "auto",
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              background: "#f97316",
              color: "#fff",
              fontSize: 12,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Editar
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid rgba(239,68,68,0.3)",
              background: "rgba(239,68,68,0.08)",
              color: "#ef4444",
              fontSize: 12,
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
            }}
          >
            Eliminar
          </button>
        </div>
      </div>

      {/* Categories */}
      {PIECE_CATEGORIES.map((cat) => {
        const visibleFields = cat.fields.filter((field) => {
          const val = rec[String(field.key)];
          return val && String(val).trim() && String(val).trim() !== "—";
        });

        if (visibleFields.length === 0) return null;

        const isOpen = openCats.has(cat.id);

        return (
          <div
            key={cat.id}
            style={{
              border: "1px solid #252830",
              borderRadius: 8,
              overflow: "hidden",
              marginBottom: 6,
            }}
          >
            <button
              onClick={() => toggleCat(cat.id)}
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
              <span
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  flex: 1,
                }}
              >
                {cat.label}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: "#22c55e",
                  background: "rgba(34,197,94,0.08)",
                  padding: "2px 8px",
                  borderRadius: 4,
                }}
              >
                {visibleFields.length} pieza{visibleFields.length !== 1 ? "s" : ""}
              </span>
              <span
                style={{
                  color: "#8b909e",
                  fontSize: 14,
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                  display: "inline-block",
                }}
              >
                ▾
              </span>
            </button>

            {isOpen && (
              <div
                style={{
                  background: "#16191f",
                  borderTop: "1px solid #252830",
                  overflow: "hidden",
                }}
              >
                {/* Table header */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "200px 1fr 1fr",
                    gap: 0,
                    background: "#1c1f28",
                    borderBottom: "1px solid #252830",
                    padding: "6px 16px",
                  }}
                >
                  {["Pieza", "Pieza recomendada", "Posible adaptación"].map((h) => (
                    <span
                      key={h}
                      style={{
                        fontSize: 10,
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#8b909e",
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>
                {visibleFields.map((field, i) => {
                  const val = String(rec[String(field.key)] ?? "");
                  const adaptKey = `posible_adaptacion_${String(field.key)}`;
                  const adapt = String((rec as Recomendado)[adaptKey] ?? "");
                  const hasAdapt = adapt && adapt.trim() && adapt.trim() !== "—";
                  return (
                    <div
                      key={String(field.key)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "200px 1fr 1fr",
                        gap: 0,
                        padding: "8px 16px",
                        borderBottom:
                          i < visibleFields.length - 1
                            ? "1px solid #1e2128"
                            : "none",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: "#8b909e",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {field.label}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontFamily: "'JetBrains Mono', monospace",
                          color: "#e8eaf0",
                        }}
                      >
                        {val || <span style={{ color: "#4a4f5e", fontStyle: "italic" }}>Sin información</span>}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontFamily: hasAdapt ? "'JetBrains Mono', monospace" : "'Inter', sans-serif",
                          color: hasAdapt ? "#f97316" : "#4a4f5e",
                          fontStyle: hasAdapt ? "normal" : "italic",
                        }}
                      >
                        {hasAdapt ? adapt : "Sin adaptación conocida"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
