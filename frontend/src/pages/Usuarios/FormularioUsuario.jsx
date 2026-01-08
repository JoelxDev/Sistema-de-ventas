import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerPersonalPorId, crearPersonal, actualizarPersonal } from "../../api/ApiUsuarios/ApiUsuarios";

export function FormularioUsuario() {
  const { id } = useParams();
  const navegar = useNavigate();

  const [datosFormulario, setDatosFormulario] = useState({
    nombre_per: "",
    apellido_per: "",
    dni_per: "",
    telefono_per: "",
    correo_elect_per: "",
  })

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Cargar detos si es edicion
  useEffect(() => {
    if (id) {
      // Vendran del backend
      cargarPersonal()
    }
  }, [id]);

  async function cargarPersonal(){
    try{
      setCargando(true);
      const personal = await obtenerPersonalPorId(id);
      setDatosFormulario({
        nombre_per: personal.nombre_per,
        apellido_per: personal.apellido_per,
        dni_per: personal.dni_per,
        telefono_per: personal.telefono_per,
        correo_elect_per: personal.correo_elect_per,
      });
    } catch(err) {
      setError(err.message);
    } finally{
      setCargando(false)
    }
  }

  function manejarCambio(e) {
    setDatosFormulario({
      ...datosFormulario,
      [e.target.name]: e.target.value,
    });
  }

  async function manejarEnvio(e) {
    e.preventDefault();
    setError(null)

    try{
      if (id){
        await actualizarPersonal(id, datosFormulario);
      } else {
        await crearPersonal(datosFormulario);
      }
      navegar("/usuarios");
    }catch (err) {
      setError(err.message);
    }
  }

  if (cargando) return <p>Cargando...</p>;

  return (
    <div>
      <h2>{id ? "Editar usuario" : "Crear usuario"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={manejarEnvio}>
        <div>
          <label>Nombre</label><br />
          <input
            type="text"
            name="nombre_per"
            value={datosFormulario.nombre_per}
            onChange={manejarCambio}
            required
          />
        </div>
        <div>
          <label>Apellido</label><br />
          <input
            type="text"
            name="apellido_per"
            value={datosFormulario.apellido_per}
            onChange={manejarCambio}
            required
          />
        </div>
        <div>
          <label>DNI</label><br />
          <input
            type="number"
            name="dni_per"
            maxLength={"10"}
            value={datosFormulario.dni_per}
            onChange={manejarCambio}
            required
          />
        </div>
        <div>
          <label>Telefono</label><br />
          <input
            type="number"
            name="telefono_per"
            maxLength={9}
            value={datosFormulario.telefono_per}
            onChange={manejarCambio}
            required
          />
        </div>
        <div>
          <label>Correo</label><br />
          <input
            type="email"
            name="correo_elect_per"
            value={datosFormulario.correo_elect_per}
            onChange={manejarCambio}
            required
          />
        </div>

        <br />

        <button type="submit">
          {id ? "Guardar cambios" : "Crear usuario"} 
        </button> <br />
        <button type="button" onClick={() => navegar("/usuarios")}>
          Cancelar
        </button>
      </form>
    </div>
  );

}
