import { Route } from "react-router-dom";
import { PaginaVentas } from "./PaginaVentas";
import { VentasPorSucursal } from "./VentasPorSucursal";
import { useAutenticacion } from "../../context/AutenticacionContext";

function VentasSwitch() {
    const { usuario } = useAutenticacion();
    // Si el usuario tiene sucursal asignada, muestra solo las ventas de su sucursal
    if (usuario?.id_sucursal) {
        return <VentasPorSucursal />;
    }
    return <PaginaVentas />;
}

export const RutasVentas = (
    <Route path="ventas">
        <Route index element={<VentasSwitch />} />
    </Route>
)