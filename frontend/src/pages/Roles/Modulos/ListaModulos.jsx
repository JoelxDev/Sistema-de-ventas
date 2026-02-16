import { useState, useEffect } from "react"
import { obtenerModulos, eliminarModulo, actualizarEstadoModulo } from "../../../api/ApiRoles/ApiModulos/ApiModulos.jsx"
import { Modal } from "../../../components/Modal.jsx";
import { FormularioModulos } from './FormularioModulos.jsx'
import { useAutenticacion } from "../../../context/AutenticacionContext.jsx";


export function ListaModulos() {
    const [modulos, setModulos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const { tienePermiso } = useAutenticacion();

    const [modalAbiertoModulo, setModalAbiertoModulo] = useState(false);
    const [idEditarModulo, setIdEditarModulo] = useState(null);


    useEffect(()=>{
        cargarModulos();
    }, []);

    async function cargarModulos() {
        try{
            setCargando(true);
            const data =  await obtenerModulos()
            setModulos(data)
        }catch (err) {
            setError(err.message)
        }finally {
            setCargando(false)
        }
    }

    async function manejarEliminacionModulo(id) {
        if (confirm('Estas seguro de eliminar este modulo?')){
            try {
                await eliminarModulo(id);
                cargarModulos();
            } catch (err) {
                setError(err.message);
            }
        }
    }
    
    async function manejarCambioEstadoModulo(id, nuevoEstadoModulo) {
      try{
        await actualizarEstadoModulo(id, nuevoEstadoModulo);
        cargarModulos();
        setModulos(modulos.map(mod => {
          if(mod.id_modulo === id){
            return { ...mod, estado_modulo: nuevoEstadoModulo };
          }
          return mod;
        }));
      }catch(err){
        setError(err.message);
      }
    }

    function abrirModalCrearModulo() {
      setIdEditarModulo(null);
      setModalAbiertoModulo(true);
    }
    function abrirModalEditarPermiso(id) {
      setIdEditarModulo(id);
      setModalAbiertoModulo(true);
    }
    function cerrarModal(){
      setModalAbiertoModulo(false);
      setIdEditarModulo(null)
    }
    function manejarGuardadoModulo(){
      cerrarModal();
      cargarModulos();
    }



    if (cargando) return <p>Cargando modulos...</p>
    if (error) return <p>Error: {error}</p>

  return (
    <div>
        {tienePermiso('modulos', 'Crear') && (
          <button onClick={abrirModalCrearModulo}>Aniadir Modulo/Submodulo</button>
        )}
        <h1>Gestionar Modulos/Submodulos</h1>
        <table border="1" cellPadding="8" cellSpacing="0" style={{ marginTop: "15px", width: "100%" }}>
        <thead>
          <tr>
            <th>Modulo</th>
            <th>Descripcion</th>
            <th>Fecha creacion</th>
            {tienePermiso('modulos', 'Estados') && <th>Estado</th>}
            {(tienePermiso('modulos', 'Editar') || tienePermiso('modulos', 'Eliminar')) && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {modulos.map((mod) => (
            <tr key={mod.id_modulo}>
              <td>{mod.nombre_modulo}</td>
              <td>{mod.descripcion_modulo}</td>
              <td>{new Date(mod.fecha_crea_modulo).toLocaleDateString('es-ES')}</td>
              {tienePermiso('modulos', 'Estados') && (
                <td>
                <label>
                  <input 
                    type="radio" 
                    name={`estado-${mod.id_modulo}`}
                    checked={mod.estado_modulo === 'activo'}
                    onChange={() => manejarCambioEstadoModulo(mod.id_modulo, 'activo')}
                  />
                  Activo
                </label>
                <label>
                  <input 
                    type="radio" 
                    name={`estado-${mod.id_modulo}`}
                    checked={mod.estado_modulo === 'inactivo'}
                    onChange={() => manejarCambioEstadoModulo(mod.id_modulo, 'inactivo')}
                  />
                  Inactivo
                </label>
              </td>
              )}
            {(tienePermiso('modulos', 'Editar') || tienePermiso('modulos', 'Eliminar')) && (
              <td>
                {tienePermiso('modulos', 'Editar') && (
                  <button onClick={()=>abrirModalEditarPermiso(mod.id_modulo)}>Editar</button>
                )}
                {tienePermiso('modulos', 'Eliminar') && (
                  <button onClick={()=>manejarEliminacionModulo(mod.id_modulo)}>Eliminar</button>
                )}
              </td>
            )}
            </tr>
          ))}
        </tbody>
      </table>
          {/* Modal */}
          {(tienePermiso('modulos', 'Crear') || tienePermiso('modulos', 'Editar')) && (
            <Modal
            isOpen={ modalAbiertoModulo }
            onCancelar = { cerrarModal }
            titulo={idEditarModulo ? "Editar Modulos" : "Aniadir Modulo"}
            >
            <FormularioModulos
            id={ idEditarModulo }
            onGuardar={ manejarGuardadoModulo }
            onCancelar ={ cerrarModal }
            />
          </Modal>
          )}

    </div>
  )
}