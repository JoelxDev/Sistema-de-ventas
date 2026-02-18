import { PaginaSucursales } from "./PaginaSucursales";
import { Route } from "react-router-dom"
import { FormularioSucursal } from "./FormularioSucursal";

export const RutasSucursales = (
    <Route path="sucursales">
        <Route index element= {<PaginaSucursales/>}/>
        <Route path="crear" element = {<FormularioSucursal/>}/>
        <Route path=":id/editar" element = {<FormularioSucursal/>}/>
    </Route>
)