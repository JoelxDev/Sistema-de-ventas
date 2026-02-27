import * as DashboardModel from './dashboard.model.js';

export async function obtenerResumen(req, res) {
    try {
        const [ventasDia, ventasMes, productosMasVendidos, ventasPorSucursal] = await Promise.all([
            DashboardModel.obtenerVentasDelDia(),
            DashboardModel.obtenerVentasDelMes(),
            DashboardModel.obtenerProductoMasVendido(),
            DashboardModel.obtenerVentasPorSucursal()
        ]);

        res.status(200).json({
            ventasDia,
            ventasMes,
            productosMasVendidos,
            ventasPorSucursal
        });
    } catch (error) {
        console.error("❌ Error al obtener resumen del dashboard:", error);
        res.status(500).json({ error: 'Error al obtener el resumen del dashboard', mensaje: error.message });
    }
}

export async function obtenerGraficoVentas(req, res) {
    try {
        const { periodo } = req.query; // 'semana', 'mes', 'anio'
        const datos = await DashboardModel.obtenerVentasPorPeriodo(periodo || 'mes');
        res.status(200).json(datos);
    } catch (error) {
        console.error("❌ Error al obtener gráfico de ventas:", error);
        res.status(500).json({ error: 'Error al obtener datos del gráfico', mensaje: error.message });
    }
}

export async function obtenerGraficoVentasPorSucursal(req, res) {
    try {
        const { periodo } = req.query;
        const datos = await DashboardModel.obtenerVentasPorSucursalYPeriodo(periodo || 'mes');
        res.status(200).json(datos);
    } catch (error) {
        console.error("❌ Error al obtener gráfico de ventas por sucursal:", error);
        res.status(500).json({ error: 'Error al obtener datos del gráfico por sucursal', mensaje: error.message });
    }
}
