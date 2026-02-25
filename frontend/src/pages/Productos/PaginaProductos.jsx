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

    useEffect(() => {
        cargarProductos();
    }, []);

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

    async function manejarCambioEstadoProducto(idProducto, nuevoEstadoPermiso) {
        try {
            await actualizarEstadoProducto(idProducto, nuevoEstadoPermiso);
            setProductos(productos.map(prod =>
                prod.id_producto === idProducto
                    ? { ...prod, estado_prod: nuevoEstadoPermiso }
                    : prod
            ));
        } catch (err) {
            setError(err.message);
        }
    }

    async function manejarEliminacionProducto(idProducto) {
        if (confirm('¿Estas seguro de eliminar este producto?')) {
            try {
                await eliminarProducto(idProducto);
                cargarProductos();
            } catch (err) {
                setError(err.message);
            }
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
        cargarProductos();
    }

    if (cargando) return <p>Cargando permisos...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Productos</h1>

            {tienePermiso('productos', 'Crear') && (
                <button onClick={abrirModal}>Crear Permiso</button>
            )}

            <table border="1" cellPadding="8" cellSpacing="0" style={{ marginTop: "15px", width: "100%" }}>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Descripcion</th>
                        <th>Precio Unitario</th>
                        <th>Categoria</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((prod) => (
                        <tr key={prod.id_producto}>
                            <td>{prod.nombre_prod}</td>
                            <td>{prod.descripcion_prod}</td>
                            <td>{prod.precio_unitario_prod}</td>
                            <td>{prod.nombre_categoria}</td>
                            <td>
                                <label>
                                    <input
                                        type="radio"
                                        name={`estado-${prod.id_producto}`}
                                        checked={prod.estado_prod === 'activo'}
                                        onChange={() => manejarCambioEstadoProducto(prod.id_producto, 'activo')}
                                    />
                                    Activo
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name={`estado-${prod.id_producto}`}
                                        checked={prod.estado_prod === 'inactivo'}
                                        onChange={() => manejarCambioEstadoProducto(prod.id_producto, 'inactivo')}
                                    />
                                    Inactivo
                                </label>
                            </td>
                            <td>
                                <button onClick={() => abrirModalEditar(prod.id_producto)}>Editar</button>{" | "}
                                <button onClick={() => manejarEliminacionProducto(prod.id_producto)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Modal */}
            <Modal
                isOpen={modalAbierto}
                onCancelar={cerrarModal}
                titulo={idEditar ? "Editar Producto" : "Crear Producto"}
            >
                <FormularioProductos
                    id={idEditar}
                    onCancelar={cerrarModal}
                    onGuardar={manejarGuardado}
                />
            </Modal>
        </div>
    )
}