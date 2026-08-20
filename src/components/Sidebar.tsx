import type { View } from "../App";

interface Props {
  current: View;
  navigate: (v: View) => void;
}

const navItems: { view: View; label: string; icon: string }[] = [
  { view: "dashboard", label: "Dashboard", icon: "⊞" },
  { view: "clientes-list", label: "Clientes", icon: "👤" },
  { view: "motos-list", label: "Motocicletas", icon: "🏍" },
  { view: "recomendados", label: "Recomendados", icon: "⭐" },
];

export default function Sidebar({ current, navigate }: Props) {
  const isActive = (v: View) => {
    if (v === "clientes-list") return current.startsWith("cliente");
    if (v === "motos-list") return current.startsWith("moto");
    if (v === "recomendados") return current.startsWith("recomendado");
    return current === v;
  };

  return (
    <aside
      style={{
        width: 220,
        minWidth: 220,
        background: "#13161c",
        borderRight: "1px solid #252830",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid #252830",
        }}
      >
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.05em",
            color: "#f97316",
            textTransform: "uppercase",
          }}
        >
          Inversiones Rodriguez
        </div>
        <div style={{ fontSize: 11, color: "#8b909e", marginTop: 2 }}>
          Clientes y motocicletas
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px" }}>
        {navItems.map((item) => {
          const active = isActive(item.view);
          return (
            <button
              key={item.view}
              onClick={() => navigate(item.view)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "9px 12px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                background: active ? "rgba(249,115,22,0.12)" : "transparent",
                color: active ? "#f97316" : "#8b909e",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                textAlign: "left",
                marginBottom: 2,
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#e8eaf0";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#8b909e";
                }
              }}
            >
              <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>
                {item.icon}
              </span>
              {item.label}
              {active && (
                <span
                  style={{
                    marginLeft: "auto",
                    width: 3,
                    height: 16,
                    background: "#f97316",
                    borderRadius: 2,
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid #252830",
          fontSize: 11,
          color: "#4a4f5e",
        }}
      >
        v1.0 · Taller de repuestos
      </div>
    </aside>
  );
}
