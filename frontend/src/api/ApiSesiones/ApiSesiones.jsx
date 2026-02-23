const API_SESIONES_URL = import.meta.env.VITE_API_URL_SESIONES || 'http://localhost:3200/api/sesiones';

export async function obtenerDatosSesiones() {
    const response = await fetch(`${API_SESIONES_URL}/`, {
        method: 'GET',
        credentials: 'include'
    })
    if (!response.ok) {
        throw new Error('Error al obtener los datos de sesiones');
    }
    return response.json();
}
