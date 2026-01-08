import { Link } from 'react-router-dom';

export function MenuLateral() {
  return (
    <nav>
      <ul>
        <li><Link to="/perfil">Perfil</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/usuarios">Usuarios</Link></li>
        <li><Link to="/roles">Roles</Link></li>
      </ul>
    </nav>
  );
}