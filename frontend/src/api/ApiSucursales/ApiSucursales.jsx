const API_URL_SUCURSALES = import.meta.env.VITE_API_URL_SUCURSALES || 'http://localhost:3200/api/sucursales';

export async function obtenerSucursales() {
    const response = await fetch(`${API_URL_SUCURSALES}/`, {
        credentials: 'include'
    });
    if(!response.ok) throw new Error('Error al obtener sucursales');
    return response.json();
} 

export async function obtenerSucursalPorId(id) {
    const response = await fetch(`${API_URL_SUCURSALES}/${id}`, {
        credentials: 'include'
    });
    if(!response.ok) throw new Error('Error al obtener sucursal por ID');
    return response.json();
}

export async function crearSucursal(datos) {
    const response = await fetch(`${API_URL_SUCURSALES}/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(datos),
});
    if(!response.ok) throw new Error('Error al crear sucursal');
    return response.json();
}

export async function actualizarSucursal(id, datos) {
    const response = await fetch(`${API_URL_SUCURSALES}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(datos),
    });
    if(!response.ok) throw new Error('Error al actualizar sucursal');
    return response.json();
}

export async function eliminarSucursal(id) {
    const response = await fetch(`${API_URL_SUCURSALES}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if(!response.ok) throw new Error('Error al eliminar sucursal');
    return response.json();
}

export async function actualizarEstadoSucursal(id, estado) {
    const response = await fetch(`${API_URL_SUCURSALES}/${id}/estado`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({ estado }),
    });
    if(!response.ok) throw new Error('Error al actualizar estado de sucursal');
    return response.json();
}

