import { Link } from 'react-router-dom';
import { useAutenticacion } from '../context/AutenticacionContext.jsx';

export function MenuLateral() {
  const { tieneAccesoModulo, logout } = useAutenticacion();

  return (
    <nav>
      <ul>
        <li><Link to="/perfil">Perfil</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        {tieneAccesoModulo('usuarios') && (
          <li><Link to="/usuarios">Usuarios</Link></li>
        )}
        {tieneAccesoModulo('roles') && (
          <li><Link to="/roles">Roles</Link></li>
        )}
        {tieneAccesoModulo('sucursales') && (
          <li><Link to="/sucursales">Sucursales</Link></li>
        )}
        {tieneAccesoModulo('sesiones') && (
          <li><Link to="/sesiones">Sesiones</Link></li>
        )}
        {tieneAccesoModulo('categorias') && (
          <li><Link to="/categorias">Categorias</Link></li>
        )}
        {tieneAccesoModulo('productos') && (
          <li><Link to="/productos">Productos</Link></li>
        )}
      </ul>
      <button onClick={logout}>Cerrar Sesion</button>
    </nav>
  );
}