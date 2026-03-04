import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

let idContador = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const agregarToast = useCallback(({ tipo = "info", mensaje, duracion = 4000 }) => {
    const id = ++idContador;
    setToasts((prev) => [...prev, { id, tipo, mensaje }]);

    if (duracion > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duracion);
    }
  }, []);

  const eliminarToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Atajos
  const exito = useCallback(
    (mensaje, duracion) => agregarToast({ tipo: "exito", mensaje, duracion }),
    [agregarToast]
  );
  const error = useCallback(
    (mensaje, duracion) => agregarToast({ tipo: "error", mensaje, duracion }),
    [agregarToast]
  );
  const advertencia = useCallback(
    (mensaje, duracion) => agregarToast({ tipo: "advertencia", mensaje, duracion }),
    [agregarToast]
  );
  const info = useCallback(
    (mensaje, duracion) => agregarToast({ tipo: "info", mensaje, duracion }),
    [agregarToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, agregarToast, eliminarToast, exito, error, advertencia, info }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}
