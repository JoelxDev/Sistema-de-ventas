import { Route } from "react-router-dom"
import { PaginaProductos } from "./PaginaProductos"

export const RutasProductos = (
    <Route path="productos">
        <Route index element = {<PaginaProductos/>}/>
    </Route>
)
