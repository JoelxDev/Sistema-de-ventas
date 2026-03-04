import { useEffect, useState } from "react"
import { obtenerSucursales, eliminarSucursal, actualizarEstadoSucursal, obtenerSucursalPorId } from "../../api/ApiSucursales/ApiSucursales"
import { FormularioSucursal } from './FormularioSucursal'
import { Modal } from "../../components/Modal"
import { useAutenticacion } from "../../context/AutenticacionContext"
import { useToast } from "../../context/ToastContext"
import "../../css/PaginaSucursales.css"

export function PaginaSucursales() {

    const toast = useToast()
    const [sucursales, setSucursales] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    const [modalAbierto, setModalAbierto] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    const { tienePermiso } = useAutenticacion();

    useEffect(() => {
        cargarSucursales()
    }, []);

    async function cargarSucursales() {
        try {
            setCargando(true);
            const data = await obtenerSucursales();
            setSucursales(data);
        } catch (err) {
            setError(err.message);
            toast.error(err.message)
        } finally {
            setCargando(false);
        }
    }

    function abrirModalCrear() {
        setIdEditar(null);
        setModalAbierto(true);
    }
    function abrirModalEditar(id) {
        setIdEditar(id);
        setModalAbierto(true)
    }
    function cerrarModal() {
        setModalAbierto(false);
        setIdEditar(null);
    }
    function manejarGuardado() {
        cerrarModal();
        cargarSucursales();
        toast.exito( idEditar ? "Sucursal editada exitosamente" : "Sucursal creada exitosamente", 6000)

    }

    async function manejarEliminacion(id) {
        const sucursal = await obtenerSucursalPorId(id);
        if (sucursal.estado_suc === 'activo') {
            return alert('No se puede eliminar una sucursal ACTIVA. Cambia su estado a INACTIVO primero.');
        }
        if (sucursal.estado_suc !== 'activo') {
            try {
                if (confirm('¿Estas seguro de eliminar esta sucursal?')) {
                    try {
                        await eliminarSucursal(id);
                        cargarSucursales();
                        toast.exito("Sucursal eliminada exitosamente", 6000)
                    } catch (err) {
                        setError(err.message);
                        toast.error(err.message, 6000)
                    }
                }
            } catch (err) {
                setError(err.message);
                toast.error(err.message, 6000)
            }
        }

    }


    async function manejarCambioEstado(id, nuevoEstado) {
        try {
            await actualizarEstadoSucursal(id, nuevoEstado);
            cargarSucursales();
            toast.info("Se cambio el estado exitosamente", 6000)
            // setSucursales(sucursales.map(suc => {
            //     if (suc.id_sucursal === id) {
            //         return { ...suc, estado_suc: nuevoEstado };
            //     }
            //     return suc;
            // }));
        } catch (err) {
            setError(err.message);
            toast.error(err.message, 6000)
        }
    }

    if (cargando) return <p>Cargando sucursales...</p>
    if (error) return <p>Error...</p>

    return (
        <div className="pagina-sucursales">
            <div className="sucursales-header">
                <h1>Sucursales</h1>
                {tienePermiso && (
                    <button className="btn-crear" onClick={abrirModalCrear}>
                        + Nueva Sucursal
                    </button>
                )}
            </div>

            <div className="lista-sucursales">
                {sucursales.map((suc) => (
                    <div className="tarjeta-sucursal" key={suc.id_sucursal}>
                        <div className="tarjeta-nombre">
                            <h3>{suc.nombre_suc}</h3>
                        </div>

                        <div className="tarjeta-dato">
                            <span className="etiqueta">Ubicación:</span>
                            <span>{suc.ubicacion_suc || "Sin ubicación"}</span>
                        </div>

                        {/* <div className="tarjeta-dato">
                            <span className="etiqueta">Ciudad:</span>
                            <span>{suc.ciudad_suc || "Sin ciudad"}</span>
                        </div> */}

                        <div className="tarjeta-dato">
                            <span className="etiqueta">Estado:</span>
                            <select
                                value={suc.estado_suc}
                                onChange={(e) => manejarCambioEstado(suc.id_sucursal, e.target.value)}
                                className={`select-estado ${suc.estado_suc}`}
                            >
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                        </div>

                        <div className="tarjeta-acciones">
                            <button
                                className="btn-editar"
                                onClick={() => abrirModalEditar(suc.id_sucursal)}
                            >
                                ✏️ Modificar
                            </button>
                            <button
                                className="btn-eliminar"
                                onClick={() => manejarEliminacion(suc.id_sucursal)}
                            >
                                🗑️ Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {modalAbierto && (
                <Modal
                    isOpen={modalAbierto}
                    onClose={cerrarModal}
                    titulo={idEditar ? "Editar Sucursal" : "Agregar Sucursal"}
                >
                    <FormularioSucursal
                        idSucursal={idEditar}
                        onGuardar={manejarGuardado}
                        onCancelar={cerrarModal}
                    />
                </Modal>
            )}
        </div>
    )
}