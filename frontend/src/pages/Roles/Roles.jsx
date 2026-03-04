import { Link } from "react-router-dom";
import { Modal } from "../../components/Modal";
import { useState, useEffect } from "react";
import { FormularioRoles } from "./FormularioRoles";
import { obtenerRoles, eliminarRol, actualizarEstadoRol, actualizarRequireSucursal } from "../../api/ApiRoles/ApiRoles";
import { useAutenticacion } from "../../context/AutenticacionContext";
import { useToast } from "../../context/ToastContext";

export function Roles() {
  const [roles, setRoles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { tienePermiso } = useAutenticacion();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  const toast = useToast()

  useEffect(() => { cargarRoles(); }, []);

  async function cargarRoles() {
    try {
      setCargando(true);
      const data = await obtenerRoles();
      setRoles(data);
    } catch (err) { setError(err.message); }
    finally { setCargando(false); }
  }

  function abrirModalCrear() { setIdEditar(null); setModalAbierto(true); }
  function abrirModalEditarRol(id) { setIdEditar(id); setModalAbierto(true); }
  function cerrarModal() { setModalAbierto(false); setIdEditar(null); }
  function manejarGuardado() { cerrarModal(); cargarRoles(); toast.exito(idEditar ? "Rol actualizado correctamente" : "Rol creado correctamente", 6000) }

  async function manejarEliminacionRol(id) {
    if (confirm('¿Estás seguro de eliminar este rol?')) {
      try { await eliminarRol(id); cargarRoles(); toast.exito("Rol eliminado correctamente", 6000) }
      catch (err) { setError(err.message); toast.error(err.message, 6000)}
    }
  }

  async function manejarCambioEstadoRol(id, nuevoEstado) {
    try {
      await actualizarEstadoRol(id, nuevoEstado);
      setRoles(roles.map(r => r.id_rol === id ? { ...r, estado_rol: nuevoEstado } : r));
      toast.info("Se cambio el estado correctamente", 6000)
    } catch (err) { setError(err.message); toast.error(err.message, 6000)}
  }

  async function manejarRequiereSucursal(id, requireSucursal) {
    try { await actualizarRequireSucursal(id, requireSucursal); cargarRoles(); toast.info("Estado de requiere sucursal actualizado exitosamente", 6000) }
    catch (err) { setError(err.message); toast.error(err.message, 6000)}
  }

  if (cargando) return <div className="estado-cargando">⏳ Cargando roles...</div>;
  if (error)    return <div className="estado-error">⚠️ Error: {error}</div>;

  return (
    <div className="pagina">
      <div className="pagina-header">
        <h1 className="pagina-titulo">Gestión de Roles</h1>
        <div className="btn-grupo">
          {tienePermiso('permisos', 'Vista') && (
            <Link to="permisos" className="btn btn-neutro">🛡️ Permisos</Link>
          )}
          {tienePermiso('modulos', 'Vista') && (
            <Link to="modulos" className="btn btn-neutro">🗂️ Módulos</Link>
          )}
          {tienePermiso('roles', 'Crear') && (
            <button className="btn btn-primario" onClick={abrirModalCrear}>
              + Nuevo Rol
            </button>
          )}
        </div>
      </div>

      <div className="tabla-wrapper">
        <table className="tabla">
          <thead>
            <tr>
              <th>Rol</th>
              <th>Descripción</th>
              <th>Fecha creación</th>
              {tienePermiso('roles', 'Estados') && <th>Estado</th>}
              <th>Requiere Sucursal</th>
              {(tienePermiso('roles', 'Editar') || tienePermiso('roles', 'Eliminar')) && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {roles.map((rol) => (
              <tr key={rol.id_rol}>
                <td style={{ fontWeight: 600 }}>{rol.nombre_rol}</td>
                <td style={{ color: 'var(--color-text-muted)' }}>{rol.descripcion_rol || '—'}</td>
                <td style={{ color: 'var(--color-text-muted)' }}>{new Date(rol.fecha_crea_rol).toLocaleDateString('es-ES')}</td>
                {tienePermiso('roles', 'Estados') && (
                  <td>
                    <select
                      value={rol.estado_rol}
                      onChange={(e) => manejarCambioEstadoRol(rol.id_rol, e.target.value)}
                      className={`select-estado-tabla ${rol.estado_rol}`}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </td>
                )}
                <td>
                  <select
                    value={rol.requiere_sucursal}
                    onChange={(e) => manejarRequiereSucursal(rol.id_rol, e.target.value)}
                    className="select-estado-tabla"
                    style={{ borderColor: rol.requiere_sucursal === 'si' ? '#22c55e' : '#94a3b8' }}
                  >
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                  </select>
                </td>
                {(tienePermiso('roles', 'Editar') || tienePermiso('roles', 'Eliminar')) && (
                  <td>
                    <div className="acciones-tabla">
                      {tienePermiso('roles', 'Editar') && (
                        <button className="btn-icono btn-icono-editar" onClick={() => abrirModalEditarRol(rol.id_rol)}>
                          ✏️ Editar
                        </button>
                      )}
                      {tienePermiso('roles', 'Eliminar') && (
                        <button className="btn-icono btn-icono-eliminar" onClick={() => manejarEliminacionRol(rol.id_rol)}>
                          🗑️ Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {roles.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '32px' }}>
                  No hay roles registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(tienePermiso('roles', 'Crear') || tienePermiso('roles', 'Editar')) && (
        <Modal
          isOpen={modalAbierto}
          onCancelar={cerrarModal}
          titulo={idEditar ? "Editar Rol" : "Crear Rol"}
        >
          <FormularioRoles
            id={idEditar}
            onGuardar={manejarGuardado}
            onCancelar={cerrarModal}
          />
        </Modal>
      )}
    </div>
  );
}