import { useState } from "react";
import { clientesDB, motosDB } from "../lib/db";
import { motoCompletitud } from "../lib/schema";
import ConfirmDialog from "./ConfirmDialog";
import type { View } from "../App";

interface Props {
  clienteId: number;
  navigate: (v: View, params?: Record<string, number>) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function ClienteDetail({ clienteId, navigate, showToast }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  const cliente = clientesDB.getById(clienteId);
  if (!cliente) {
    return (
      <div style={{ padding: 40, color: "#8b909e" }}>Cliente no encontrado.</div>
    );
  }

  const moto = motosDB.getByClienteId(clienteId);
  const comp = moto ? motoCompletitud(moto) : null;

  function handleDelete() {
    clientesDB.delete(clienteId);
    showToast("Cliente eliminado");
    navigate("clientes-list");
  }

  return (
    <div style={{ padding: "32px 36px", maxWidth: 720 }}>
      {showConfirm && (
        <ConfirmDialog
          title="Eliminar cliente"
          message={`¿Eliminar a ${cliente.nombre}? La moto asociada quedará sin propietario.`}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Breadcrumb */}
      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
        <button
          onClick={() => navigate("clientes-list")}
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
          Clientes
        </button>
        <span style={{ color: "#4a4f5e", fontSize: 12 }}>›</span>
        <span style={{ color: "#e8eaf0", fontSize: 12 }}>{cliente.nombre}</span>
      </div>

      {/* Cliente card */}
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
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "rgba(249,115,22,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                border: "1px solid rgba(249,115,22,0.2)",
              }}
            >
              👤
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#e8eaf0",
                  margin: 0,
                  letterSpacing: "0.03em",
                }}
              >
                {cliente.nombre}
              </h2>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  color: "#8b909e",
                  marginTop: 3,
                }}
              >
                {cliente.telefono || "Sin teléfono"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => navigate("cliente-edit", { clienteId })}
              style={{
                padding: "7px 14px",
                borderRadius: 6,
                border: "1px solid #363a46",
                background: "transparent",
                color: "#e8eaf0",
                fontSize: 12,
                fontFamily: "'Inter', sans-serif",
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

        {/* ID tag */}
        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <span
            style={{
              fontSize: 10,
              fontFamily: "'JetBrains Mono', monospace",
              color: "#4a4f5e",
              background: "#1e2128",
              padding: "2px 8px",
              borderRadius: 4,
            }}
          >
            ID #{cliente.id_cliente}
          </span>
        </div>
      </div>

      {/* Moto section */}
      <div
        style={{
          background: "#16191f",
          border: "1px solid #252830",
          borderRadius: 10,
          padding: "20px 24px",
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
            marginBottom: 14,
          }}
        >
          Motocicleta
        </div>

        {moto ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "rgba(59,130,246,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  border: "1px solid rgba(59,130,246,0.2)",
                }}
              >
                🏍
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#e8eaf0",
                    letterSpacing: "0.03em",
                  }}
                >
                  {moto.marca} {moto.modelo}
                </div>
                <div style={{ fontSize: 12, color: "#8b909e", marginTop: 2 }}>
                  {[moto.anio, moto.cilindraje, moto.tipo_motor]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              </div>
            </div>

            {comp && (
              <div style={{ marginBottom: 16 }}>
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
                      color: "#22c55e",
                    }}
                  >
                    {comp.filled}/{comp.total} piezas
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "#252830",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.round((comp.filled / comp.total) * 100)}%`,
                      height: "100%",
                      background:
                        comp.filled === comp.total ? "#22c55e" : "#f97316",
                      borderRadius: 3,
                    }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => navigate("moto-detail", { motoId: moto.id_moto })}
                style={{
                  padding: "9px 18px",
                  borderRadius: 6,
                  border: "none",
                  background: "#f97316",
                  color: "#fff",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Ver motocicleta
              </button>
              <button
                onClick={() => navigate("moto-edit", { motoId: moto.id_moto })}
                style={{
                  padding: "9px 18px",
                  borderRadius: 6,
                  border: "1px solid #363a46",
                  background: "transparent",
                  color: "#e8eaf0",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Editar moto
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🏍</div>
            <p style={{ color: "#8b909e", fontSize: 13, margin: "0 0 16px" }}>
              Este cliente no tiene una motocicleta asignada.
            </p>
            <button
              onClick={() => navigate("moto-new", { clienteId })}
              style={{
                padding: "9px 18px",
                borderRadius: 6,
                border: "none",
                background: "#f97316",
                color: "#fff",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + Agregar motocicleta
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
