import { NavLink } from 'react-router-dom';
import { useAutenticacion } from '../context/AutenticacionContext.jsx';

const NAV_ITEMS = [
  { to: '/perfil',     label: 'Mi Perfil',   icon: '👤', modulo: null },
  { to: '/dashboard',  label: 'Dashboard',   icon: '📊', modulo: 'dashboard' },
  { to: '/usuarios',   label: 'Usuarios',    icon: '👥', modulo: 'usuarios' },
  { to: '/roles',      label: 'Roles',       icon: '🛡️', modulo: 'roles' },
  { to: '/sucursales', label: 'Sucursales',  icon: '🏪', modulo: 'sucursales' },
  { to: '/sesiones',   label: 'Sesiones',    icon: '🕐', modulo: 'sesiones' },
  { to: '/categorias', label: 'Categorías',  icon: '🗂️', modulo: 'categorias' },
  { to: '/productos',  label: 'Productos',   icon: '📦', modulo: 'productos' },
  { to: '/ventas',     label: 'Ventas',      icon: '🛒', modulo: 'ventas' },
];

export function MenuLateral() {
  const { tieneAccesoModulo, logout, usuario } = useAutenticacion();

  return (
    <aside className="sidebar">
      {/* Marca */}
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon">👤</span>
        <span>Administrador</span>
      </div>

      {/* Navegación */}
      <ul className="sidebar-nav">
        {NAV_ITEMS.map(({ to, label, icon, modulo }) => {
          if (modulo && !tieneAccesoModulo(modulo)) return null;
          return (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  'sidebar-link' + (isActive ? ' active' : '')
                }
              >
                <span className="sidebar-link-icon">{icon}</span>
                <span>{label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div className="sidebar-footer">
        {usuario && (
          <div style={{ marginBottom: '10px', color: '#94a3b8', fontSize: '0.78rem', textAlign: 'center' }}>
            {usuario.nombre_usuario}
          </div>
        )}
        <button className="btn-logout" onClick={logout}>
          <span>🚪</span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}