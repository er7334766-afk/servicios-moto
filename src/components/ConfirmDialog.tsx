interface Props {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Eliminar",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "#1c1f28",
          border: "1px solid #363a46",
          borderRadius: 10,
          padding: 28,
          maxWidth: 400,
          width: "90%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: "#e8eaf0",
            marginBottom: 10,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {title}
        </div>
        <p style={{ color: "#8b909e", fontSize: 14, margin: "0 0 24px" }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 18px",
              borderRadius: 6,
              border: "1px solid #363a46",
              background: "transparent",
              color: "#8b909e",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "8px 18px",
              borderRadius: 6,
              border: "none",
              background: "#ef4444",
              color: "#fff",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
