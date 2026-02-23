import { useState } from "react";
import { useAutenticacion } from "../../context/AutenticacionContext";
import { obtenerDatosSesiones } from "../../api/ApiSesiones/ApiSesiones";
import { useEffect } from "react";

export function PaginaSesiones() {
    const [datosSesiones, setDatosSesiones] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const { tienePermiso } = useAutenticacion();

    useEffect(() => {
        cargarDatosSesiones();
    }, []);

    async function cargarDatosSesiones() {
        try {
            setCargando(true);
            const data = await obtenerDatosSesiones();
            setDatosSesiones(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }

    if (cargando) return <p>Cargando datos de sesiones...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!datosSesiones) return <p>No hay datos de sesiones disponibles.</p>;

    return (
        <div>
            <h1>Historial de Sesiones</h1>
            <table border="1" cellPadding="8" cellSpacing="0" style={{ marginTop: "15px", width: "100%" }}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Usuario</th>
                        <th>Rol</th>
                        <th>Sucursal</th>
                        <th>Ubicacion</th>
                        <th>Fecha inicio sesion</th>
                        <th>Fecha finalizo sesion</th>
                    </tr>
                </thead>
                <tbody>
                    {datosSesiones.map((ds) => (
                        <tr key={ds.id_sesion}>
                            <td>{ds.nombre_per}</td>
                            <td>{ds.apellido_per}</td>
                            <td>{ds.nombre_usuario}</td>
                            <td>{ds.nombre_rol}</td>
                            <td>{ds.nombre_suc ?? 'Sin sucursal'}</td>
                            <td>{ds.ubicacion_suc}</td>
                            <td>{new Date(ds.fecha_entrada_ses).toLocaleString('es-ES')}</td>
                            <td>
                                {ds.fecha_finalizo_ses
                                    ? new Date(ds.fecha_finalizo_ses).toLocaleString('es-ES')
                                    : 'Sesión activa'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

}

