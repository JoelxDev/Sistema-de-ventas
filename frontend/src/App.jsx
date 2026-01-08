import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { PerfilUsuario } from './pages/PerfilUsuario/PerfilUsuario.jsx';
// import { ListaUsuarios } from './pages/Usuarios/ListaUsuarios.jsx';
import { Dashboard } from './pages/Dashboard/Dashboard.jsx';
import { Roles } from './pages/Roles/Roles.jsx';

import {  RutasUsuario } from './pages/Usuarios/RutasUsuario.jsx';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* <Route index element={<Dashboard />} /> */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="perfil" element={<PerfilUsuario />} />
        {/* <Route path="usuarios" element={<ListaUsuarios />} /> */}
        { RutasUsuario }
        <Route path="roles" element={<Roles />} />
      </Route>
    </Routes>
  );
}

export default App;