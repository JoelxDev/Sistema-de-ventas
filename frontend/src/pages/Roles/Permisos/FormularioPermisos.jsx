import { useState, useEffect } from "react";
import { obtenerPermisoPorId, crearPermiso, actualizarPermiso } from "../../../api/ApiRoles/ApiPermisos/ApiPermisos";
import { obtenerModulos } from "../../../api/ApiRoles/ApiModulos/ApiModulos";

export function FormularioPermisos({id, onGuardar, onCancelar}) {
    const [datosFormularioPermisos, setDatosFormularioPermisos] = useState({
        nombre_perm: "",
        descripcion_perm: "",
        modulos_id_modulo: "",
    });

    const [modulos, setModulos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarModulos();
        if (id) {
            cargarPermiso();
        }
    }, [id]);

    async function cargarModulos() {
        try {
            const modulosData = await obtenerModulos();
            const modulosActivos = modulosData.filter(mod => mod.estado_modulo === 'activo');
            setModulos(modulosActivos);
        } catch (err) {
            setError(err.message);
        }
    }

    async function cargarPermiso() {
        try {
            setCargando(true);
            const data = await obtenerPermisoPorId(id);
            setDatosFormularioPermisos({
                nombre_perm: data.nombre_perm,
                descripcion_perm: data.descripcion_perm,
                modulos_id_modulo: data.modulos_id_modulo,
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }
    function manejarCambio(e) {
        setDatosFormularioPermisos({
            ...datosFormularioPermisos,
            [e.target.name]: e.target.value,
        });
    }


    async function manejarEnvio(e) {
        e.preventDefault();
        setError(null);
        try { 
            if (id) {
                await actualizarPermiso(id, datosFormularioPermisos);
            } else {
                await crearPermiso(datosFormularioPermisos);
            }
            onGuardar();
        }catch (err) {
            setError(err.message);
        }
    }



    if (cargando) return <p>Cargando...</p>;

    return(
        <form onSubmit={manejarEnvio}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <div style={{ marginBottom: "15px" }}>
        <label>Nombre Permiso</label><br />
        <select 
            name="nombre_perm" 
            value={datosFormularioPermisos.nombre_perm}
            onChange={manejarCambio}
            required
            >
                <option value="">---Seleccionar permiso---</option>
                <option value="Crear">Crear</option>
                <option value="Editar">Editar</option>
                <option value="Eliminar">Eliminar</option>
                <option value="Vista">Vista</option>
                <option value="Estados">Estados</option>
        </select>
        {/* <input
          type="text"
          name="nombre_perm"
          value={datosFormularioPermisos.nombre_perm}
          onChange={manejarCambio}
          required
        /> */}
      </div>
      
      <div style={{ marginBottom: "15px" }}>
        <label>Descripcion</label><br />
        <input
          type="text"
          name="descripcion_perm"
          value={datosFormularioPermisos.descripcion_perm}
          onChange={manejarCambio}
          required
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Modulo Asociado</label><br />
        <select 
            name="modulos_id_modulo" 
            value={datosFormularioPermisos.modulos_id_modulo} 
            onChange={manejarCambio} 
            required
            >
                <option value="">---Seleccionar modulo---</option>
                {modulos.map((modulo) => (
                    <option key={modulo.id_modulo} value={modulo.id_modulo}>
                        {modulo.nombre_modulo}
                    </option>
                ))}
        </select>
      </div>
      
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button type="button" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit">
          {id ? "Guardar cambios" : "Crear permiso"}
        </button>
      </div>
    </form>
    )
}