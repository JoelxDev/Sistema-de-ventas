import { useState, useEffect } from "react";
import { obtenerVentas, obtenerVentasPorSucursal, obtenerVentasFiltradas } from "../../api/ApiVentas/ApiVentas";
import { obtenerSucursalesActivas } from "../../api/ApiSucursales/ApiSucursales";
import { FormularioVentas } from "./FormularioVentas";
import { useAutenticacion } from "../../context/AutenticacionContext";
import { Modal } from "../../components/Modal";

function formatearMoneda(valor) {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(parseFloat(valor) || 0);
}

const FILTROS_INICIALES = {
    tipo_venta: '',
    metodo_pago: '',
    fecha_desde: '',
    fecha_hasta: '',
    producto: '',
    id_sucursal: '',
};

export function PaginaVentas() {
    const [ventas, setVentas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [sucursales, setSucursales] = useState([]);
    const [filtros, setFiltros] = useState(FILTROS_INICIALES);
    const [filtrosAplicados, setFiltrosAplicados] = useState(false);

    const { tienePermiso } = useAutenticacion();
    const [modalAbierto, setModalAbierto] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    useEffect(() => { cargarSucursalesActivas(); }, []);
    useEffect(() => { cargarVentas(); }, []);

    async function cargarVentas() {
        try { setCargando(true); setVentas(await obtenerVentas()); setFiltrosAplicados(false); }
        catch (err) { setError(err.message); } finally { setCargando(false); }
    }

    async function cargarSucursalesActivas() {
        try { setSucursales(await obtenerSucursalesActivas()); }
        catch (err) { setError(err.message); }
    }

    async function aplicarFiltros(e) {
        e.preventDefault();
        // Verificar si hay al menos un filtro activo
        const hayFiltros = Object.values(filtros).some(v => v !== '');
        if (!hayFiltros) { cargarVentas(); return; }

        try {
            setCargando(true);
            setError(null);
            const resultado = await obtenerVentasFiltradas(filtros);
            setVentas(resultado);
            setFiltrosAplicados(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }

    function limpiarFiltros() {
        setFiltros(FILTROS_INICIALES);
        cargarVentas();
    }

    function actualizarFiltro(campo, valor) {
        setFiltros(prev => ({ ...prev, [campo]: valor }));
    }

    function abrirModal() { setIdEditar(null); setModalAbierto(true); }
    function abrirModalEditar(id) { setIdEditar(id); setModalAbierto(true); }
    function cerrarModal() { setModalAbierto(false); setIdEditar(null); }
    function manejarGuardado() { cerrarModal(); cargarVentas(); }

    if (error) return <div className="estado-error">⚠️ Error: {error}</div>;

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

            {/* Barra de filtros */}
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Sucursal</label>
                    <select
                        className="input"
                        value={filtros.id_sucursal}
                        onChange={(e) => actualizarFiltro('id_sucursal', e.target.value)}
                    >
                        <option value="">Todas</option>
                        {sucursales.map((suc) => (
                            <option key={suc.id_sucursal} value={suc.id_sucursal}>
                                {suc.nombre_suc}
                            </option>
                        ))}
                    </select>
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