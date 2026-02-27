import { useState, useEffect } from "react";
import { obtenerPermisos, eliminarPermiso, actualizarEstadoPermiso } from "../../../api/ApiRoles/ApiPermisos/ApiPermisos.jsx";
import { FormularioPermisos } from "./FormularioPermisos.jsx";
import { Modal } from "../../../components/Modal.jsx";
import { useAutenticacion } from "../../../context/AutenticacionContext.jsx";

export function ListaPermisos() {
  const { tienePermiso } = useAutenticacion();
  const [permisos, setPermisos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  useEffect(() => { cargarPermisos(); }, []);

  async function cargarPermisos() {
    try {
      setCargando(true);
      const data = await obtenerPermisos();
      setPermisos(data);
    } catch (err) { setError(err.message); }
    finally { setCargando(false); }
  }

  async function manejarCambioEstadoPermiso(id, nuevoEstado) {
    try {
      await actualizarEstadoPermiso(id, nuevoEstado);
      setPermisos(permisos.map(p => p.id_permiso === id ? { ...p, estado_perm: nuevoEstado } : p));
    } catch (err) { setError(err.message); }
  }

  async function manejarEliminacionPermiso(id) {
    if (confirm('¿Estás seguro de eliminar este permiso?')) {
      try { await eliminarPermiso(id); cargarPermisos(); }
      catch (err) { setError(err.message); }
    }
  }

  function abrirModalCrearPermiso() { setIdEditar(null); setModalAbierto(true); }
  function abrirModalEditarPermiso(id) { setIdEditar(id); setModalAbierto(true); }
  function cerrarModal() { setModalAbierto(false); setIdEditar(null); }
  function manejarGuardado() { cerrarModal(); cargarPermisos(); }

  if (cargando) return <div className="estado-cargando">⏳ Cargando permisos...</div>;
  if (error)    return <div className="estado-error">⚠️ Error: {error}</div>;

  return (
    <div className="pagina">
      <div className="pagina-header">
        <h1 className="pagina-titulo">Permisos</h1>
        {tienePermiso('permisos', 'Crear') && (
          <button className="btn btn-primario" onClick={abrirModalCrearPermiso}>
            + Nuevo Permiso
          </button>
        )}
      </div>

      <div className="tabla-wrapper">
        <table className="tabla">
          <thead>
            <tr>
              <th>Módulo</th>
              <th>Permiso</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Fecha creación</th>
              {(tienePermiso('permisos', 'Editar') || tienePermiso('permisos', 'Eliminar')) && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {permisos.map((perm) => (
              <tr key={perm.id_permiso}>
                <td><span className="badge" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>{perm.nombre_modulo}</span></td>
                <td style={{ fontWeight: 600 }}>{perm.nombre_perm}</td>
                <td style={{ color: 'var(--color-text-muted)' }}>{perm.descripcion_perm || '—'}</td>
                <td>
                  <select
                    value={perm.estado_perm}
                    onChange={(e) => manejarCambioEstadoPermiso(perm.id_permiso, e.target.value)}
                    className={`select-estado-tabla ${perm.estado_perm}`}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </td>
                <td style={{ color: 'var(--color-text-muted)' }}>{new Date(perm.fecha_crea_perm).toLocaleDateString('es-ES')}</td>
                {(tienePermiso('permisos', 'Editar') || tienePermiso('permisos', 'Eliminar')) && (
                  <td>
                    <div className="acciones-tabla">
                      {tienePermiso('permisos', 'Editar') && (
                        <button className="btn-icono btn-icono-editar" onClick={() => abrirModalEditarPermiso(perm.id_permiso)}>
                          ✏️ Editar
                        </button>
                      )}
                      {tienePermiso('permisos', 'Eliminar') && (
                        <button className="btn-icono btn-icono-eliminar" onClick={() => manejarEliminacionPermiso(perm.id_permiso)}>
                          🗑️ Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {permisos.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '32px' }}>
                  No hay permisos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalAbierto}
        onCancelar={cerrarModal}
        titulo={idEditar ? "Editar Permiso" : "Crear Permiso"}
      >
        <FormularioPermisos
          id={idEditar}
          onCancelar={cerrarModal}
          onGuardar={manejarGuardado}
        />
      </Modal>
    </div>
  );
}
