import { useToast } from "../context/ToastContext";

const ICONOS = {
  exito: "✅",
  error: "❌",
  advertencia: "⚠️",
  info: "ℹ️",
};

export function ToastContainer() {
  const { toasts, eliminarToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.tipo}`}>
          <span className="toast-icono">{ICONOS[toast.tipo] ?? "ℹ️"}</span>
          <span className="toast-mensaje">{toast.mensaje}</span>
          <button className="toast-cerrar" onClick={() => eliminarToast(toast.id)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
