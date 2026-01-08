import { Route } from "react-router-dom";
import { ListaUsuarios } from "./ListaUsuarios.jsx";
import { FormularioUsuario } from "./FormularioUsuario.jsx";
import { DetallesUsuario } from "./DetallesUsuario.jsx";


export const RutasUsuario = (
    <Route path="usuarios">
      <Route index element={<ListaUsuarios />} />
      <Route path="crear" element={<FormularioUsuario />} />
      <Route path=":id/editar" element={<FormularioUsuario />} />
      <Route path=":id/detalles" element={<DetallesUsuario />} />
    </Route>
  );