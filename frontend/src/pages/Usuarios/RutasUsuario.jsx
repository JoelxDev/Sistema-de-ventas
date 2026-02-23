import { Route } from "react-router-dom";
import { ListaUsuarios } from "./ListaUsuarios.jsx";
import { FormularioUsuarioModal } from "./FormularioUsuarioModal.jsx";
import { DetallesUsuario } from "./DetallesUsuario.jsx";


export const RutasUsuario = (
    <Route path="usuarios">
      <Route index element={<ListaUsuarios />} />
    </Route>
  );