import { useState, useEffect } from "react";
import { obtenerVentasFiltradas } from "../../api/ApiVentas/ApiVentas";
import { FormularioVentas } from "./FormularioVentas";
import { useAutenticacion } from "../../context/AutenticacionContext";
import { useToast } from "../../context/ToastContext";
import { Modal } from "../../components/Modal";

function formatearMoneda(valor) {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(parseFloat(valor) || 0);
}

function obtenerFechaLocal(diasAtras = 0) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - diasAtras);
    return fecha.toISOString().split('T')[0];
}

const HOY = obtenerFechaLocal(0);
const AYER = obtenerFechaLocal(1);

export function VentasPorSucursal() {
    const { usuario, tienePermiso } = useAutenticacion();
    const toast = useToast();

    const idSucursal = usuario?.id_sucursal;
    const nombreSucursal = usuario?.sucursal;

    const FILTROS_INICIALES = {
        tipo_venta: '',
        metodo_pago: '',
        fecha_desde: HOY,
        fecha_hasta: HOY,
        producto: '',
        id_sucursal: idSucursal || '',
    };

    const [ventas, setVentas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [filtros, setFiltros] = useState(FILTROS_INICIALES);
    const [filtrosAplicados, setFiltrosAplicados] = useState(false);
    const [etiquetaFecha, setEtiquetaFecha] = useState('hoy');

    const [modalAbierto, setModalAbierto] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    useEffect(() => { cargarVentasDelDia(); }, []);

    async function cargarVentasDelDia() {
        if (!idSucursal) return;
        try {
            setCargando(true);
            setError(null);

            // Intentar cargar ventas de hoy para esta sucursal
            const ventasHoy = await obtenerVentasFiltradas({ fecha_desde: HOY, fecha_hasta: HOY, id_sucursal: idSucursal });
            if (ventasHoy.length > 0) {
                setVentas(ventasHoy);
                setEtiquetaFecha('hoy');
                setFiltros(prev => ({ ...prev, fecha_desde: HOY, fecha_hasta: HOY }));
                setFiltrosAplicados(false);
                return;
            }

            // Si no hay ventas hoy, intentar con ayer
            const ventasAyer = await obtenerVentasFiltradas({ fecha_desde: AYER, fecha_hasta: AYER, id_sucursal: idSucursal });
            if (ventasAyer.length > 0) {
                setVentas(ventasAyer);
                setEtiquetaFecha('ayer');
                setFiltros(prev => ({ ...prev, fecha_desde: AYER, fecha_hasta: AYER }));
                setFiltrosAplicados(false);
                return;
            }

            // No hay ventas ni hoy ni ayer
            setVentas([]);
            setEtiquetaFecha('hoy');
            setFiltros(prev => ({ ...prev, fecha_desde: HOY, fecha_hasta: HOY }));
            setFiltrosAplicados(false);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setCargando(false);
        }
    }

    async function aplicarFiltros(e) {
        e.preventDefault();
        const { tipo_venta, metodo_pago, fecha_desde, fecha_hasta, producto } = filtros;
        const hayFiltros = [tipo_venta, metodo_pago, fecha_desde, fecha_hasta, producto].some(v => v !== '');
        if (!hayFiltros) { cargarVentasDelDia(); return; }

        try {
            setCargando(true);
            setError(null);
            // Siempre forzar id_sucursal del usuario
            const resultado = await obtenerVentasFiltradas({ ...filtros, id_sucursal: idSucursal });
            setVentas(resultado);
            setEtiquetaFecha(null);
            setFiltrosAplicados(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }

    function limpiarFiltros() {
        setFiltros(FILTROS_INICIALES);
        cargarVentasDelDia();
    }

    function actualizarFiltro(campo, valor) {
        setFiltros(prev => ({ ...prev, [campo]: valor }));
    }

    function abrirModal() { setIdEditar(null); setModalAbierto(true); }
    function abrirModalEditar(id) { setIdEditar(id); setModalAbierto(true); }
    function cerrarModal() { setModalAbierto(false); setIdEditar(null); }
    function manejarGuardado() {
        cerrarModal();
        cargarVentasDelDia();
        toast.exito(idEditar ? "Venta actualizada correctamente" : "Venta registrada correctamente");
    }

    if (!idSucursal) return <div className="estado-error">⚠️ No tienes una sucursal asignada.</div>;
    if (error) return <div className="estado-error">⚠️ Error: {error}</div>;

    return (
        <div className="pagina">
            <div className="pagina-header">
                <h1 className="pagina-titulo">
                    Historial de Ventas — {nombreSucursal || 'Mi Sucursal'}
                    {etiquetaFecha && (
                        <span style={{ fontSize: '0.55em', fontWeight: 400, color: 'var(--color-text-muted)', marginLeft: '10px' }}>
                            — Mostrando ventas de {etiquetaFecha === 'hoy' ? 'hoy' : 'ayer'} ({etiquetaFecha === 'hoy' ? HOY : AYER})
                        </span>
                    )}
                </h1>
                {tienePermiso('ventas', 'Crear') && (
                    <button className="btn btn-primario" onClick={abrirModal}>
                        + Registrar Venta
                    </button>
                )}
            </div>

            {/* Barra de filtros (sin selector de sucursal) */}
            <form className="filtros-bar" onSubmit={aplicarFiltros} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-end', marginBottom: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Tipo</label>
                    <select
                        className="input"
                        value={filtros.tipo_venta}
                        onChange={(e) => actualizarFiltro('tipo_venta', e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="unica">Unica</option>
                        <option value="multiple">Multiple</option>
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Método Pago</label>
                    <select
                        className="input"
                        value={filtros.metodo_pago}
                        onChange={(e) => actualizarFiltro('metodo_pago', e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="efectivo">Efectivo</option>
                        <option value="tarjeta">Tarjeta</option>
                        <option value="yape">Yape</option>
                        <option value="plin">Plin</option>
                        <option value="transferencia">Transferencia</option>
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Desde</label>
                    <input
                        type="date"
                        className="input"
                        value={filtros.fecha_desde}
                        onChange={(e) => actualizarFiltro('fecha_desde', e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Hasta</label>
                    <input
                        type="date"
                        className="input"
                        value={filtros.fecha_hasta}
                        onChange={(e) => actualizarFiltro('fecha_hasta', e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Producto</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="Buscar producto..."
                        value={filtros.producto}
                        onChange={(e) => actualizarFiltro('producto', e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-primario" style={{ height: 'fit-content' }}>
                    🔍 Filtrar
                </button>

                {filtrosAplicados && (
                    <button type="button" className="btn btn-secundario" onClick={limpiarFiltros} style={{ height: 'fit-content' }}>
                        ✕ Limpiar
                    </button>
                )}
            </form>

            {cargando ? (
                <div className="estado-cargando">⏳ Cargando ventas...</div>
            ) : (
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
                                <th>Producto</th>
                                <th>Precio U.</th>
                                <th>Cant.</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.length === 0 && (
                                <tr>
                                    <td colSpan="11" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '32px' }}>
                                        No hay ventas {filtrosAplicados ? 'que coincidan con los filtros' : 'registradas'}.
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
                                            <td colSpan={3} style={{ color: 'var(--color-text-muted)' }}>Sin detalles</td>
                                            <td>
                                                <div className="acciones-tabla">
                                                    <button className="btn-icono btn-icono-editar" onClick={() => abrirModalEditar(ven.id_venta)}>
                                                        ✏️ Editar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                            )}
                        </tbody>
                    </table>
                </div>
            )}

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
