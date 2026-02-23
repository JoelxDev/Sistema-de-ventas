import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { PerfilUsuario } from './pages/PerfilUsuario/PerfilUsuario.jsx';
import { Dashboard } from './pages/Dashboard/Dashboard.jsx';
import { RutasRoles } from './pages/Roles/RutasRoles.jsx';
import { RutasUsuario } from './pages/Usuarios/RutasUsuario.jsx';
import { RutasSucursales } from './pages/Sucursales/RutasSucursal.jsx';
import { RutasSesiones } from './pages/Sesiones/RutasSesiones.jsx';
import { RutasCategorias } from './pages/Categorias/RutasCategoria.jsx';

import { useAutenticacion } from './context/AutenticacionContext.jsx';
import { Login } from './pages/Login/Login.jsx';

function RutaProtegida({ children }){
  const { estaAutenticado, cargando } = useAutenticacion()

  if (cargando) return <p>Cargando...</p>
  if (!estaAutenticado){
    return <Navigate to="login"/>
  }
  return children
}

function App() {
  return (
    <Routes>
      {/* Ruta publica - Login */}
      <Route path='/login' element={<Login/>}/>

      {/* Rutas protegidas */}
      <Route element={
        <RutaProtegida>
          <MainLayout/>
        </RutaProtegida>
      }>
        <Route path="perfil" element={<PerfilUsuario />} />
        <Route path="dashboard" element={<Dashboard />} />
        { RutasUsuario }
        { RutasRoles }
        { RutasSucursales }
        { RutasSesiones }
        { RutasCategorias }
      </Route>
      {/* Redirigir raiz a login */}
      <Route path="/" element={<Navigate to="/login"/>}/>
      {/* Cualquier otra ruta redirige al login */}
      <Route path="*" element={<Navigate to="/login"/>}/>
    </Routes>
  );
}

export default App;