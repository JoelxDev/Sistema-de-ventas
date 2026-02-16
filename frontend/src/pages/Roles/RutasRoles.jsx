import { Route } from "react-router-dom";
import { Roles } from "./Roles.jsx";
import { ListaPermisos } from "./Permisos/ListaPermisos.jsx";
import { ListaModulos } from "./Modulos/ListaModulos.jsx";

export const RutasRoles = (
    <Route path="roles">
      <Route index element={<Roles />} />
      <Route path="permisos" element={<ListaPermisos/>}></Route>
      <Route path="modulos" element={<ListaModulos/>}></Route>
    </Route>
  );
