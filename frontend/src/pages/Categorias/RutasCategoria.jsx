import { Route } from "react-router-dom";
import { PaginaCategorias } from "./PaginaCategorias.jsx";

export const RutasCategorias = (
    <Route path="categorias">
        <Route index element = {<PaginaCategorias/>}/>
    </Route>
)

