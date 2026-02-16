import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
import { obtenerPersonalPorId, crearPersonal, actualizarPersonal } from '../../api/ApiUsuarios/ApiUsuarios';
import { obtenerRoles } from '../../api/ApiRoles/ApiRoles';

export function FormularioUsuarioModal({id, onGuardar, onCancelar}) {
    const [datosFormulario, setDatosFormulario] = useState({
        nombre_per: "",
        apellido_per: "",
        dni_per: "",
        telefono_per: "",
        correo_elect_per: "",
        roles_id_rol: "",
    });

    const [roles, setRoles] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => { 
        cargarRoles();
        if (id) {
            cargarPersonal();
        }
    }, [id]);

    async function cargarRoles() {
        try {
            const rolesData = await obtenerRoles();
            const rolesActivos = rolesData.filter(rol => rol.estado_rol === 'activo');
            setRoles(rolesActivos);
        } catch (err) {
            setError(err.message);
        }
    }

    async function cargarPersonal() {
        try {
            setCargando(true);
            const data = await obtenerPersonalPorId(id);
            setDatosFormulario({
                nombre_per: data.nombre_per,
                apellido_per: data.apellido_per,
                dni_per: data.dni_per,
                telefono_per: data.telefono_per,
                correo_elect_per: data.correo_elect_per,
                roles_id_rol: data.roles_id_rol,
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }

    async function manejarCambio(e) {
        setDatosFormulario({
            ...datosFormulario,
            [e.target.name]: e.target.value,
        });
    }

    async function manejarEnvio(e) {
        e.preventDefault();
        setError(null);

         try {
            if (id) {
                await actualizarPersonal(id, datosFormulario);
            } else {
                await crearPersonal(datosFormulario);
            }
            onGuardar();
        }catch (err) {
            setError(err.message);
        }
    }

    if (cargando) return <p>Cargando...</p>;
    
    return (
    <form onSubmit={manejarEnvio}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <div style={{ marginBottom: "15px" }}>
        <label>Nombre</label><br />
        <input
          type="text"
          name="nombre_per"
          value={datosFormulario.nombre_per}
          onChange={manejarCambio}
          required
        />
      </div>
      
      <div style={{ marginBottom: "15px" }}>
        <label>Apellido</label><br />
        <input
          type="text"
          name="apellido_per"
          value={datosFormulario.apellido_per}
          onChange={manejarCambio}
          required
        />
      </div>
      
      <div style={{ marginBottom: "15px" }}>
        <label>DNI</label><br />
        <input
          type="text"
          name="dni_per"
          value={datosFormulario.dni_per}
          onChange={manejarCambio}
          required
        />
      </div>
      
      <div style={{ marginBottom: "15px" }}>
        <label>Teléfono</label><br />
        <input
          type="text"
          name="telefono_per"
          value={datosFormulario.telefono_per}
          onChange={manejarCambio}
          required
        />
      </div>
      
      <div style={{ marginBottom: "15px" }}>
        <label>Correo electrónico</label><br />
        <input
          type="email"
          name="correo_elect_per"
          value={datosFormulario.correo_elect_per}
          onChange={manejarCambio}
          required
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="">Rol/Cargo</label> <br />
        <select 
            name="roles_id_rol"
            value={datosFormulario.roles_id_rol} 
            onChange={manejarCambio}
            required
            >
                <option value="">---Seleccionar rol---</option>
                {roles.map((rol) => (
                  <option key={rol.id_rol} value={rol.id_rol}>
                    {rol.nombre_rol}
                  </option>
                ))}
        </select>
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button type="button" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit">
          {id ? "Guardar cambios" : "Crear usuario"}
        </button>
      </div>
    </form>
  );
}