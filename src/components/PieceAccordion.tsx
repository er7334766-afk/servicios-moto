import { useState } from "react";
import type { PieceCategory, Moto } from "../lib/schema";
import { categoryCompletitud } from "../lib/schema";

interface Props {
  category: PieceCategory;
  moto: Moto;
  readOnly?: boolean;
  onChange?: (key: string, value: string) => void;
  defaultOpen?: boolean;
}

export default function PieceAccordion({
  category,
  moto,
  readOnly = false,
  onChange,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const { filled, total } = categoryCompletitud(moto, category);
  const pct = Math.round((filled / total) * 100);

  return (
    <div
      style={{
        border: "1px solid #252830",
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 6,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          background: open ? "#1c1f28" : "#16191f",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          color: "#e8eaf0",
          transition: "background 0.15s",
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
          {category.label}
        </span>

        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: filled > 0 ? "#22c55e" : "#8b909e",
            background: filled > 0 ? "rgba(34,197,94,0.08)" : "#1e2128",
            padding: "2px 8px",
            borderRadius: 4,
            whiteSpace: "nowrap",
          }}
        >
          {filled}/{total}
        </span>

        {/* mini progress */}
        <div
          style={{
            width: 60,
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
              background: pct === 100 ? "#22c55e" : "#f97316",
              borderRadius: 2,
            }}
          />
        </div>

        <span
          style={{
            color: "#8b909e",
            fontSize: 14,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            display: "inline-block",
          }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          style={{
            background: "#16191f",
            borderTop: "1px solid #252830",
            padding: "4px 0 8px",
          }}
        >
          {category.fields.map((field) => {
            const val = String(moto[field.key] ?? "");
            return (
              <div
                key={String(field.key)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "220px 1fr",
                  alignItems: "center",
                  padding: "5px 16px",
                  gap: 12,
                  borderBottom: "1px solid #1e2128",
                }}
              >
                <label
                  style={{
                    fontSize: 12,
                    color: "#8b909e",
                    fontFamily: "'Inter', sans-serif",
                    userSelect: "none",
                  }}
                >
                  {field.label}
                </label>
                {readOnly ? (
                  <span
                    style={{
                      fontFamily: val ? "'JetBrains Mono', monospace" : "'Inter', sans-serif",
                      fontSize: val ? 12 : 12,
                      color: val ? "#e8eaf0" : "#4a4f5e",
                      fontStyle: val ? "normal" : "italic",
                    }}
                  >
                    {val || "Sin información"}
                  </span>
                ) : (
                  <input
                    type="text"
                    value={val}
                    placeholder="—"
                    onChange={(e) => onChange?.(String(field.key), e.target.value)}
                    style={{
                      background: "#0f1117",
                      border: "1px solid #252830",
                      borderRadius: 5,
                      padding: "5px 10px",
                      color: "#e8eaf0",
                      fontSize: 12,
                      fontFamily: "'JetBrains Mono', monospace",
                      outline: "none",
                      width: "100%",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#f97316")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#252830")
                    }
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
