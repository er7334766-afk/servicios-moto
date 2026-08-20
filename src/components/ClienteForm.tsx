import { useState } from "react";
import { clientesDB } from "../lib/db";
import type { Cliente } from "../lib/schema";
import type { View } from "../App";

interface Props {
  clienteId?: number;
  navigate: (v: View, params?: Record<string, number>) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function ClienteForm({ clienteId, navigate, showToast }: Props) {
  const existing = clienteId ? clientesDB.getById(clienteId) : undefined;
  const isEdit = !!existing;

  const [form, setForm] = useState({
    nombre: existing?.nombre ?? "",
    telefono: existing?.telefono ?? "",
  });
  const [saved, setSaved] = useState<Cliente | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim()) {
      showToast("El nombre es obligatorio", "error");
      return;
    }
    if (isEdit) {
      clientesDB.update(clienteId!, form);
      showToast("Cliente actualizado");
      navigate("cliente-detail", { clienteId: clienteId! });
    } else {
      const nuevo = clientesDB.create(form);
      setSaved(nuevo);
      showToast("Cliente creado correctamente");
    }
  }

  if (saved) {
    return (
      <div style={{ padding: "32px 36px", maxWidth: 500 }}>
        <div
          style={{
            background: "#16191f",
            border: "1px solid #252830",
            borderRadius: 10,
            padding: 28,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
          <h2
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#22c55e",
              margin: "0 0 8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Cliente registrado
          </h2>
          <p style={{ color: "#8b909e", fontSize: 13, marginBottom: 24 }}>
            <strong style={{ color: "#e8eaf0" }}>{saved.nombre}</strong> ha sido
            agregado al sistema.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button
              onClick={() =>
                navigate("moto-new", { clienteId: saved.id_cliente })
              }
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
              + Agregar motocicleta
            </button>
            <button
              onClick={() =>
                navigate("cliente-detail", { clienteId: saved.id_cliente })
              }
              style={{
                padding: "10px 20px",
                borderRadius: 7,
                border: "1px solid #363a46",
                background: "transparent",
                color: "#e8eaf0",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Ver perfil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px 36px", maxWidth: 500 }}>
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
          {isEdit ? "Editar cliente" : "Nuevo cliente"}
        </h1>
        <p style={{ color: "#8b909e", fontSize: 13, margin: "4px 0 0" }}>
          {isEdit ? "Modifica los datos del cliente" : "Registra un nuevo cliente en el sistema"}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#16191f",
          border: "1px solid #252830",
          borderRadius: 10,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <Field
          label="Nombre completo *"
          value={form.nombre}
          onChange={(v) => setForm((f) => ({ ...f, nombre: v }))}
          placeholder="Ej. Carlos Ramírez"
          required
        />
        <Field
          label="Teléfono"
          value={form.telefono}
          onChange={(v) => setForm((f) => ({ ...f, telefono: v }))}
          placeholder="Ej. 8888-1234"
          type="tel"
        />

        <div
          style={{
            display: "flex",
            gap: 10,
            paddingTop: 8,
            borderTop: "1px solid #252830",
          }}
        >
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "11px 0",
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
            {isEdit ? "Guardar cambios" : "Guardar cliente"}
          </button>
          <button
            type="button"
            onClick={() => navigate(isEdit ? "cliente-detail" : "clientes-list", isEdit ? { clienteId: clienteId! } : {})}
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

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: "#8b909e",
          marginBottom: 6,
          fontFamily: "'Barlow Condensed', sans-serif",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={{
          width: "100%",
          background: "#0f1117",
          border: "1px solid #363a46",
          borderRadius: 6,
          padding: "10px 12px",
          color: "#e8eaf0",
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          outline: "none",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#f97316")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "#363a46")}
      />
    </div>
  );
}
