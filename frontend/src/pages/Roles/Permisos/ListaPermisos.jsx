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

  useEffect(() => {
    cargarPermisos();
  }, []);

  async function cargarPermisos() {
    try{
      setCargando(true);
      const data = await obtenerPermisos();
      setPermisos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function manejarCambioEstadoPermiso(id, nuevoEstadoPermiso) {
    try{
      await actualizarEstadoPermiso(id, nuevoEstadoPermiso);
      cargarPermisos();
      setPermisos(permisos.map(perm => {
        if(perm.id_permiso === id){
          return { ...perm, estado_perm: nuevoEstadoPermiso };
        }
        return perm;
      }));
    }catch(err){
      setError(err.message);
    }
  }

  async function manejarEliminacionPermiso(id) {
    if (confirm('¿Estas seguro de eliminar este permiso?')) {
      try {
        await eliminarPermiso(id);
        cargarPermisos();
      } catch (err) {
        setError(err.message);
      }
    }
  }

  function abrirModalCrearPermiso() {
    setIdEditar(null);
    setModalAbierto(true);
  }

  function abrirModalEditarPermiso(id) {
    setIdEditar(id);
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setIdEditar(null);
  }

  function manejarGuardado() {
    cerrarModal();
    cargarPermisos();
  }

  if (cargando) return <p>Cargando permisos...</p>;
  if (error) return <p>Error: {error}</p>;


  return (

    <div>
      <h1>Gestionar Permisos</h1>

      {tienePermiso('permisos', 'Crear') && (
        <button onClick={abrirModalCrearPermiso}>Crear Permiso</button>
      )}
      
      <table border="1" cellPadding="8" cellSpacing="0" style={{ marginTop: "15px", width: "100%" }}>
        <thead>
          <tr>
            <th>Modulo</th>
            <th>Permiso</th>
            <th>Descripcion</th>
            <th>Estado</th>
            <th>Fecha creacion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {permisos.map((perm) => (
            <tr key={perm.id_permiso}>
              <td>{perm.nombre_modulo}</td>
              <td>{perm.nombre_perm}</td>
              <td>{perm.descripcion_perm}</td>
              <td>
                <label>
                  <input 
                    type="radio" 
                    name={`estado-${perm.id_permiso}`}
                    checked={perm.estado_perm === 'activo'}
                    onChange={() => manejarCambioEstadoPermiso(perm.id_permiso, 'activo')}
                  />
                  Activo
                </label>
                <label>
                  <input 
                    type="radio" 
                    name={`estado-${perm.id_permiso}`}
                    checked={perm.estado_perm === 'inactivo'}
                    onChange={() => manejarCambioEstadoPermiso(perm.id_permiso, 'inactivo')}
                  />
                  Inactivo
                </label>
              </td>
              <td>{new Date(perm.fecha_crea_perm).toLocaleDateString('es-ES')}</td>
              <td>
                <button onClick={()=>abrirModalEditarPermiso(perm.id_permiso)}>Editar</button>{" | "}
                <button onClick={()=>manejarEliminacionPermiso(perm.id_permiso)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal */}
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