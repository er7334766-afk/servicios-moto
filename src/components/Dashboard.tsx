import { useState, useMemo } from "react";
import { clientesDB, motosDB, recomendadoDB } from "../lib/db";
import { motoCompletitud } from "../lib/schema";
import type { View } from "../App";

interface Props {
  navigate: (v: View, params?: Record<string, number>) => void;
}

export default function Dashboard({ navigate }: Props) {
  const [query, setQuery] = useState("");

  const clientes = clientesDB.getAll();
  const motos = motosDB.getAll();
  const recomendados = recomendadoDB.getAll();

  const results = useMemo(() => {
    if (!query.trim()) return { clientes: [], motos: [] };
    const q = query.toLowerCase();
    return {
      clientes: clientes.filter(
        (c) =>
          c.nombre.toLowerCase().includes(q) ||
          c.telefono.toLowerCase().includes(q)
      ),
      motos: motos.filter(
        (m) =>
          m.marca.toLowerCase().includes(q) ||
          m.modelo.toLowerCase().includes(q)
      ),
    };
  }, [query, clientes, motos]);

  const hasResults =
    query.trim() && (results.clientes.length > 0 || results.motos.length > 0);
  const noResults =
    query.trim() && !hasResults;

  const statCards = [
    {
      label: "Clientes registrados",
      value: clientes.length,
      color: "#f97316",
      sub: "en base de datos",
    },
    {
      label: "Motos registradas",
      value: motos.length,
      color: "#3b82f6",
      sub: "con información de piezas",
    },
    {
      label: "Modelos recomendados",
      value: recomendados.length,
      color: "#a855f7",
      sub: "en catálogo de referencia",
    },
  ];

  const actions: { label: string; icon: string; view: View; primary?: boolean }[] = [
    { label: "Nuevo cliente", icon: "+", view: "cliente-new", primary: true },
    { label: "Nueva moto", icon: "+", view: "moto-new" },
    { label: "Buscar cliente", icon: "🔍", view: "clientes-list" },
    { label: "Buscar moto", icon: "🔍", view: "motos-list" },
    { label: "Recomendados", icon: "⭐", view: "recomendados" },
  ];

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 30,
            fontWeight: 700,
            color: "#e8eaf0",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            margin: 0,
          }}
        >
          Panel principal
        </h1>
        <p style={{ color: "#8b909e", fontSize: 13, margin: "4px 0 0" }}>
          Sistema de gestión de clientes, motos y piezas
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              background: "#16191f",
              border: "1px solid #252830",
              borderRadius: 10,
              padding: "20px 22px",
              borderLeft: `3px solid ${card.color}`,
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 36,
                fontWeight: 500,
                color: card.color,
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {card.value}
            </div>
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "#e8eaf0",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {card.label}
            </div>
            <div style={{ fontSize: 11, color: "#8b909e", marginTop: 2 }}>
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 28, position: "relative" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#16191f",
            border: "1px solid #363a46",
            borderRadius: 8,
            padding: "0 16px",
            gap: 10,
          }}
        >
          <span style={{ color: "#8b909e", fontSize: 16 }}>🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar cliente por nombre, teléfono o moto por marca/modelo..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#e8eaf0",
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              padding: "13px 0",
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
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

        {/* Results dropdown */}
        {query.trim() && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "#1c1f28",
              border: "1px solid #363a46",
              borderRadius: 8,
              marginTop: 4,
              zIndex: 100,
              boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
              overflow: "hidden",
            }}
          >
            {noResults && (
              <div
                style={{
                  padding: "16px 18px",
                  color: "#8b909e",
                  fontSize: 13,
                  textAlign: "center",
                }}
              >
                Sin resultados para "{query}"
              </div>
            )}
            {results.clientes.length > 0 && (
              <>
                <div
                  style={{
                    padding: "8px 18px 4px",
                    fontSize: 10,
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#8b909e",
                  }}
                >
                  Clientes
                </div>
                {results.clientes.slice(0, 4).map((c) => {
                  const moto = motos.find((m) => m.id_cliente === c.id_cliente);
                  return (
                    <button
                      key={c.id_cliente}
                      onClick={() => {
                        setQuery("");
                        navigate("cliente-detail", { clienteId: c.id_cliente });
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        padding: "10px 18px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        gap: 12,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <span
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "rgba(249,115,22,0.12)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          color: "#f97316",
                          flexShrink: 0,
                        }}
                      >
                        👤
                      </span>
                      <div>
                        <div style={{ fontSize: 13, color: "#e8eaf0", fontWeight: 500 }}>
                          {c.nombre}
                        </div>
                        <div style={{ fontSize: 11, color: "#8b909e" }}>
                          {c.telefono}
                          {moto ? ` · ${moto.marca} ${moto.modelo}` : ""}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </>
            )}
            {results.motos.length > 0 && (
              <>
                <div
                  style={{
                    padding: "8px 18px 4px",
                    fontSize: 10,
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#8b909e",
                    borderTop: results.clientes.length > 0 ? "1px solid #252830" : "none",
                    marginTop: results.clientes.length > 0 ? 4 : 0,
                  }}
                >
                  Motocicletas
                </div>
                {results.motos.slice(0, 4).map((m) => {
                  const { filled, total } = motoCompletitud(m);
                  const cliente = m.id_cliente
                    ? clientes.find((c) => c.id_cliente === m.id_cliente)
                    : null;
                  return (
                    <button
                      key={m.id_moto}
                      onClick={() => {
                        setQuery("");
                        navigate("moto-detail", { motoId: m.id_moto });
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        padding: "10px 18px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        gap: 12,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <span
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "rgba(59,130,246,0.12)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          flexShrink: 0,
                        }}
                      >
                        🏍
                      </span>
                      <div>
                        <div style={{ fontSize: 13, color: "#e8eaf0", fontWeight: 500 }}>
                          {m.marca} {m.modelo} {m.anio ? `(${m.anio})` : ""}
                        </div>
                        <div style={{ fontSize: 11, color: "#8b909e" }}>
                          {cliente ? cliente.nombre : "Sin cliente asignado"} · {filled}/{total} piezas
                        </div>
                      </div>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 36,
        }}
      >
        {actions.map((action) => (
          <button
            key={action.view}
            onClick={() => navigate(action.view)}
            style={{
              padding: "10px 18px",
              borderRadius: 7,
              border: action.primary ? "none" : "1px solid #363a46",
              background: action.primary ? "#f97316" : "transparent",
              color: action.primary ? "#fff" : "#e8eaf0",
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 7,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              if (action.primary) {
                (e.currentTarget as HTMLButtonElement).style.background = "#ea6c0c";
              } else {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.06)";
              }
            }}
            onMouseLeave={(e) => {
              if (action.primary) {
                (e.currentTarget as HTMLButtonElement).style.background = "#f97316";
              } else {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }
            }}
          >
            <span>{action.icon}</span> {action.label}
          </button>
        ))}
      </div>

      {/* Recent clients table */}
      <div
        style={{
          background: "#16191f",
          border: "1px solid #252830",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid #252830",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "#e8eaf0",
            }}
          >
            Clientes recientes
          </span>
          <button
            onClick={() => navigate("clientes-list")}
            style={{
              background: "none",
              border: "none",
              color: "#f97316",
              cursor: "pointer",
              fontSize: 12,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Ver todos →
          </button>
        </div>
        {clientes.length === 0 ? (
          <div style={{ padding: "28px", textAlign: "center", color: "#8b909e", fontSize: 13 }}>
            No hay clientes registrados
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "#1c1f28",
                  borderBottom: "1px solid #252830",
                }}
              >
                {["Cliente", "Teléfono", "Motocicleta", "Piezas"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#8b909e",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientes.slice(0, 5).map((c, i) => {
                const moto = motos.find((m) => m.id_cliente === c.id_cliente);
                const comp = moto ? motoCompletitud(moto) : null;
                return (
                  <tr
                    key={c.id_cliente}
                    style={{
                      borderBottom:
                        i < Math.min(clientes.length, 5) - 1
                          ? "1px solid #1e2128"
                          : "none",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      navigate("cliente-detail", { clienteId: c.id_cliente })
                    }
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: "11px 16px",
                        fontSize: 13,
                        color: "#e8eaf0",
                        fontWeight: 500,
                      }}
                    >
                      {c.nombre}
                    </td>
                    <td
                      style={{
                        padding: "11px 16px",
                        fontSize: 12,
                        color: "#8b909e",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {c.telefono}
                    </td>
                    <td
                      style={{
                        padding: "11px 16px",
                        fontSize: 12,
                        color: moto ? "#e8eaf0" : "#4a4f5e",
                        fontStyle: moto ? "normal" : "italic",
                      }}
                    >
                      {moto
                        ? `${moto.marca} ${moto.modelo} ${moto.anio ? `(${moto.anio})` : ""}`
                        : "Sin moto asignada"}
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      {comp ? (
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
                          {comp.filled}/{comp.total}
                        </span>
                      ) : (
                        <span style={{ color: "#4a4f5e", fontSize: 11 }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
