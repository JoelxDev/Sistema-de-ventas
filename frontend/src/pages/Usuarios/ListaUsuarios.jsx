import { useState, useEffect } from 'react';
import { obtenerPersonal, eliminarPersonalUsuario, actualizarEstadoUsuario } from '../../api/ApiUsuarios/ApiUsuarios'
import { FormularioUsuarioModal } from './FormularioUsuarioModal';
import { Modal } from '../../components/Modal';
import { useAutenticacion } from '../../context/AutenticacionContext';

export function ListaUsuarios() {
  const [personal, setPersonal] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  const { tienePermiso } = useAutenticacion();

  useEffect(() => { cargarPersonal(); }, []);

  async function cargarPersonal() {
    try {
      setCargando(true);
      const data = await obtenerPersonal();
      setPersonal(data);
    } catch (err) { setError(err.message); }
    finally { setCargando(false); }
  }

  function abrirModalCrear() { setIdEditar(null); setModalAbierto(true); }
  function abrirModalEditar(id) { setIdEditar(id); setModalAbierto(true); }
  function cerrarModal() { setModalAbierto(false); setIdEditar(null); }
  function manejarGuardado() { cerrarModal(); cargarPersonal(); }

  async function manejarEliminacion(id) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      try { await eliminarPersonalUsuario(id); cargarPersonal(); }
      catch (err) { setError(err.message); }
    }
  }

  async function manejarCambioEstado(id, nuevoEstado) {
    try {
      await actualizarEstadoUsuario(id, nuevoEstado);
      setPersonal(personal.map(p => p.id_personal === id ? { ...p, estado_usuario: nuevoEstado } : p));
    } catch (err) { setError(err.message); }
  }

  if (cargando) return <div className="estado-cargando">⏳ Cargando usuarios...</div>;
  if (error)    return <div className="estado-error">⚠️ Error: {error}</div>;

  return (
    <div className="pagina">
      <div className="pagina-header">
        <h1 className="pagina-titulo">Usuarios</h1>
        {tienePermiso('usuarios', 'Crear') && (
          <button className="btn btn-primario" onClick={abrirModalCrear}>
            + Nuevo Usuario
          </button>
        )}
      </div>

      <div className="tabla-wrapper">
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>DNI</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Fecha creación</th>
              <th>Usuario</th>
              <th>Rol</th>
              {tienePermiso('usuarios', 'Estados') && <th>Estado</th>}
              {(tienePermiso('usuarios', 'Editar') || tienePermiso('usuarios', 'Eliminar')) && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {personal.map((per) => (
              <tr key={per.id_personal}>
                <td style={{ fontWeight: 600 }}>{per.nombre_per}</td>
                <td>{per.apellido_per}</td>
                <td style={{ color: 'var(--color-text-muted)' }}>{per.dni_per}</td>
                <td style={{ color: 'var(--color-text-muted)' }}>{per.telefono_per}</td>
                <td style={{ color: 'var(--color-text-muted)' }}>{per.correo_elect_per}</td>
                <td style={{ color: 'var(--color-text-muted)' }}>{new Date(per.fecha_crea_per).toLocaleDateString('es-ES')}</td>
                <td>{per.nombre_usuario}</td>
                <td><span className="badge" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>{per.nombre_rol}</span></td>
                {tienePermiso('usuarios', 'Estados') && (
                  <td>
                    <select
                      value={per.estado_usuario}
                      onChange={(e) => manejarCambioEstado(per.id_personal, e.target.value)}
                      className={`select-estado-tabla ${per.estado_usuario}`}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </td>
                )}
                {(tienePermiso('usuarios', 'Editar') || tienePermiso('usuarios', 'Eliminar')) && (
                  <td>
                    <div className="acciones-tabla">
                      {tienePermiso('usuarios', 'Editar') && (
                        <button className="btn-icono btn-icono-editar" onClick={() => abrirModalEditar(per.id_personal)}>
                          ✏️ Editar
                        </button>
                      )}
                      {tienePermiso('usuarios', 'Eliminar') && (
                        <button className="btn-icono btn-icono-eliminar" onClick={() => manejarEliminacion(per.id_personal)}>
                          🗑️ Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {personal.length === 0 && (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '32px' }}>
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(tienePermiso('usuarios', 'Crear') || tienePermiso('usuarios', 'Editar')) && (
        <Modal
          isOpen={modalAbierto}
          onCancelar={cerrarModal}
          titulo={idEditar ? "Editar Usuario" : "Crear Usuario"}
        >
          <FormularioUsuarioModal
            id={idEditar}
            onGuardar={manejarGuardado}
            onCancelar={cerrarModal}
          />
        </Modal>
      )}
    </div>
  );
}