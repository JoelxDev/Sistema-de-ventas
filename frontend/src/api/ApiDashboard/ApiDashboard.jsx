const API_DASHBOARD_URL = import.meta.env.VITE_API_URL_DASHBOARD || 'http://localhost:3200/api/dashboard';

export async function obtenerResumenDashboard() {
    const response = await fetch(`${API_DASHBOARD_URL}/resumen`, { credentials: 'include' });
    if (!response.ok) throw new Error('Error al obtener el resumen del dashboard');
    return response.json();
}

export async function obtenerGraficoVentas(periodo = 'mes') {
    const response = await fetch(`${API_DASHBOARD_URL}/grafico-ventas?periodo=${periodo}`, { credentials: 'include' });
    if (!response.ok) throw new Error('Error al obtener datos del gráfico de ventas');
    return response.json();
}

export async function obtenerGraficoVentasPorSucursal(periodo = 'mes') {
    const response = await fetch(`${API_DASHBOARD_URL}/grafico-ventas-sucursal?periodo=${periodo}`, { credentials: 'include' });
    if (!response.ok) throw new Error('Error al obtener datos del gráfico por sucursal');
    return response.json();
}
