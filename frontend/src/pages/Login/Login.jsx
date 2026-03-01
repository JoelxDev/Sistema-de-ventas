import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../../context/AutenticacionContext.jsx';

export function Login() {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [sucursalLogin, setSucursalLogin] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const { login } = useAutenticacion();
    const navegar = useNavigate();

    async function manejarEnvio(e) {
        e.preventDefault();
        setError('');
        setCargando(true);
        try {
            await login(nombreUsuario, contrasenia, sucursalLogin);
            navegar('/perfil');
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }

    return (
        <div className="login-pagina">
            <div className="login-card">
                <div className="login-brand">
                    {/* <span className="login-brand-icon">📦</span> */}
                    {/* <h1 className="login-titulo">Logística de Almacén</h1> */}
                    <p className="login-subtitulo">Ingresa tus credenciales para continuar</p>
                </div>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={manejarEnvio}>
                    <div className="campo">
                        <label className="campo-label">Usuario</label>
                        <input
                            className="campo-input"
                            type="text"
                            value={nombreUsuario}
                            onChange={(e) => setNombreUsuario(e.target.value)}
                            placeholder="Nombre de usuario"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="campo">
                        <label className="campo-label">Contraseña</label>
                        <input
                            className="campo-input"
                            type="password"
                            value={contrasenia}
                            onChange={(e) => setContrasenia(e.target.value)}
                            placeholder="Contraseña"
                            required
                        />
                    </div>

                    <div className="campo">
                        <label className="campo-label">Sucursal</label>
                        <input
                            className="campo-input"
                            type="number"
                            value={sucursalLogin}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSucursalLogin(value === '' ? '' : Number(value));
                            }}
                            placeholder="ID de sucursal"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-login"
                        disabled={cargando}
                    >
                        {cargando ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </div>
    );
}