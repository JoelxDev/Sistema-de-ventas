const API_PRODUCTOS_URL = import.meta.env.VITE_API_URL_PRODUCTOS || 'http://localhost:3200/api/productos';

export async function obtenerProductos() {
    const response = await fetch(`${API_PRODUCTOS_URL}/`, {credentials: 'include'});
    if (!response.ok) throw new Error('Error al obtener productos')
    return response.json();
}

export async function obtenerProductoPorId(idProducto){
    const response = await fetch(`${API_PRODUCTOS_URL}/${idProducto}`, {credentials: 'include'});
    if(!response.ok) throw new Error('Error al obtener producto por ID') 
    return response.json();
}

export async function crearProducto(datos) {
    const response = await fetch(API_PRODUCTOS_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error('Error al crear producto')
    return response.json();
}
export async function actualizarProducto(idProducto, datos) {
    const response = await fetch(`${API_PRODUCTOS_URL}/${idProducto}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error('Error al actualizar producto')
    return response.json();
}

export async function eliminarProducto(idProducto) {
    const response = await fetch(`${API_PRODUCTOS_URL}/${idProducto}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Error al eliminar producto')
    return response.json();
}

export async function actualizarEstadoProducto(idProducto, estadoProducto) {
    const response = await fetch(`${API_PRODUCTOS_URL}/${idProducto}/estado`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        credentials:'include',
        body: JSON.stringify({ estadoProducto }),
    });
    if (!response.ok) throw new Error('Error al actualizar estado del producto')
    return response.json();
}

export async function obtenerProductosActivos() {
    const response = await fetch(`${API_PRODUCTOS_URL}/activos`, {credentials: 'include'});
    if (!response.ok) throw new Error('Error al obtener productos activos')
    return response.json();
    
}