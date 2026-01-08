import { data, Link } from "react-router-dom";
import { obtenerPersonalPorId } from "../../api/ApiUsuarios/ApiUsuarios";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";



export function DetallesUsuario() {
  const [personal, setPersonal] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  // const navegar = useNavigate();

  useEffect(() => {
    cargarPersonal();
  }, [id]);

  async function cargarPersonal() {
    try {
      setCargando(true);
      const data = await obtenerPersonalPorId(id);
      setPersonal(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>Error...</p>;
  if (!personal) return <p>No se encontró el personal.</p>;

  return (
    <div>
      <h1>Detalles del Usuario</h1>

      <table border="1" cellPadding="8" cellSpacing="0" style={{ marginTop: "15px" }}>
        <tbody>
          <tr>
            <th>Nombre</th>
            <td>{personal.nombre_per}</td>
          </tr>
          <tr>
            <th>Apellido</th>
            <td>{personal.apellido_per}</td>
          </tr>
          <tr>
            <th>DNI</th>
            <td>{personal.dni_per}</td>
          </tr>
          <tr>
            <th>Teléfono</th>
            <td>{personal.telefono_per}</td>
          </tr>
          <tr>
            <th>Correo electrónico</th>
            <td>{personal.correo_elect_per}</td>
          </tr>
          <tr>
            <th>Fecha creación</th>
            <td>{new Date(personal.fecha_crea_per).toLocaleDateString('es-ES')}</td>
          </tr>
        </tbody>
      </table>

      <br />
      
      <button><Link to={`/usuarios/${id}/editar`}>Editar</Link></button>{" | "}
      <button><Link to="/usuarios">Volver</Link></button>
    </div>
  );
}