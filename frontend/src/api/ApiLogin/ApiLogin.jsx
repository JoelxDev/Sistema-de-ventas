const API_URL_LOGIN = import.meta.env.VITE_API_URL_LOGIN || 'http://localhost:3200/api/login';
 
export async function apiLogin(nombre_usuario, contrasenia, sucursalLogin) {
    const response = await fetch(`${API_URL_LOGIN}/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({ nombre_usuario, contrasenia, sucursalLogin })
    });

    const data =  await response.json();
    
    if(!response.ok) {
        throw new Error(data.mensaje || 'Error al iniciar sesión');
    }
    return data;
}

export async function apiLogout() {
    const response = await fetch(`${API_URL_LOGIN}/logout`, {
        method: 'POST',
        credentials: 'include'
    });
    return response.json();
}

export async function verificarSesion() {
    const response = await fetch(`${API_URL_LOGIN}/verificar`, {
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error('Sesion inválido o expirada');
    }
    return response.json();
}


