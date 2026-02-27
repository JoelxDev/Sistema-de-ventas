import { useState, useEffect } from "react";
import { obtenerVentas, obtenerVentasPorSucursal } from "../../api/ApiVentas/ApiVentas";
import { obtenerSucursalesActivas } from "../../api/ApiSucursales/ApiSucursales";
import { FormularioVentas } from "./FormularioVentas";
import { useAutenticacion } from "../../context/AutenticacionContext";
import { Modal } from "../../components/Modal";

function formatearMoneda(valor) {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(parseFloat(valor) || 0);
}

export function PaginaVentas() {
    const [ventas, setVentas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [sucursales, setSucursales] = useState([]);
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);

    const { tienePermiso } = useAutenticacion();
    const [modalAbierto, setModalAbierto] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    useEffect(() => { cargarSucursalesActivas(); }, []);

    useEffect(() => {
        if (sucursalSeleccionada) {
            cargarVentasPorSucursal(sucursalSeleccionada);
        } else {
            cargarVentas();
        }
    }, [sucursalSeleccionada]);

    async function cargarVentas() {
        try { setCargando(true); setVentas(await obtenerVentas()); }
        catch (err) { setError(err.message); } finally { setCargando(false); }
    }

    async function cargarVentasPorSucursal(id) {
        try { setCargando(true); setVentas(await obtenerVentasPorSucursal(id)); }
        catch (err) { setError(err.message); } finally { setCargando(false); }
    }

    async function cargarSucursalesActivas() {
        try { setCargando(true); setSucursales(await obtenerSucursalesActivas()); }
        catch (err) { setError(err.message); } finally { setCargando(false); }
    }

    function abrirModal() { setIdEditar(null); setModalAbierto(true); }
    function abrirModalEditar(id) { setIdEditar(id); setModalAbierto(true); }
    function cerrarModal() { setModalAbierto(false); setIdEditar(null); }
    function manejarGuardado() { cerrarModal(); cargarVentas(); }

    if (cargando) return <div className="estado-cargando">â³ Cargando ventas...</div>;
    if (error)    return <div className="estado-error">âš ï¸ Error: {error}</div>;

    const sucursalActiva = sucursales.find(s => s.id_sucursal === sucursalSeleccionada);

    return (
        <div className="pagina">
            <div className="pagina-header">
                <h1 className="pagina-titulo">Historial de Ventas</h1>
                {tienePermiso('ventas', 'Crear') && (
                    <button className="btn btn-primario" onClick={abrirModal}>
                        + Registrar Venta
                    </button>
                )}
            </div>

            {/* Filtro por sucursal */}
            <div className="filtros-bar">
                <span className="filtros-label">Sucursal:</span>
                <button
                    className={`btn-filtro${sucursalSeleccionada === null ? ' activo' : ''}`}
                    onClick={() => setSucursalSeleccionada(null)}
                >
                    Todas
                </button>
                {sucursales.map((suc) => (
                    <button
                        key={suc.id_sucursal}
                        className={`btn-filtro${sucursalSeleccionada === suc.id_sucursal ? ' activo' : ''}`}
                        onClick={() => setSucursalSeleccionada(suc.id_sucursal)}
                    >
                        {suc.nombre_suc}
                    </button>
                ))}
            </div>

            <div className="tabla-wrapper">
                <table className="tabla">
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Metodo Pago</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Monto Rec.</th>
                            <th>Vuelto</th>
                            <th>Personal</th>
                            <th>Sucursal</th>
                            <th>Producto</th>
                            <th>Precio U.</th>
                            <th>Cant.</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventas.length === 0 && (
                            <tr>
                                <td colSpan="12" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '32px' }}>
                                    No hay ventas registradas{sucursalActiva ? ` en ${sucursalActiva.nombre_suc}` : ''}.
                                </td>
                            </tr>
                        )}
                        {ventas.map((ven) =>
                            ven.detalles_ventas?.length > 0
                                ? ven.detalles_ventas.map((detalle, index) => (
                                    <tr key={`${ven.id_venta}-${detalle.id_detalles_venta}`}>
                                        {index === 0 && (
                                            <>
                                                <td rowSpan={ven.detalles_ventas.length}>
                                                    <span className={`badge ${ven.tipo_venta === 'directa' ? 'badge-activo' : 'badge-inactivo'}`}>
                                                        {ven.tipo_venta}
                                                    </span>
                                                </td>
                                                <td rowSpan={ven.detalles_ventas.length}>{ven.metodo_pago_venta}</td>
                                                <td rowSpan={ven.detalles_ventas.length} style={{ color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                                                    {new Date(ven.fecha_venta).toLocaleString('es-ES')}
                                                </td>
                                                <td rowSpan={ven.detalles_ventas.length} style={{ fontWeight: 600 }}>{formatearMoneda(ven.total_pagar)}</td>
                                                <td rowSpan={ven.detalles_ventas.length}>{formatearMoneda(ven.monto_recivido)}</td>
                                                <td rowSpan={ven.detalles_ventas.length}>{formatearMoneda(ven.vuelto)}</td>
                                                <td rowSpan={ven.detalles_ventas.length}>{ven.vendedor?.nombre_completo}</td>
                                                <td rowSpan={ven.detalles_ventas.length}>{ven.vendedor?.sucursal}</td>
                                            </>
                                        )}
                                        <td>{detalle.producto?.nombre_prod ?? 'Sin producto'}</td>
                                        <td>{formatearMoneda(detalle.producto?.precio_unitario_prod ?? 0)}</td>
                                        <td style={{ textAlign: 'center' }}>{detalle.cantidad_dv}</td>
                                        {index === 0 && (
                                            <td rowSpan={ven.detalles_ventas.length}>
                                                <div className="acciones-tabla">
                                                    <button className="btn-icono btn-icono-editar" onClick={() => abrirModalEditar(ven.id_venta)}>
                                                        Editar
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                                : (
                                    <tr key={ven.id_venta}>
                                        <td><span className="badge badge-inactivo">{ven.tipo_venta}</span></td>
                                        <td>{ven.metodo_pago_venta}</td>
                                        <td style={{ color: 'var(--color-text-muted)' }}>{new Date(ven.fecha_venta).toLocaleString('es-ES')}</td>
                                        <td style={{ fontWeight: 600 }}>{formatearMoneda(ven.total_pagar)}</td>
                                        <td>{formatearMoneda(ven.monto_recivido)}</td>
                                        <td>{formatearMoneda(ven.vuelto)}</td>
                                        <td>{ven.vendedor?.nombre_completo}</td>
                                        <td>{ven.vendedor?.sucursal}</td>
                                        <td colSpan={3} style={{ color: 'var(--color-text-muted)' }}>Sin detalles</td>
                                        <td>
                                            <div className="acciones-tabla">
                                                <button className="btn-icono btn-icono-editar" onClick={() => abrirModalEditar(ven.id_venta)}>
                                                    âœï¸ Editar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                        )}
                    </tbody>
                </table>
            </div>

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
    );
}
