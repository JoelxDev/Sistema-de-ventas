const API_URL = 'http://localhost:3200/api/permisos';

export async function obtenerPermisos() {
    const response = await fetch(API_URL, {credentials: 'include'});
    if (!response.ok) throw new Error('Error al obtener roles')
    return response.json();
}
export async function obtenerPermisoPorId(id){
    const response = await fetch(`${API_URL}/${id}`, {credentials: 'include'});
    if(!response.ok) throw new Error('Error al obtener rol por ID') 
    return response.json();
}
export async function crearPermiso(datos) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error('Error al crear rol')
    return response.json();
}
export async function actualizarPermiso(id, datos) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error('Error al actualizar rol')
    return response.json();
}
export async function eliminarPermiso(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Error al eliminar rol')
    return response.json();
}
export async function actualizarEstadoPermiso(id, estado) {
    const response = await fetch(`${API_URL}/${id}/estado`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        credentials:'include',
        body: JSON.stringify({ estado }),
    });
    if (!response.ok) throw new Error('Error al actualizar estado del rol')
    return response.json();
}
