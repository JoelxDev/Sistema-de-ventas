const API_URL_MODULOS = 'http://localhost:3200/api/modulos';

export async function obtenerModulos() {
    const response = await fetch(API_URL_MODULOS, {credentials: 'include'});
    if (!response.ok) throw new Error('Error al obtener modulos')
    return response.json();
}

export async function obtenerModuloPorId(id){
    const response = await fetch(`${API_URL_MODULOS}/${id}`, {credentials: 'include'});
    if(!response.ok) throw new Error('Error al obtener modulo por ID') 
    return response.json();
}

export async function crearModulo(datos) {
    const response = await fetch(API_URL_MODULOS, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error('Error al crear modulo')
    return response.json();
}

export async function actualizarModulo(id, datos) {
    const response = await fetch(`${API_URL_MODULOS}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error('Error al actualizar modulo')
    return response.json();
}

export async function eliminarModulo(id) {
    const response = await fetch(`${API_URL_MODULOS}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Error al eliminar modulo')
    return response.json();
}

export async function actualizarEstadoModulo(id, estado) {
    const response = await fetch(`${API_URL_MODULOS}/${id}/estado`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({ estado }),
    });
    if (!response.ok) throw new Error('Error al actualizar estado del modulo')
    return response.json();
}