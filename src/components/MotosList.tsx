import { useState } from "react";
import { motosDB, clientesDB } from "../lib/db";
import { motoCompletitud } from "../lib/schema";
import ConfirmDialog from "./ConfirmDialog";
import type { View } from "../App";

interface Props {
  navigate: (v: View, params?: Record<string, number>) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function MotosList({ navigate, showToast }: Props) {
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [, forceRender] = useState(0);

  const motos = motosDB.getAll();
  const clientes = clientesDB.getAll();

  const filtered = motos.filter(
    (m) =>
      m.marca.toLowerCase().includes(search.toLowerCase()) ||
      m.modelo.toLowerCase().includes(search.toLowerCase()) ||
      (m.anio ? String(m.anio).includes(search) : false)
  );

  function handleDelete(id: number) {
    motosDB.delete(id);
    setConfirmId(null);
    showToast("Motocicleta eliminada");
    forceRender((n) => n + 1);
  }

  const headerStyle: React.CSSProperties = {
    padding: "10px 16px",
    textAlign: "left" as const,
    fontSize: 11,
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    color: "#8b909e",
  };

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1100 }}>
      {confirmId !== null && (
        <ConfirmDialog
          title="Eliminar motocicleta"
          message="¿Estás seguro de que deseas eliminar esta motocicleta? Esta acción no se puede deshacer."
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
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
            Motocicletas
          </h1>
          <p style={{ color: "#8b909e", fontSize: 13, margin: "4px 0 0" }}>
            {motos.length} moto{motos.length !== 1 ? "s" : ""} registrada
            {motos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => navigate("moto-new")}
          style={{
            padding: "10px 20px",
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
          + Nueva moto
        </button>
      </div>

      {/* Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#16191f",
          border: "1px solid #363a46",
          borderRadius: 7,
          padding: "0 14px",
          gap: 8,
          marginBottom: 20,
        }}
      >
        <span style={{ color: "#8b909e" }}>🔍</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por marca o modelo..."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#e8eaf0",
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            padding: "11px 0",
          }}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            style={{
              background: "none",
              border: "none",
              color: "#8b909e",
              cursor: "pointer",
              fontSize: 18,
              padding: 0,
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* Table */}
      <div
        style={{
          background: "#16191f",
          border: "1px solid #252830",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1c1f28", borderBottom: "1px solid #252830" }}>
              <th style={headerStyle}>Marca / Modelo</th>
              <th style={headerStyle}>Año</th>
              <th style={headerStyle}>Cilindraje</th>
              <th style={headerStyle}>Cliente</th>
              <th style={headerStyle}>Estado</th>
              <th style={{ ...headerStyle, textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#8b909e",
                    fontSize: 13,
                  }}
                >
                  {search ? `Sin resultados para "${search}"` : "No hay motos registradas"}
                </td>
              </tr>
            ) : (
              filtered.map((m, i) => {
                const { filled, total } = motoCompletitud(m);
                const pct = Math.round((filled / total) * 100);
                const cliente = m.id_cliente
                  ? clientes.find((c) => c.id_cliente === m.id_cliente)
                  : null;
                return (
                  <tr
                    key={m.id_moto}
                    style={{
                      borderBottom:
                        i < filtered.length - 1 ? "1px solid #1e2128" : "none",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate("moto-detail", { motoId: m.id_moto })}
                    >
                      <div
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: 16,
                          fontWeight: 700,
                          color: "#e8eaf0",
                          letterSpacing: "0.03em",
                        }}
                      >
                        {m.marca} {m.modelo}
                      </div>
                      {m.tipo_motor && (
                        <div style={{ fontSize: 11, color: "#8b909e", marginTop: 1 }}>
                          {m.tipo_motor}
                        </div>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        fontFamily: "'JetBrains Mono', monospace",
                        color: "#e8eaf0",
                      }}
                    >
                      {m.anio ?? "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 12,
                        color: "#8b909e",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {m.cilindraje || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 12,
                        color: cliente ? "#e8eaf0" : "#4a4f5e",
                        fontStyle: cliente ? "normal" : "italic",
                      }}
                    >
                      {cliente ? (
                        <button
                          onClick={() =>
                            navigate("cliente-detail", {
                              clienteId: cliente.id_cliente,
                            })
                          }
                          style={{
                            background: "none",
                            border: "none",
                            color: "#3b82f6",
                            cursor: "pointer",
                            fontSize: 12,
                            fontFamily: "'Inter', sans-serif",
                            padding: 0,
                          }}
                        >
                          {cliente.nombre}
                        </button>
                      ) : (
                        "Sin asignar"
                      )}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div>
                        <div
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 11,
                            color: pct >= 80 ? "#22c55e" : pct >= 40 ? "#f97316" : "#8b909e",
                            marginBottom: 4,
                          }}
                        >
                          {filled}/{total} · {pct}%
                        </div>
                        <div
                          style={{
                            width: 80,
                            height: 4,
                            background: "#252830",
                            borderRadius: 2,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${pct}%`,
                              height: "100%",
                              background:
                                pct >= 80 ? "#22c55e" : pct >= 40 ? "#f97316" : "#8b909e",
                              borderRadius: 2,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <ActionBtn
                          onClick={() => navigate("moto-detail", { motoId: m.id_moto })}
                          label="Ver"
                          color="#3b82f6"
                        />
                        <ActionBtn
                          onClick={() => navigate("moto-edit", { motoId: m.id_moto })}
                          label="Editar"
                          color="#8b909e"
                        />
                        <ActionBtn
                          onClick={() => setConfirmId(m.id_moto)}
                          label="Eliminar"
                          color="#ef4444"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionBtn({
  label,
  color,
  onClick,
}: {
  label: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 12px",
        borderRadius: 5,
        border: `1px solid ${color}40`,
        background: `${color}10`,
        color: color,
        fontSize: 11,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 500,
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = `${color}22`)}
      onMouseLeave={(e) => (e.currentTarget.style.background = `${color}10`)}
    >
      {label}
    </button>
  );
}
