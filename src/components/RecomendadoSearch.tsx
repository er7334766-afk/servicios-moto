import { useState, useMemo } from "react";
import { recomendadoDB } from "../lib/db";
import type { View } from "../App";

interface Props {
  navigate: (v: View, params?: Record<string, number>) => void;
}

export default function RecomendadoSearch({ navigate }: Props) {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");

  const todos = recomendadoDB.getAll();

  const marcas = useMemo(
    () => [...new Set(todos.map((r) => r.marca))].sort(),
    [todos]
  );
  const modelosFiltrados = useMemo(
    () =>
      [
        ...new Set(
          todos
            .filter((r) => !marca || r.marca === marca)
            .map((r) => r.modelo)
        ),
      ].sort(),
    [todos, marca]
  );

  const resultados = useMemo(
    () => recomendadoDB.search(marca, modelo),
    [marca, modelo]
  );

  return (
    <div style={{ padding: "32px 36px", maxWidth: 860 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
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
          Recomendados
        </h1>
        <p style={{ color: "#8b909e", fontSize: 13, margin: "4px 0 0" }}>
          Catálogo de piezas recomendadas y posibles adaptaciones por modelo
        </p>
      </div>

      <button
        onClick={() => navigate("recomendado-new")}
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
          marginBottom: 20,
        }}
      >
        + Nuevo recomendado
      </button>

      {/* Search panel */}
      <div
        style={{
          background: "#16191f",
          border: "1px solid #252830",
          borderRadius: 10,
          padding: "20px 24px",
          marginBottom: 24,
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
          Buscar por modelo
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: "#8b909e",
                marginBottom: 5,
                fontFamily: "'Barlow Condensed', sans-serif",
              }}
            >
              Marca
            </label>
            <select
              value={marca}
              onChange={(e) => {
                setMarca(e.target.value);
                setModelo("");
              }}
              style={{
                width: "100%",
                background: "#0f1117",
                border: "1px solid #363a46",
                borderRadius: 6,
                padding: "9px 12px",
                color: marca ? "#e8eaf0" : "#8b909e",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                outline: "none",
                cursor: "pointer",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#f97316")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#363a46")}
            >
              <option value="">Todas las marcas</option>
              {marcas.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: "#8b909e",
                marginBottom: 5,
                fontFamily: "'Barlow Condensed', sans-serif",
              }}
            >
              Modelo
            </label>
            <select
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              style={{
                width: "100%",
                background: "#0f1117",
                border: "1px solid #363a46",
                borderRadius: 6,
                padding: "9px 12px",
                color: modelo ? "#e8eaf0" : "#8b909e",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                outline: "none",
                cursor: "pointer",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#f97316")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#363a46")}
            >
              <option value="">Todos los modelos</option>
              {modelosFiltrados.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {todos.length === 0 ? (
        <div
          style={{
            background: "#16191f",
            border: "1px solid #252830",
            borderRadius: 10,
            padding: "48px",
            textAlign: "center",
            color: "#8b909e",
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 12 }}>⭐</div>
          <p style={{ fontSize: 13 }}>No hay modelos en el catálogo de recomendados.</p>
        </div>
      ) : resultados.length === 0 ? (
        <div
          style={{
            background: "#16191f",
            border: "1px solid #252830",
            borderRadius: 10,
            padding: "48px",
            textAlign: "center",
            color: "#8b909e",
          }}
        >
          <p style={{ fontSize: 13 }}>
            Sin resultados para "{marca} {modelo}".
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {resultados.map((rec) => (
            <div
              key={rec.id_recomendado}
              style={{
                background: "#16191f",
                border: "1px solid #252830",
                borderRadius: 10,
                padding: "18px 22px",
                cursor: "pointer",
                transition: "border-color 0.15s",
              }}
              onClick={() =>
                navigate("recomendado-detail", {
                  recomendadoId: rec.id_recomendado,
                })
              }
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#f97316")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "#252830")
              }
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#e8eaf0",
                      letterSpacing: "0.03em",
                      textTransform: "uppercase",
                    }}
                  >
                    {rec.marca} {rec.modelo}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
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
                <span style={{ color: "#f97316", fontSize: 20 }}>→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
