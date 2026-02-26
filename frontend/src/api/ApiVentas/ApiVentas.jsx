const API_VENTAS_URL = import.meta.env.VITE_API_URL_VENTAS || 'http://localhost:3200/api/ventas';


export async function obtenerVentas() {
    const response = await fetch(API_VENTAS_URL, {credentials: 'include'})
    if (!response.ok) throw new Error('Error al obtener las ventas')
    return response.json()
}

export async function obtenerVentasPorSucursal(idSucursal) {
    const response = await fetch(`${API_VENTAS_URL}/${idSucursal}`, {credentials: 'include'})
    if (!response.ok) throw new Error('Error al obtener la sucursal')
    return response.json()
}

export async function crearVenta(datos) {
    const response = await fetch(API_VENTAS_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(datos)
    })
    if(!response.ok) throw new Error ('Error al registrar la venta')
    return response.json()
}

