import { useEffect } from "react";

interface Props {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export default function Toast({ message, type = "success", onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);

  const color =
    type === "success" ? "#22c55e" : type === "error" ? "#ef4444" : "#f97316";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        background: "#1c1f28",
        border: `1px solid ${color}40`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 8,
        padding: "12px 18px",
        color: "#e8eaf0",
        fontSize: 13,
        fontFamily: "'Inter', sans-serif",
        zIndex: 2000,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        maxWidth: 320,
        animation: "slideIn 0.2s ease",
      }}
    >
      <span style={{ color, fontSize: 16 }}>
        {type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}
      </span>
      {message}
      <button
        onClick={onClose}
        style={{
          marginLeft: "auto",
          background: "none",
          border: "none",
          color: "#8b909e",
          cursor: "pointer",
          fontSize: 16,
          padding: 0,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}
