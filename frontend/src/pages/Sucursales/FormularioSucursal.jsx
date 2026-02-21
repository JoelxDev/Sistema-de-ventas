import { useState, useEffect } from "react"
import { obtenerSucursalPorId, crearSucursal, actualizarSucursal} from "../../api/ApiSucursales/ApiSucursales"

export function FormularioSucursal({idSucursal, onGuardar, onCancelar}) {
    const [datosFormularioSucursales, setDatosFormularioSucursales] = useState({
        nombre_suc: '',
        ubicacion_suc: '',
    });

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (idSucursal) {
            cargarSucursal();
        }
    },[idSucursal]);
    
    async function cargarSucursal() {
        try{
            setCargando(true);
            const sucursalesData = await obtenerSucursalPorId(idSucursal);
            setDatosFormularioSucursales({
                nombre_suc: sucursalesData.nombre_suc,
                ubicacion_suc: sucursalesData.ubicacion_suc,
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }
    
    async function manejarCambio(e) {
        setDatosFormularioSucursales({
            ...datosFormularioSucursales,
            [e.target.name]: e.target.value,
        });
    }

    async function manejarEnvio(e) {
        e.preventDefault();
        setError(null);
        try{
            if (idSucursal) {
                await actualizarSucursal(idSucursal, datosFormularioSucursales);
            } else {
                await crearSucursal(datosFormularioSucursales);
                console.log("Sucursal creada con exito");
            } onGuardar();
        }catch (err) {
            setError(err.message);
        }
    }
    if (cargando) return <p>Cargando...</p>;
    
    return (
    <form onSubmit={manejarEnvio}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <div style={{ marginBottom: "15px" }}>
        <label>Nombre Sucursal</label><br />
        <input
          type="text"
          name="nombre_suc"
          value={datosFormularioSucursales.nombre_suc}
          onChange={manejarCambio}
          required
        />
      </div>
      
      <div style={{ marginBottom: "15px" }}>
        <label>Ubicacion</label><br />
        <input
          type="text"
          name="ubicacion_suc"
          value={datosFormularioSucursales.ubicacion_suc}
          onChange={manejarCambio}
          required
        />
      </div>
      
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button type="button" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit">
          {idSucursal ? "Guardar cambios" : "Aniador Modulo"}
        </button>
      </div>
    </form>
  )
}