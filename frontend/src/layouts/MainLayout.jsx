import { Outlet } from 'react-router-dom';
import { MenuLateral } from '../components/MenuLateral';
import { useAutenticacion } from '../context/AutenticacionContext';
import { useInactividad } from '../hooks/inactividadHook';
import { useCallback } from 'react';

export function MainLayout() {
  const { logout } = useAutenticacion();

  const manejarInactividad = useCallback(() => {
    logout();
    alert("Tu sesión expiró por inactividad.");
  }, [logout]);

  useInactividad(manejarInactividad);

  return (
    <div className="layout-root">
      <MenuLateral />
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}