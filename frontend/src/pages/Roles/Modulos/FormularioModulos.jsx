import { useState, useEffect, use } from 'react'
import { obtenerModuloPorId, actualizarModulo, crearModulo  } from '../../../api/ApiRoles/ApiModulos/ApiModulos.jsx';


export function FormularioModulos({ id, onGuardar, onCancelar }) {
  const [datosFormularioModulos, setDatosFormularioModulos] = useState({
    nombre_modulo: '',
    descripcion_modulo: '',
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if(id){
      cargarModulos()
    }
  }, [id]);

  async function cargarModulos(){
    try {
      setCargando(true);
      const data = await obtenerModuloPorId(id);
      setDatosFormularioModulos({
        nombre_modulo: data.nombre_modulo,
        descripcion_modulo: data.descripcion_modulo,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function manejarCambio(e) {
    setDatosFormularioModulos({
      ...datosFormularioModulos,
      [e.target.name]: e.target.value,
    });
  }

  async function manejarEnvio(e) {
    e.preventDefault();
    setError(null);
    try {
      if (id) {
        await actualizarModulo(id, datosFormularioModulos);
      } else {
        await crearModulo(datosFormularioModulos);
      } onGuardar();
    } catch (err) {
      setError(err.message);
    }
    }
    if (cargando) return <p>Cargando...</p>;

  return (
    <form onSubmit={manejarEnvio}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <div style={{ marginBottom: "15px" }}>
        <label>Nombre Modulo</label><br />
        <input
          type="text"
          name="nombre_modulo"
          value={datosFormularioModulos.nombre_modulo}
          onChange={manejarCambio}
          required
        />
      </div>
      
      <div style={{ marginBottom: "15px" }}>
        <label>Descripcion</label><br />
        <input
          type="text"
          name="descripcion_modulo"
          value={datosFormularioModulos.descripcion_modulo}
          onChange={manejarCambio}
          required
        />
      </div>
      
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button type="button" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit">
          {id ? "Guardar cambios" : "Aniador Modulo"}
        </button>
      </div>
    </form>
  )
}