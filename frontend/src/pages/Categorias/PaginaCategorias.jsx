import { useState, useEffect } from "react";
import { obtenerCategorias, eliminarCategoria } from "../../api/ApiCategorias/ApiCategorias";
import { FormularioCategoria } from "./FormularioCategoria";
import { Modal } from "../../components/Modal";
import { useAutenticacion } from "../../context/AutenticacionContext";

export function PaginaCategorias() {

    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const [modalAbierto, setModalAbierto] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    const { tienePermiso } = useAutenticacion();

    useEffect(() => {
        cargarCategorias();
    }, []);

    async function cargarCategorias() {
        try {
            setCargando(true);
            const data = await obtenerCategorias();
            setCategorias(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }

    function abrirModalCrear() { setIdEditar(null); setModalAbierto(true); }
    function abrirModalEditar(id) { setIdEditar(id); setModalAbierto(true); }
    function cerrarModal() { setModalAbierto(false); setIdEditar(null); }
    function manejarGuardado() { cerrarModal(); cargarCategorias(); }

    async function manejarEliminacion(id) {
        if (confirm('¿Estás seguro de eliminar esta categoría?')) {
            try {
                await eliminarCategoria(id);
                cargarCategorias();
            } catch (err) {
                setError(err.message);
            }
        }
    }

    if (cargando) return <div className="estado-cargando">⏳ Cargando categorías...</div>;
    if (error)    return <div className="estado-error">⚠️ Error: {error}</div>;

    return (
        <div className="pagina">
            <div className="pagina-header">
                <h1 className="pagina-titulo">Categorías</h1>
                {tienePermiso('categorias', 'Crear') && (
                    <button className="btn btn-primario" onClick={abrirModalCrear}>
                        + Nueva Categoría
                    </button>
                )}
            </div>

            <div className="tabla-wrapper">
                <table className="tabla">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Fecha creación</th>
                            {(tienePermiso('categorias', 'Editar') || tienePermiso('categorias', 'Eliminar')) && (
                                <th>Acciones</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.map((cat) => (
                            <tr key={cat.id_categoria}>
                                <td style={{ fontWeight: 600 }}>{cat.nombre_categoria}</td>
                                <td style={{ color: 'var(--color-text-muted)' }}>{cat.descripcion_categoria || '—'}</td>
                                <td style={{ color: 'var(--color-text-muted)' }}>
                                    {new Date(cat.fecha_crea_categoria).toLocaleString('es-ES')}
                                </td>
                                {(tienePermiso('categorias', 'Editar') || tienePermiso('categorias', 'Eliminar')) && (
                                    <td>
                                        <div className="acciones-tabla">
                                            {tienePermiso('categorias', 'Editar') && (
                                                <button
                                                    className="btn-icono btn-icono-editar"
                                                    onClick={() => abrirModalEditar(cat.id_categoria)}
                                                >
                                                    ✏️ Editar
                                                </button>
                                            )}
                                            {tienePermiso('categorias', 'Eliminar') && (
                                                <button
                                                    className="btn-icono btn-icono-eliminar"
                                                    onClick={() => manejarEliminacion(cat.id_categoria)}
                                                >
                                                    🗑️ Eliminar
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {categorias.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '32px' }}>
                                    No hay categorías registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={modalAbierto}
                onCancelar={cerrarModal}
                titulo={idEditar ? "Editar Categoría" : "Nueva Categoría"}
            >
                <FormularioCategoria
                    idCategoria={idEditar}
                    onGuardar={manejarGuardado}
                    onCancelar={cerrarModal}
                />
            </Modal>
        </div>
    );
}


