import { useState, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ClientesList from "./components/ClientesList";
import ClienteForm from "./components/ClienteForm";
import ClienteDetail from "./components/ClienteDetail";
import MotosList from "./components/MotosList";
import MotoForm from "./components/MotoForm";
import MotoDetail from "./components/MotoDetail";
import RecomendadoSearch from "./components/RecomendadoSearch";
import RecomendadoDetail from "./components/RecomendadoDetail";
import RecomendadoForm from "./components/RecomendadoForm";
import Toast from "./components/Toast";

export type View =
  | "dashboard"
  | "clientes-list"
  | "cliente-new"
  | "cliente-detail"
  | "cliente-edit"
  | "motos-list"
  | "moto-new"
  | "moto-detail"
  | "moto-edit"
  | "recomendados"
  | "recomendado-new"
  | "recomendado-detail"
  | "recomendado-edit";

interface NavState {
  view: View;
  clienteId?: number;
  motoId?: number;
  recomendadoId?: number;
  preClienteId?: number;
}

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
  id: number;
}

export default function App() {
  const [nav, setNav] = useState<NavState>({ view: "dashboard" });
  const [toast, setToast] = useState<ToastState | null>(null);

  const navigate = useCallback(
    (view: View, params: Record<string, number> = {}) => {
      setNav({ view, ...params } as NavState);
    },
    []
  );

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      setToast({ message, type, id: Date.now() });
    },
    []
  );

  function renderContent() {
    switch (nav.view) {
      case "dashboard":
        return <Dashboard navigate={navigate} />;

      case "clientes-list":
        return <ClientesList navigate={navigate} showToast={showToast} />;

      case "cliente-new":
        return (
          <ClienteForm
            navigate={navigate}
            showToast={showToast}
          />
        );

      case "cliente-detail":
        return (
          <ClienteDetail
            clienteId={nav.clienteId!}
            navigate={navigate}
            showToast={showToast}
          />
        );

      case "cliente-edit":
        return (
          <ClienteForm
            clienteId={nav.clienteId}
            navigate={navigate}
            showToast={showToast}
          />
        );

      case "motos-list":
        return <MotosList navigate={navigate} showToast={showToast} />;

      case "moto-new":
        return (
          <MotoForm
            preClienteId={nav.preClienteId ?? nav.clienteId}
            navigate={navigate}
            showToast={showToast}
          />
        );

      case "moto-detail":
        return (
          <MotoDetail
            motoId={nav.motoId!}
            navigate={navigate}
            showToast={showToast}
          />
        );

      case "moto-edit":
        return (
          <MotoForm
            motoId={nav.motoId}
            navigate={navigate}
            showToast={showToast}
          />
        );

      case "recomendados":
        return <RecomendadoSearch navigate={navigate} />;

      case "recomendado-new":
        return <RecomendadoForm navigate={navigate} showToast={showToast} />;

      case "recomendado-detail":
        return (
          <RecomendadoDetail
            recomendadoId={nav.recomendadoId!}
            navigate={navigate}
            showToast={showToast}
          />
        );

      case "recomendado-edit":
        return (
          <RecomendadoForm
            recomendadoId={nav.recomendadoId}
            navigate={navigate}
            showToast={showToast}
          />
        );

      default:
        return <Dashboard navigate={navigate} />;
    }
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#0f1117",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Sidebar current={nav.view} navigate={navigate} />

      {/* Main content */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          background: "#0f1117",
        }}
      >
        {renderContent()}
      </main>

      {/* Toast */}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
