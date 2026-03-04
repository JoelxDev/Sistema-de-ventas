import { useState, useEffect } from "react"
import { obtenerModulos, eliminarModulo, actualizarEstadoModulo } from "../../../api/ApiRoles/ApiModulos/ApiModulos.jsx"
import { Modal } from "../../../components/Modal.jsx";
import { FormularioModulos } from './FormularioModulos.jsx'
import { useAutenticacion } from "../../../context/AutenticacionContext.jsx";
import { useToast } from "../../../context/ToastContext.jsx";

export function ListaModulos() {

    const toast = useToast()

    const [modulos, setModulos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const { tienePermiso } = useAutenticacion();
    const [modalAbiertoModulo, setModalAbiertoModulo] = useState(false);
    const [idEditarModulo, setIdEditarModulo] = useState(null);

    useEffect(() => { cargarModulos(); }, []);

    async function cargarModulos() {
        try {
            setCargando(true);
            const data = await obtenerModulos();
            setModulos(data);
        } catch (err) { setError(err.message); toast.error(err.message, 6000) }
        finally { setCargando(false); }
    }

    async function manejarEliminacionModulo(id) {
        if (confirm('Estas seguro de eliminar este modulo?')) {
            try { await eliminarModulo(id); cargarModulos(); toast.exito("Modulo eliminado exitosamente", 6000)}
            catch (err) { setError(err.message); toast.error(err.message, 6000) }
        }
    }

    async function manejarCambioEstadoModulo(id, nuevoEstado) {
        try {
            await actualizarEstadoModulo(id, nuevoEstado);
            setModulos(modulos.map(m => m.id_modulo === id ? { ...m, estado_modulo: nuevoEstado } : m));
            toast.info("Estado del modulo actualizado exitosamente", 6000)
        } catch (err) { setError(err.message); toast.error(err.message)}
    }

    function abrirModalCrearModulo() { setIdEditarModulo(null); setModalAbiertoModulo(true); }
    function abrirModalEditarPermiso(id) { setIdEditarModulo(id); setModalAbiertoModulo(true); }
    function cerrarModal() { setModalAbiertoModulo(false); setIdEditarModulo(null); }
    function manejarGuardadoModulo() { cerrarModal(); cargarModulos(); toast.exito(idEditarModulo ? "Modulo editado exitosamente" : "Modulo creado exitosamente" )}

    if (cargando) return <div className="estado-cargando">Cargando modulos...</div>;
    if (error)    return <div className="estado-error">Error: {error}</div>;

    return (
        <div className="pagina">
            <div className="pagina-header">
                <h1 className="pagina-titulo">Modulos / Submodulos</h1>
                {tienePermiso('modulos', 'Crear') && (
                    <button className="btn btn-primario" onClick={abrirModalCrearModulo}>
                        + Nuevo Modulo
                    </button>
                )}
            </div>

            <div className="tabla-wrapper">
                <table className="tabla">
                    <thead>
                        <tr>
                            <th>Modulo</th>
                            <th>Descripcion</th>
                            <th>Fecha creacion</th>
                            {tienePermiso('modulos', 'Estados') && <th>Estado</th>}
                            {(tienePermiso('modulos', 'Editar') || tienePermiso('modulos', 'Eliminar')) && <th>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {modulos.map((mod) => (
                            <tr key={mod.id_modulo}>
                                <td style={{ fontWeight: 600 }}>{mod.nombre_modulo}</td>
                                <td style={{ color: 'var(--color-text-muted)' }}>{mod.descripcion_modulo || '-------'}</td>
                                <td style={{ color: 'var(--color-text-muted)' }}>{new Date(mod.fecha_crea_modulo).toLocaleDateString('es-ES')}</td>
                                {tienePermiso('modulos', 'Estados') && (
                                    <td>
                                        <select
                                            value={mod.estado_modulo}
                                            onChange={(e) => manejarCambioEstadoModulo(mod.id_modulo, e.target.value)}
                                            className={`select-estado-tabla ${mod.estado_modulo}`}
                                        >
                                            <option value="activo">Activo</option>
                                            <option value="inactivo">Inactivo</option>
                                        </select>
                                    </td>
                                )}
                                {(tienePermiso('modulos', 'Editar') || tienePermiso('modulos', 'Eliminar')) && (
                                    <td>
                                        <div className="acciones-tabla">
                                            {tienePermiso('modulos', 'Editar') && (
                                                <button className="btn-icono btn-icono-editar" onClick={() => abrirModalEditarPermiso(mod.id_modulo)}>
                                                    Editar
                                                </button>
                                            )}
                                            {tienePermiso('modulos', 'Eliminar') && (
                                                <button className="btn-icono btn-icono-eliminar" onClick={() => manejarEliminacionModulo(mod.id_modulo)}>
                                                    Eliminar
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {modulos.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '32px' }}>
                                    No hay modulos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {(tienePermiso('modulos', 'Crear') || tienePermiso('modulos', 'Editar')) && (
                <Modal
                    isOpen={modalAbiertoModulo}
                    onCancelar={cerrarModal}
                    titulo={idEditarModulo ? "Editar Modulo" : "Nuevo Modulo"}
                >
                    <FormularioModulos
                        id={idEditarModulo}
                        onGuardar={manejarGuardadoModulo}
                        onCancelar={cerrarModal}
                    />
                </Modal>
            )}
        </div>
    );
}
