const API_URL = 'http://localhost:3200/api/usuarios';

export async function obtenerPersonal() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener personal')
    return response.json();
}

export async function obtenerPersonalPorId(id){
    const response = await fetch(`${API_URL}/${id}`)
    if(!response.ok) throw new Error('Error al obtener por ID') 
    return response.json();
}

export async function crearPersonal(datos) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error('Error al crear personal')
    return response.json();
}

export async function actualizarPersonal(id, datos) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error('Error al actualizar personal')
    return response.json();
}

export async function eliminarPersonalUsuario(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar personal')
    return response.json();
}

export async function actualizarEstadoUsuario(id, estado) {
    const response = await fetch(`${API_URL}/${id}/estado`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ estado }),
    });
    if (!response.ok) throw new Error('Error al actualizar estado del personal')
    return response.json();
}