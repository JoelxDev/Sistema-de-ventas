import { Link, Routes } from "react-router-dom"; 
import { Modal } from "../../components/Modal";
import { useState, useEffect } from "react";
import { FormularioRoles } from "./FormularioRoles";
import { obtenerRoles, eliminarRol, actualizarEstadoRol } from "../../api/ApiRoles/ApiRoles";
import { useAutenticacion } from "../../context/AutenticacionContext";


export function Roles() {

  const [roles, setRoles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const { tienePermiso } = useAutenticacion();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  useEffect(() => {
    cargarRoles();
  }, []);

  async function cargarRoles() {
    try {
      setCargando(true);
      const data = await obtenerRoles();
      setRoles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  function abrirModalCrear() {
    setIdEditar(null);
    setModalAbierto(true);
  }

  function abrirModalEditarRol(id) {
    setIdEditar(id);
    setModalAbierto(true);
  }
  function cerrarModal() {
    setModalAbierto(false);
    setIdEditar(null);
  }
  function manejarGuardado() {
    cerrarModal();
    cargarRoles();
  }

  async function manejarEliminacionRol(id) {
    if (confirm('¿Estas seguro de eliminar este rol?')) {
      try {
        await eliminarRol(id);
        cargarRoles();
      } catch (err) {
        setError(err.message);
      }
    }
  }

  async function manejarCambioEstadoRol(id, nuevoEstado) {
    try {
      await actualizarEstadoRol(id, nuevoEstado);
      cargarRoles();
      setRoles(roles.map(rol =>{
        if(rol.id_rol === id){
          return {...rol, estado_rol: nuevoEstado};
        }
        return rol;
      }));
    } catch (err) {
      setError(err.message);
    }
  }

    if (cargando) return <div>Cargando...</div>;
    if (error) return <div>Error...</div>;
  


  return (
    <div>
      <h1>Gestión de Roles</h1>

      {tienePermiso('permisos', 'Vista') && (
        <button><Link to={`permisos`}>Gestionar Permisos</Link></button>
      )}
      {tienePermiso('modulos', 'Vista') && (
        <button><Link to={`modulos`}>Gestionar Modulos</Link></button>
      )}
      {tienePermiso('roles', 'Crear') && (
        <button onClick={abrirModalCrear} >Crear Roll</button>
      )}


      <table border="1" cellPadding="8" cellSpacing="0" style={{ marginTop: "15px", width: "100%" }}>
        <thead>
          <tr>
            <th>Rol</th>
            <th>Descripcion</th>
            <th>Fecha creacion</th>
            {tienePermiso('roles', 'Estados') && <th>Estado</th>}
            {(tienePermiso('roles', 'Editar') || tienePermiso('roles', 'Eliminar')) && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {roles.map((rol) => (
            <tr key={rol.id_rol}>
              <td>{rol.nombre_rol}</td>
              <td>{rol.descripcion_rol}</td>
              <td>{new Date(rol.fecha_crea_rol).toLocaleDateString('es-ES')}</td>
              {tienePermiso('roles', 'Estados') && (
                <td>
                <label>
                  <input 
                    type="radio" 
                    name={`estado-${rol.id_rol}`}
                    checked={rol.estado_rol === 'activo'}
                    onChange={() => manejarCambioEstadoRol(rol.id_rol, 'activo')}
                  />
                  Activo
                </label>
                <label>
                  <input 
                    type="radio" 
                    name={`estado-${rol.id_rol}`}
                    checked={rol.estado_rol === 'inactivo'}
                    onChange={() => manejarCambioEstadoRol(rol.id_rol, 'inactivo')}
                  />
                  Inactivo
                </label>
              </td>
              )}
              {(tienePermiso('roles', 'Editar')|| tienePermiso('roles', 'Eliminar')) && (
                <td>
                  {tienePermiso('roles', 'Editar') && (
                    <button onClick={()=>abrirModalEditarRol(rol.id_rol)}>Editar</button>
                  )}
                  {tienePermiso('roles', 'Eliminar') && (
                    <button onClick={()=>manejarEliminacionRol(rol.id_rol)}>Eliminar</button>
                  )}
              </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}

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