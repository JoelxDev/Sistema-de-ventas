import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../../context/AutenticacionContext.jsx';

export function Login() {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const { login } = useAutenticacion();
    const navegar = useNavigate();

    async function manejarEnvio(e) {
        e.preventDefault();
        setError('');
        setCargando(true);

        try {
            await login(nombreUsuario, contrasenia);
            navegar('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh' 
        }}>
            <form onSubmit={manejarEnvio} style={{ 
                padding: '30px', 
                border: '1px solid #ccc', 
                borderRadius: '8px',
                width: '300px'
            }}>
                <h2 style={{ textAlign: 'center' }}>Iniciar Sesión</h2>

                {error && (
                    <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
                )}

                <div style={{ marginBottom: '15px' }}>
                    <label>Usuario</label><br />
                    <input
                        type="text"
                        value={nombreUsuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Contraseña</label><br />
                    <input
                        type="password"
                        value={contrasenia}
                        onChange={(e) => setContrasenia(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={cargando}
                    style={{ width: '100%', padding: '10px' }}
                >
                    {cargando ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>
        </div>
    );
}