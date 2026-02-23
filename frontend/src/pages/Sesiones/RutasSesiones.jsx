import { Route } from "react-router-dom";
import { PaginaSesiones } from "./PaginaSesiones";

export const RutasSesiones = (
    <Route path="sesiones">
      <Route index element={<PaginaSesiones />} />
    </Route>
)

