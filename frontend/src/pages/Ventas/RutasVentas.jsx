import { Route } from "react-router-dom";
import { PaginaVentas } from "./PaginaVentas";

export const RutasVentas = (
    <Route path="ventas">
        <Route index element={<PaginaVentas/>}/>
   </Route>
)