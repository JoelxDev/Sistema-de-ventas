import { useState, useEffect } from "react";
import { obtenerRolPorId, crearRol, actualizarRol } from "../../api/ApiRoles/ApiRoles";
import { obtenerPermisos } from "../../api/ApiRoles/ApiPermisos/ApiPermisos";
import { obtenerModulos } from "../../api/ApiRoles/ApiModulos/ApiModulos";

export function FormularioRoles({ id, onGuardar, onCancelar }) {

    const [datosFormularioRoles, setDatosFormularioRoles] = useState({
        nombre_rol: "",
        descripcion_rol: "",
    });

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [modulos, setModulos] = useState([]);
    const [permisos, setPermisos] = useState([]);

    // Estado para los módulos seleccionados (checkboxes de módulos)
    const [modulosSeleccionados, setModulosSeleccionados] = useState([]);
    // Estado para los permisos seleccionados (checkboxes de permisos)
    const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);

    useEffect(() => {
        cargarDatos();
    },[]);

    useEffect(() => {
        if (id && permisos.length > 0) {
            cargarRol();
        }
    }, [id, permisos]);

    async function cargarDatos() {
        try {
            const [modulosData, permisosData] = await Promise.all([
                obtenerModulos(),
                obtenerPermisos()
            ]);

            const modulosActivos = modulosData.filter(m => m.estado_modulo === 'activo')
            const permisosActivos = permisosData.filter(p => p.estado_perm === 'activo')

            setModulos(modulosActivos)
            setPermisos(permisosActivos)

        } catch (err) {
            setError(err.message)
        }
    }

    async function cargarRol() {
        try {
            setCargando(true);
            const data = await obtenerRolPorId(id);
            setDatosFormularioRoles({
                nombre_rol: data.nombre_rol,
                descripcion_rol: data.descripcion_rol,
            });

            // Cargar permisos seleccionados 
            if (data.permisos && data.permisos.length > 0) {
                setPermisosSeleccionados(data.permisos);
                // Determinar que modulo deben estar seleccionados
                // (los que tienen al menis un permiso seleccionado)
                const modulosConPermisos = permisos
                    .filter(p => data.permisos.includes(p.id_permiso))
                    .map(p => p.modulos_id_modulo);
                
                // Eliminar duplicados
                const modulosUnicos = [...new Set(modulosConPermisos)];
                setModulosSeleccionados(modulosUnicos);
            }
            
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }

    async function manejarCambio(e) {
        setDatosFormularioRoles({
            ...datosFormularioRoles,
            [e.target.name]: e.target.value,
        });
    }

    // Maneja seleccion de modulos
    function manejarCambioModulo(idModulo) {
        if (modulosSeleccionados.includes(idModulo)) {
            // Deseleccionar mosulos y sus permisos
            setModulosSeleccionados(modulosSeleccionados.filter(id => id !== idModulo));
            // Quitar permisos de ese modulo
            const permisosDelModulo = permisos
                .filter(p => p.modulos_id_modulo === idModulo)
                .map(p => p.id_permiso);
            setPermisosSeleccionados(permisosSeleccionados.filter(id => !permisosDelModulo.includes(id)));
        } else {
            setModulosSeleccionados([...modulosSeleccionados, idModulo])
        }
    }
    // Manejar seleccion de permisos
    function manejarCmabioPermisos(idPermiso) {
        if (permisosSeleccionados.includes(idPermiso)) {
            setPermisosSeleccionados(permisosSeleccionados.filter(id => id !== idPermiso));
        } else {
            setPermisosSeleccionados([...permisosSeleccionados, idPermiso]);
        }
    }

    function obtenerPermisosDeModulo(idModulo) {
        return permisos.filter(p => p.modulos_id_modulo === idModulo);
    }


    async function manejarEnvio(e) {
        e.preventDefault();
        setError(null);
        try {
            const datosEnviar = {
                ...datosFormularioRoles,
                permisos: permisosSeleccionados, // Array de IDs de permisos
            };
            if (id) {
                await actualizarRol(id, datosEnviar);
            } else {
                await crearRol(datosEnviar);
            }
            onGuardar();
        } catch (err) {
            setError(err.message);
        }
    }

    if (cargando) return <p>Cargando...</p>;
    if (error) return <p>Error...</p>;

    return (
        <form onSubmit={manejarEnvio}>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div style={{ marginBottom: "15px" }}>
                <label>Rol</label><br />
                <input
                    type="text"
                    name="nombre_rol"
                    value={datosFormularioRoles.nombre_rol}
                    onChange={manejarCambio}
                    required
                />
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label>Descripcion</label><br />
                <input
                    type="text"
                    name="descripcion_rol"
                    value={datosFormularioRoles.descripcion_rol}
                    onChange={manejarCambio}
                    required
                />
            </div>
            {/* Tabla de Modulos y Permisos */}
            <div style={{ marginBottom: "15px" }}>
                <label>Asignar Permisos</label><br />
                <table border="1" cellPadding="8" cellSpacing="0" style={{ marginTop: "15px", width: "100%" }}>
                    <thead>
                        <tr>
                            <th>Módulo</th>
                            <th>Permisos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {modulos.map(modulo => (
                            <tr key={modulo.id_modulo}>
                                {/* Columana Modulos con chekbox */}
                                <td>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={modulosSeleccionados.includes(modulo.id_modulo)}
                                            onChange={() => manejarCambioModulo(modulo.id_modulo)}
                                        />
                                        {" "}{modulo.nombre_modulo}
                                    </label>
                                </td>
                                {/* Columa Permisos con checkboxes */}
                                <td>
                                    {modulosSeleccionados.includes(modulo.id_modulo) ? (
                                        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                                            {obtenerPermisosDeModulo(modulo.id_modulo).map(permiso => (
                                                <label key={permiso.id_permiso}>
                                                    <input
                                                        type="checkbox"
                                                        checked={permisosSeleccionados.includes(permiso.id_permiso)}
                                                        onChange={() => manejarCmabioPermisos(permiso.id_permiso)}
                                            />
                                                    {" "}{permiso.nombre_perm}
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <span style={{ color: "#999" }}>Selecciona el módulo para ver permisos</span>
                                    )}
                                    </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
    )


}