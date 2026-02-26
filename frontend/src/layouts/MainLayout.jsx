import { Outlet } from 'react-router-dom';
import { MenuLateral } from '../components/MenuLateral';
import { useAutenticacion } from '../context/AutenticacionContext';
import { useInactividad } from '../hooks/inactividadHook';
import { useCallback } from 'react';

export function MainLayout() {
  const { logout } = useAutenticacion();

  const manejarInactividad = useCallback(() => {
    logout();
    alert("Tu sesion expiro por inactividad.");
  }, [logout]); 

  useInactividad(manejarInactividad);
  
  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: '200px', borderRight: '1px solid #ccc' }}>
        <MenuLateral />
      </aside>
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}