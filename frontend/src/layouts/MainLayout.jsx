import { Outlet } from 'react-router-dom';
import { MenuLateral } from '../components/MenuLateral';
import { useAutenticacion } from '../context/AutenticacionContext';
import { useInactividad } from '../hooks/inactividadHook';
import { useCallback, useState } from 'react';

export function MainLayout() {
  const { logout } = useAutenticacion();
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  const manejarInactividad = useCallback(() => {
    logout();
    alert("Tu sesión expiró por inactividad.");
  }, [logout]);

  useInactividad(manejarInactividad);

  return (
    <div className="layout-root">
      <MenuLateral
        isOpen={sidebarAbierto}
        onClose={() => setSidebarAbierto(false)}
      />

      <main className="layout-main">
        {/* Botón hamburguesa visible solo en móvil */}
        <button
          className="btn-hamburguesa"
          onClick={() => setSidebarAbierto(true)}
          aria-label="Abrir menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <Outlet />
      </main>
    </div>
  );
}