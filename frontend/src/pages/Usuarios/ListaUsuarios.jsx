import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { obtenerPersonal, eliminarPersonalUsuario, actualizarEstadoUsuario } from '../../api/ApiUsuarios/ApiUsuarios'

export function ListaUsuarios() {
  const [personal, setPersonal] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarPersonal()
  }, []);

  async function cargarPersonal() {
    try {
      setCargando(true);
      const data = await obtenerPersonal();
      setPersonal(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false)
    }
  }

  async function manejarEliminacion(id) {
    if (confirm('¿Estas seguro de eliminar este usuario?')) {
      try {
        await eliminarPersonalUsuario(id);
        cargarPersonal();
      } catch (err) {
        setError(err.message);
      }
    }
  }

  async function manejarCambioEstado(id, nuevoEstado) {
    try {
      await actualizarEstadoUsuario(id, nuevoEstado);
      cargarPersonal();
      setPersonal(personal.map(per => {
        if (per.id_personal === id) {
          return { ...per, estado_usuario: nuevoEstado };
        }
        return per;
      }));
    } catch (err) {
      setError(err.message);
    }
  }

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>Error...</p>;

  return (
    <>
      <h1>Usuarios</h1>

      {/* Botón crear */}
      <button><Link to="/usuarios/crear">Crear usuario</Link></button>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ marginTop: "15px", width: "100%" }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Telefono</th>
            <th>Correo electronico</th>
            <th>Fecha creacion</th>
            <th>Usuario</th>
            {/* <th>Rol</th> */}
            <th>Acciones</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {personal.map((per) => (
            <tr key={per.id_personal}>
              <td>{per.nombre_per}</td>
              <td>{per.apellido_per}</td>
              <td>{per.dni_per}</td>
              <td>{per.telefono_per}</td>
              <td>{per.correo_elect_per}</td>
              <td>
                {new Date(per.fecha_crea_per).toLocaleDateString('es-ES')}
              </td>
              <td>{per.nombre_usuario}</td>
              <td>
                {/* <button><Link to={`/usuarios/${per.id_personal}/detalles`}>Detalles</Link></button>{" | "} */}
                <button><Link to={`/usuarios/${per.id_personal}/editar`}>Editar</Link> </button>{" | "}
                <button onClick={() => manejarEliminacion(per.id_personal)}>Eliminar</button>
              </td>
              <td>
                <label>
                  <input 
                    type="radio" 
                    name={`estado-${per.id_personal}`}
                    checked={per.estado_usuario === 'activo'}
                    onChange={() => manejarCambioEstado(per.id_personal, 'activo')}
                  />
                  Activo
                </label>
                <label>
                  <input 
                    type="radio" 
                    name={`estado-${per.id_personal}`}
                    checked={per.estado_usuario === 'inactivo'}
                    onChange={() => manejarCambioEstado(per.id_personal, 'inactivo')}
                  />
                  Inactivo
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}