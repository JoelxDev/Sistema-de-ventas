const API_URL_ROLES = 'http://localhost:3200/api/roles';

export async function obtenerRoles() {
    const response = await fetch(API_URL_ROLES, {credentials: 'include'});
    if (!response.ok) throw new Error('Error al obtener roles')
    return response.json();
}

export async function obtenerRolPorId(id){
    const response = await fetch(`${API_URL_ROLES}/${id}`, {credentials: 'include'});
    if(!response.ok) throw new Error('Error al obtener rol por ID') 
    return response.json();
}

export async function crearRol(datos) {
    const response = await fetch(API_URL_ROLES, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error('Error al crear rol')
    return response.json();
}

export async function actualizarRol(id, datos) {
    const response = await fetch(`${API_URL_ROLES}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error('Error al actualizar rol')
    return response.json();
}

export async function eliminarRol(id) {
    const response = await fetch(`${API_URL_ROLES}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Error al eliminar rol')
    return response.json();
}

export async function actualizarEstadoRol(id, estado) {
    const response = await fetch(`${API_URL_ROLES}/${id}/estado`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        credentials:'include',
        body: JSON.stringify({ estado }),
    });
    if (!response.ok) throw new Error('Error al actualizar estado del rol')
    return response.json();
}

export async function actualizarRequireSucursal(id, requiereSucursal) {

    const response = await fetch(`${API_URL_ROLES}/${id}/sucursal`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        credentials:'include',
        body: JSON.stringify({ requiereSucursal }),
    });
    console.log('Respuesta de la API:', requiereSucursal);
    if (!response.ok) throw new Error('Error al actualizar requiere sucursal del rol')
    return response.json();
}