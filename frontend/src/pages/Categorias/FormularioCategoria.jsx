import { useState, useEffect } from "react";
import { obtenerCategoriaPorId, actualizarCategoria, crearCategoria } from "../../api/ApiCategorias/ApiCategorias";


export function FormularioCategoria({idCategoria, onGuardar, onCancelar}) {
    const [datosFormularioCategoria, setdatosFormularioCategoria] = useState({
        nombre_categoria: '',
        descripcion_categoria: '',
    })

    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState(null);

    useEffect(()=>{
        if(idCategoria){
            cargarCategorias()
        }
    }, [idCategoria])

    async function cargarCategorias() {
        try{
            setCargando(true);
            const data = await obtenerCategoriaPorId(idCategoria)
            setdatosFormularioCategoria({
                nombre_categoria: data.nombre_categoria,
                descripcion_categoria: data.descripcion_categoria,
            })
        }catch(err){
            setError(err.message)
        } finally {
            setCargando(false)
        }
    }

    async function manejarCambio(e) {
        setdatosFormularioCategoria({
            ...datosFormularioCategoria,
            [e.target.name]: e.target.value
        })
    }

    async function manejarEnvio(e) {
        e.preventDefault();
        setError(null);
        try{
            if(idCategoria){
                await actualizarCategoria(idCategoria, datosFormularioCategoria)
            }else {
                await crearCategoria(datosFormularioCategoria)
            } onGuardar();
        }catch (err){
            setError(err.message)
        }
    }
    if(cargando) return <p>Cargando...</p>

    return(
        <form onSubmit={manejarEnvio}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <div style={{ marginBottom: "15px" }}>
        <label>Nombre Modulo</label><br />
        <input
          type="text"
          name="nombre_categoria"
          value={datosFormularioCategoria.nombre_categoria}
          onChange={manejarCambio}
          required
        />
      </div>
      
      <div style={{ marginBottom: "15px" }}>
        <label>Descripcion</label><br />
        <input
          type="text"
          name="descripcion_categoria"
          value={datosFormularioCategoria.descripcion_categoria}
          onChange={manejarCambio}
          required
        />
      </div>
      
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button type="button" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit">
          {idCategoria ? "Guardar cambios" : "Aniador Categoria"}
        </button>
      </div>
    </form>
    )

}