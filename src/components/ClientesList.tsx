import { useState } from "react";
import { clientesDB, motosDB } from "../lib/db";
import ConfirmDialog from "./ConfirmDialog";
import type { View } from "../App";

interface Props {
  navigate: (v: View, params?: Record<string, number>) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function ClientesList({ navigate, showToast }: Props) {
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [, forceRender] = useState(0);

  const clientes = clientesDB.getAll();
  const motos = motosDB.getAll();

  const filtered = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.telefono.toLowerCase().includes(search.toLowerCase())
  );

  function handleDelete(id: number) {
    clientesDB.delete(id);
    setConfirmId(null);
    showToast("Cliente eliminado correctamente");
    forceRender((n) => n + 1);
  }

  const headerStyle: React.CSSProperties = {
    padding: "10px 16px",
    textAlign: "left",
    fontSize: 11,
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#8b909e",
  };

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1000 }}>
      {confirmId !== null && (
        <ConfirmDialog
          title="Eliminar cliente"
          message={`¿Estás seguro de que deseas eliminar este cliente? La motocicleta asociada quedará sin propietario.`}
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
            Clientes
          </h1>
          <p style={{ color: "#8b909e", fontSize: 13, margin: "4px 0 0" }}>
            {clientes.length} cliente{clientes.length !== 1 ? "s" : ""} registrado
            {clientes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => navigate("cliente-new")}
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
          + Nuevo cliente
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
          placeholder="Buscar por nombre o teléfono..."
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
              <th style={headerStyle}>Nombre</th>
              <th style={headerStyle}>Teléfono</th>
              <th style={headerStyle}>Motocicleta</th>
              <th style={{ ...headerStyle, textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#8b909e",
                    fontSize: 13,
                  }}
                >
                  {search ? `Sin resultados para "${search}"` : "No hay clientes registrados"}
                </td>
              </tr>
            ) : (
              filtered.map((c, i) => {
                const moto = motos.find((m) => m.id_cliente === c.id_cliente);
                return (
                  <tr
                    key={c.id_cliente}
                    style={{
                      borderBottom:
                        i < filtered.length - 1 ? "1px solid #1e2128" : "none",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        color: "#e8eaf0",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        navigate("cliente-detail", { clienteId: c.id_cliente })
                      }
                    >
                      {c.nombre}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 12,
                        color: "#8b909e",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {c.telefono || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 12,
                        color: moto ? "#e8eaf0" : "#4a4f5e",
                        fontStyle: moto ? "normal" : "italic",
                      }}
                    >
                      {moto
                        ? `${moto.marca} ${moto.modelo}${moto.anio ? ` (${moto.anio})` : ""}`
                        : "Sin moto asignada"}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <ActionBtn
                          onClick={() =>
                            navigate("cliente-detail", { clienteId: c.id_cliente })
                          }
                          label="Ver"
                          color="#3b82f6"
                        />
                        <ActionBtn
                          onClick={() =>
                            navigate("cliente-edit", { clienteId: c.id_cliente })
                          }
                          label="Editar"
                          color="#8b909e"
                        />
                        <ActionBtn
                          onClick={() => setConfirmId(c.id_cliente)}
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
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = `${color}22`)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = `${color}10`)
      }
    >
      {label}
    </button>
  );
}
