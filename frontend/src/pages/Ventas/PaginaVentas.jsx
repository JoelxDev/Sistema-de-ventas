import { useState, useEffect } from "react";
import { obtenerVentas, obtenerVentasPorSucursal } from "../../api/ApiVentas/ApiVentas";
import { obtenerSucursalesActivas } from "../../api/ApiSucursales/ApiSucursales";
import { FormularioVentas } from "./FormularioVentas"
import { useAutenticacion } from "../../context/AutenticacionContext";
import { Modal } from "../../components/Modal";

export function PaginaVentas() {
    const [ventas, setVentas] = useState([])
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [sucursales, setSucursales] = useState(null);
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);

    const { tienePermiso } = useAutenticacion()
    const [modalAbierto, setModalAbierto] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    useEffect(() => {
        cargarSucursalesActivas()
    }, [])

    useEffect(() => {
        if (sucursalSeleccionada) {
            cargarVentasPorSucursal(sucursalSeleccionada);
        } else {
            cargarVentas();
        }
    },[sucursalSeleccionada])

    async function cargarVentas() {
        try {
            setCargando(true)
            const data = await obtenerVentas()
            setVentas(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setCargando(false)
        }
    }

    async function cargarVentasPorSucursal(idScursal) {
        try{
            setCargando(true)
            const data = await obtenerVentasPorSucursal(idScursal)
            setVentas(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setCargando(false)
        }
    }

    async function cargarSucursalesActivas() {
        try {
            setCargando(true)
            const data = await obtenerSucursalesActivas()
            setSucursales(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setCargando(false)
        }
    }

    function abrirModal() {
        setIdEditar(null);
        setModalAbierto(true);
    }

    function abrirModalEditar(id) {
        setIdEditar(id);
        setModalAbierto(true);
    }

    function cerrarModal() {
        setModalAbierto(false);
        setIdEditar(null);
    }

    function manejarGuardado() {
        cerrarModal();
        cargarVentas();
    }

    if (cargando) return <p>Cargando permisos...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Historial de Ventas</h1>

            {tienePermiso('ventas', 'Crear') && (
                <button onClick={abrirModal}>Registrar Venta</button>
            )}

            <div>
                <button
                    onClick={() => setSucursalSeleccionada(null)}
                    style={{ fontWeight: sucursalSeleccionada === null ? 'bold' : 'normal' }}
                >
                    Todas
                </button>
                {sucursales.map((suc) => (
                    <button
                        key={suc.id_sucursal}
                        onClick={() => setSucursalSeleccionada(suc.id_sucursal)}
                        style={{ fontWeight: sucursalSeleccionada === suc.id_sucursal ? 'bold' : 'normal' }}
                    >
                        {suc.nombre_suc}
                    </button>
                ))}
            </div>
            {/* Indicador de sucursal activa */}
            <p>
                Mostrando: <strong>
                    {sucursalSeleccionada
                        ? sucursales.find(s => s.id_sucursal === sucursalSeleccionada)?.nombre_suc
                        : 'Todas las sucursales'}
                </strong>
            </p>


            <table border="1" cellPadding="8" cellSpacing="0" style={{ marginTop: "15px", width: "100%" }}>
                <thead>
                    <tr>
                        <th>Tipo Venta</th>
                        <th>Metodo Pago</th>
                        <th>Fecha Venta</th>
                        <th>Total a Pagar</th>
                        <th>Monto Rec.</th>
                        <th>Vuelto</th>
                        <th>Personsal</th>
                        <th>Sucursal</th>
                        <th>Producto</th>
                        <th>Precio U.</th>
                        <th>Cantidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.map((ven) =>
                        ven.detalles_ventas?.length > 0
                            ? ven.detalles_ventas.map((detalle, index) => (
                                <tr key={`${ven.id_venta}-${detalle.id_detalles_venta}`}>
                                    {index === 0 && (
                                        <>
                                            <td rowSpan={ven.detalles_ventas.length}>{ven.tipo_venta}</td>
                                            <td rowSpan={ven.detalles_ventas.length}>{ven.metodo_pago_venta}</td>
                                            <td rowSpan={ven.detalles_ventas.length}>{new Date(ven.fecha_venta).toLocaleString('es-ES')}</td>
                                            <td rowSpan={ven.detalles_ventas.length}>{ven.total_pagar}</td>
                                            <td rowSpan={ven.detalles_ventas.length}>{ven.monto_recivido}</td>
                                            <td rowSpan={ven.detalles_ventas.length}>{ven.vuelto}</td>
                                            <td rowSpan={ven.detalles_ventas.length}>{ven.vendedor?.nombre_completo}</td>
                                            <td rowSpan={ven.detalles_ventas.length}>{ven.vendedor?.sucursal}</td>
                                        </>
                                    )}
                                    <td>{detalle.producto?.nombre_prod ?? 'Sin producto'}</td>
                                    <td>{detalle.producto?.precio_unitario_prod ?? '-'}</td>
                                    <td>{detalle.cantidad_dv}</td>
                                    {/* <td>{detalle.sub_total_dv}</td> */}
                                    {index === 0 && (
                                        <td rowSpan={ven.detalles_ventas.length}>
                                            <button onClick={() => abrirModalEditar(ven.id_venta)}>Editar</button>
                                        </td>
                                    )}
                                </tr>
                            ))
                            : (
                                <tr key={ven.id_venta}>
                                    <td>{ven.tipo_venta}</td>
                                    <td>{ven.metodo_pago_venta}</td>
                                    <td>{new Date(ven.fecha_venta).toLocaleString('es-ES')}</td>
                                    <td>{ven.total_pagar}</td>
                                    <td>{ven.monto_recivido}</td>
                                    <td>{ven.vuelto}</td>
                                    <td>{ven.vendedor?.nombre_completo}</td>
                                    <td>{ven.vendedor?.sucursal}</td>
                                    <td colSpan={4}>Sin detalles</td>
                                    <td>
                                        <button onClick={() => abrirModalEditar(ven.id_venta)}>Editar</button>
                                    </td>
                                </tr>
                            )
                    )}
                </tbody>
            </table>
            {/* Modal */}
            <Modal
                isOpen={modalAbierto}
                onCancelar={cerrarModal}
                titulo={idEditar ? "Editar Venta" : "Registrar Venta"}
            >
                <FormularioVentas
                    idVenta={idEditar}
                    onCancelar={cerrarModal}
                    onGuardar={manejarGuardado}
                />
            </Modal>
        </div>
    )
}


