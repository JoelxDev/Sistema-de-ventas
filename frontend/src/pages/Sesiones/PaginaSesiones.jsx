import { useState, useEffect } from "react";
import { useAutenticacion } from "../../context/AutenticacionContext";
import { obtenerDatosSesiones } from "../../api/ApiSesiones/ApiSesiones";

export function PaginaSesiones() {
    const [datosSesiones, setDatosSesiones] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => { cargarDatosSesiones(); }, []);

    async function cargarDatosSesiones() {
        try {
            setCargando(true);
            const data = await obtenerDatosSesiones();
            setDatosSesiones(data);
        } catch (err) { setError(err.message); }
        finally { setCargando(false); }
    }

    if (cargando) return <div className="estado-cargando">â³ Cargando sesiones...</div>;
    if (error)    return <div className="estado-error">âš ï¸ Error: {error}</div>;
    if (!datosSesiones || datosSesiones.length === 0) return <div className="estado-vacio">No hay datos de sesiones disponibles.</div>;

    return (
        <div className="pagina">
            <div className="pagina-header">
                <h1 className="pagina-titulo">Historial de Sesiones</h1>
            </div>

            <div className="tabla-wrapper">
                <table className="tabla">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Usuario</th>
                            <th>Rol</th>
                            <th>Sucursal</th>
                            <th>Ubicacion</th>
                            <th>Inicio de sesion</th>
                            <th>Fin de sesion</th>
                            {/* <th>Estado</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {datosSesiones.map((ds) => {
                            const activa = !ds.fecha_finalizo_ses;
                            return (
                                <tr key={ds.id_sesion}>
                                    <td style={{ fontWeight: 600 }}>{ds.nombre_per}</td>
                                    <td>{ds.apellido_per}</td>
                                    <td>{ds.nombre_usuario}</td>
                                    <td><span className="badge" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>{ds.nombre_rol}</span></td>
                                    <td>{ds.nombre_suc ?? '-------'}</td>
                                    <td style={{ color: 'var(--color-text-muted)' }}>{ds.ubicacion_suc ?? '-------'}</td>
                                    <td style={{ color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                                        {new Date(ds.fecha_entrada_ses).toLocaleString('es-ES')}
                                    </td>
                                    <td style={{ color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                                        {ds.fecha_finalizo_ses
                                            ? new Date(ds.fecha_finalizo_ses).toLocaleString('es-ES')
                                            : '-------'}
                                    </td>
                                    {/* <td>
                                        <span className={`badge ${activa ? 'badge-activo' : 'badge-inactivo'}`}>
                                            {activa ? 'Activa' : 'Finalizada'}
                                        </span>
                                    </td> */}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
