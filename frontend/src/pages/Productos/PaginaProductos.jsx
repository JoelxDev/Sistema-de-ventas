import { useState, useEffect } from "react"
import { obtenerProductos, eliminarProducto, actualizarEstadoProducto } from "../../api/ApiProductos/ApiProductos"
import { FormularioProductos } from "./FormularioProductos"
import { Modal } from "../../components/Modal"
import { useAutenticacion } from "../../context/AutenticacionContext"

export function PaginaProductos() {

    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const { tienePermiso } = useAutenticacion()
    const [modalAbierto, setModalAbierto] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    useEffect(() => { cargarProductos(); }, []);

    async function cargarProductos() {
        try {
            setCargando(true);
            const data = await obtenerProductos();
            setProductos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }

    async function manejarCambioEstadoProducto(idProducto, nuevoEstado) {
        try {
            await actualizarEstadoProducto(idProducto, nuevoEstado);
            setProductos(productos.map(prod =>
                prod.id_producto === idProducto ? { ...prod, estado_prod: nuevoEstado } : prod
            ));
        } catch (err) { setError(err.message); }
    }

    async function manejarEliminacionProducto(idProducto) {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            try {
                await eliminarProducto(idProducto);
                cargarProductos();
            } catch (err) { setError(err.message); }
        }
    }

    function abrirModal() { setIdEditar(null); setModalAbierto(true); }
    function abrirModalEditar(id) { setIdEditar(id); setModalAbierto(true); }
    function cerrarModal() { setModalAbierto(false); setIdEditar(null); }
    function manejarGuardado() { cerrarModal(); cargarProductos(); }

    if (cargando) return <div className="estado-cargando">⏳ Cargando productos...</div>;
    if (error)    return <div className="estado-error">⚠️ Error: {error}</div>;

    return (
        <div className="pagina">
            <div className="pagina-header">
                <h1 className="pagina-titulo">Productos</h1>
                {tienePermiso('productos', 'Crear') && (
                    <button className="btn btn-primario" onClick={abrirModal}>
                        + Nuevo Producto
                    </button>
                )}
            </div>

            <div className="tabla-wrapper">
                <table className="tabla">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Descripción</th>
                            <th>Precio Unitario</th>
                            <th>Categoría</th>
                            {tienePermiso('productos', 'Estados') && <th>Estado</th>}
                            {(tienePermiso('productos', 'Editar') || tienePermiso('productos', 'Eliminar')) && <th>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((prod) => (
                            <tr key={prod.id_producto}>
                                <td style={{ fontWeight: 600 }}>{prod.nombre_prod}</td>
                                <td style={{ color: 'var(--color-text-muted)', maxWidth: 200 }}>{prod.descripcion_prod || '—'}</td>
                                <td>S/ {parseFloat(prod.precio_unitario_prod).toFixed(2)}</td>
                                <td>{prod.nombre_categoria}</td>
                                {tienePermiso('productos', 'Estados') && (
                                    <td>
                                        <select
                                            value={prod.estado_prod}
                                            onChange={(e) => manejarCambioEstadoProducto(prod.id_producto, e.target.value)}
                                            className={`select-estado-tabla ${prod.estado_prod}`}
                                        >
                                            <option value="activo">Activo</option>
                                            <option value="inactivo">Inactivo</option>
                                        </select>
                                    </td>
                                )}
                                {(tienePermiso('productos', 'Editar') || tienePermiso('productos', 'Eliminar')) && (
                                    <td>
                                        <div className="acciones-tabla">
                                            {tienePermiso('productos', 'Editar') && (
                                                <button className="btn-icono btn-icono-editar" onClick={() => abrirModalEditar(prod.id_producto)}>
                                                    ✏️ Editar
                                                </button>
                                            )}
                                            {tienePermiso('productos', 'Eliminar') && (
                                                <button className="btn-icono btn-icono-eliminar" onClick={() => manejarEliminacionProducto(prod.id_producto)}>
                                                    🗑️ Eliminar
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {productos.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '32px' }}>
                                    No hay productos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={modalAbierto}
                onCancelar={cerrarModal}
                titulo={idEditar ? "Editar Producto" : "Nuevo Producto"}
            >
                <FormularioProductos
                    id={idEditar}
                    onCancelar={cerrarModal}
                    onGuardar={manejarGuardado}
                />
            </Modal>
        </div>
    );
}