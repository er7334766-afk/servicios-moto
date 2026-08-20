import { useState } from "react";
import { motosDB, clientesDB } from "../lib/db";
import { PIECE_CATEGORIES, motoCompletitud, categoryCompletitud } from "../lib/schema";
import PieceAccordion from "./PieceAccordion";
import ConfirmDialog from "./ConfirmDialog";
import type { View } from "../App";

interface Props {
  motoId: number;
  navigate: (v: View, params?: Record<string, number>) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function MotoDetail({ motoId, navigate, showToast }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  const moto = motosDB.getById(motoId);
  if (!moto) {
    return (
      <div style={{ padding: 40, color: "#8b909e" }}>Motocicleta no encontrada.</div>
    );
  }

  const cliente = moto.id_cliente ? clientesDB.getById(moto.id_cliente) : null;
  const { filled, total } = motoCompletitud(moto);
  const pct = Math.round((filled / total) * 100);

  function handleDelete() {
    motosDB.delete(motoId);
    showToast("Motocicleta eliminada");
    navigate("motos-list");
  }

  return (
    <div style={{ padding: "32px 36px", maxWidth: 900 }}>
      {showConfirm && (
        <ConfirmDialog
          title="Eliminar motocicleta"
          message={`¿Eliminar ${moto.marca} ${moto.modelo}? Esta acción no se puede deshacer.`}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Breadcrumb */}
      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
        <button
          onClick={() => navigate("motos-list")}
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
          Motocicletas
        </button>
        <span style={{ color: "#4a4f5e", fontSize: 12 }}>›</span>
        <span style={{ color: "#e8eaf0", fontSize: 12 }}>
          {moto.marca} {moto.modelo}
        </span>
      </div>

      {/* Header card */}
      <div
        style={{
          background: "#16191f",
          border: "1px solid #252830",
          borderRadius: 10,
          padding: "22px 24px",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: "50%",
                background: "rgba(59,130,246,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              🏍
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#e8eaf0",
                  margin: 0,
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                }}
              >
                {moto.marca} {moto.modelo}
              </h2>
              <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                {[
                  moto.anio,
                  moto.cilindraje,
                  moto.tipo_motor,
                  moto.refrigeracion,
                  moto.sistema_combustible,
                ]
                  .filter(Boolean)
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
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => navigate("moto-edit", { motoId })}
              style={{
                padding: "7px 14px",
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
                padding: "7px 14px",
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

        {/* Cliente link */}
        {cliente && (
          <div
            style={{
              padding: "8px 12px",
              background: "#1e2128",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
              width: "fit-content",
            }}
          >
            <span style={{ color: "#8b909e", fontSize: 12 }}>Propietario:</span>
            <button
              onClick={() =>
                navigate("cliente-detail", { clienteId: cliente.id_cliente })
              }
              style={{
                background: "none",
                border: "none",
                color: "#f97316",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                padding: 0,
              }}
            >
              {cliente.nombre}
            </button>
            <span
              style={{
                fontSize: 11,
                color: "#4a4f5e",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {cliente.telefono}
            </span>
          </div>
        )}

        {/* Global progress */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: "#8b909e",
              marginBottom: 5,
            }}
          >
            <span>Información registrada</span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: pct >= 80 ? "#22c55e" : pct >= 40 ? "#f97316" : "#8b909e",
              }}
            >
              {filled}/{total} piezas · {pct}%
            </span>
          </div>
          <div
            style={{
              height: 7,
              background: "#252830",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background: pct >= 80 ? "#22c55e" : "#f97316",
                borderRadius: 4,
              }}
            />
          </div>
        </div>
      </div>

      {/* Category summary chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 14,
        }}
      >
        {PIECE_CATEGORIES.map((cat) => {
          const c = categoryCompletitud(moto, cat);
          const cp = Math.round((c.filled / c.total) * 100);
          return (
            <span
              key={cat.id}
              style={{
                fontSize: 10,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                padding: "3px 10px",
                borderRadius: 4,
                color: cp > 0 ? "#e8eaf0" : "#4a4f5e",
                background: cp > 0 ? "rgba(249,115,22,0.1)" : "#1e2128",
                border: `1px solid ${cp > 0 ? "rgba(249,115,22,0.2)" : "#252830"}`,
              }}
            >
              {cat.label} {c.filled}/{c.total}
            </span>
          );
        })}
      </div>

      {/* Accordions read-only */}
      {PIECE_CATEGORIES.map((cat) => (
        <PieceAccordion
          key={cat.id}
          category={cat}
          moto={moto}
          readOnly={true}
          defaultOpen={false}
        />
      ))}
    </div>
  );
}
