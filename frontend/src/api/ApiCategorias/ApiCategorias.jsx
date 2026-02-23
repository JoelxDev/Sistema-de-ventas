const API_URL_CATEGORIAS = import.meta.env.VITE_API_URL_CATEGORIAS || 'http://localhost:3200/api/categorias';


export async function obtenerCategorias() {
    const response = await fetch(`${API_URL_CATEGORIAS}/`, {credentials: 'include'});
    if (!response.ok) throw new Error('Error al obtener categorias')
    return response.json();
}

export async function obtenerCategoriaPorId(idCategoria){
    const response = await fetch(`${API_URL_CATEGORIAS}/${idCategoria}`, {credentials: 'include'});
    if(!response.ok) throw new Error('Error al obtener categoria por ID') 
    return response.json();
}

export async function crearCategoria(datos) {
    const response = await fetch(API_URL_CATEGORIAS, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error('Error al crear categoria')
    return response.json();
}

export async function actualizarCategoria(idCategoria, datos) {
    const response = await fetch(`${API_URL_CATEGORIAS}/${idCategoria}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error('Error al actualizar categoria')
    return response.json();
}

export async function eliminarCategoria(idCategoria) {
    const response = await fetch(`${API_URL_CATEGORIAS}/${idCategoria}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Error al eliminar categoria')
    return response.json();
}