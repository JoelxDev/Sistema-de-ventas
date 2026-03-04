import { useState, useEffect, useMemo } from "react";
import { obtenerPermisos, eliminarPermiso, actualizarEstadoPermiso } from "../../../api/ApiRoles/ApiPermisos/ApiPermisos.jsx";
import { FormularioPermisos } from "./FormularioPermisos.jsx";
import { Modal } from "../../../components/Modal.jsx";
import { useAutenticacion } from "../../../context/AutenticacionContext.jsx";
import { useToast } from "../../../context/ToastContext.jsx";

export function ListaPermisos() {
  const { tienePermiso } = useAutenticacion();
  const [permisos, setPermisos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  const toast = useToast()

  useEffect(() => { cargarPermisos(); }, []);

  async function cargarPermisos() {
    try {
      setCargando(true);
      const data = await obtenerPermisos();
      setPermisos(data);
    } catch (err) { setError(err.message); toast.error(err.message, 6000) }
    finally { setCargando(false); }
  }

  async function manejarCambioEstadoPermiso(id, nuevoEstado) {
    try {
      await actualizarEstadoPermiso(id, nuevoEstado);
      setPermisos(permisos.map(p => p.id_permiso === id ? { ...p, estado_perm: nuevoEstado } : p));
      toast.info("Estado del permiso actualizado exitosamente", 6000)
    } catch (err) { setError(err.message); toast.error(err.message)}
  }

  async function manejarEliminacionPermiso(id) {
    if (confirm('¿Estás seguro de eliminar este permiso?')) {
      try { await eliminarPermiso(id); cargarPermisos(); toast.exito("Permiso eliminado exitosamente", 6000)}
      catch (err) { setError(err.message); toast.error(err.message, 6000)}
    }
  }

  function abrirModalCrearPermiso() { setIdEditar(null); setModalAbierto(true); }
  function abrirModalEditarPermiso(id) { setIdEditar(id); setModalAbierto(true); }
  function cerrarModal() { setModalAbierto(false); setIdEditar(null); }
  function manejarGuardado() { cerrarModal(); cargarPermisos(); toast.exito(idEditar ? "Permiso editado exitosamente" : "Permiso creado exitosamente", 6000)}

  const tieneAcciones = tienePermiso('permisos', 'Editar') || tienePermiso('permisos', 'Eliminar');
  const totalColumnas = tieneAcciones ? 5 : 4;

  const permisosAgrupados = useMemo(() => {
    const grupos = {};
    for (const perm of permisos) {
      const modulo = perm.nombre_modulo || 'Sin módulo';
      if (!grupos[modulo]) grupos[modulo] = [];
      grupos[modulo].push(perm);
    }
    return Object.entries(grupos).sort(([a], [b]) => a.localeCompare(b));
  }, [permisos]);

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
              <th>Permiso</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Fecha creación</th>
              {tieneAcciones && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {permisosAgrupados.map(([modulo, permisosDelModulo]) => (
              <>
                <tr key={`grupo-${modulo}`} className="fila-grupo-modulo">
                  <td colSpan={totalColumnas} style={{
                    background: 'var(--color-primary-light, #e8f0fe)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    padding: '10px 16px',
                    color: 'var(--color-primary-dark, #1a3b5c)',
                    letterSpacing: '0.02em',
                    borderLeft: '4px solid var(--color-primary, #3b82f6)'
                  }}>
                    📦 {modulo}
                    <span style={{
                      marginLeft: '10px',
                      fontWeight: 400,
                      fontSize: '0.82rem',
                      color: 'var(--color-text-muted, #6b7280)'
                    }}>
                      ({permisosDelModulo.length} {permisosDelModulo.length === 1 ? 'permiso' : 'permisos'})
                    </span>
                  </td>
                </tr>
                {permisosDelModulo.map((perm) => (
                  <tr key={perm.id_permiso}>
                    <td style={{ fontWeight: 600, paddingLeft: '28px' }}>{perm.nombre_perm}</td>
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
                    {tieneAcciones && (
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
              </>
            ))}
            {permisos.length === 0 && (
              <tr>
                <td colSpan={totalColumnas} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '32px' }}>
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
