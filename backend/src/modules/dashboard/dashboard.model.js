import pool from '../../config/conexion_bd.js';

// Ventas del día (total y cantidad)
export async function obtenerVentasDelDia() {
    const [rows] = await pool.query(`
        SELECT 
            COALESCE(SUM(v.total_pagar), 0) AS total_ventas,
            COUNT(v.id_venta) AS cantidad_ventas
        FROM ventas v
        WHERE DATE(v.fecha_venta) = CURDATE()
          AND v.estado_registro_venta != 'anulado'
    `);
    return rows[0];
}

// Ventas del mes (total y cantidad)
export async function obtenerVentasDelMes() {
    const [rows] = await pool.query(`
        SELECT 
            COALESCE(SUM(v.total_pagar), 0) AS total_ventas,
            COUNT(v.id_venta) AS cantidad_ventas
        FROM ventas v
        WHERE MONTH(v.fecha_venta) = MONTH(CURDATE())
          AND YEAR(v.fecha_venta) = YEAR(CURDATE())
          AND v.estado_registro_venta != 'anulado'
    `);
    return rows[0];
}

// Producto más vendido (por cantidad total vendida)
export async function obtenerProductoMasVendido() {
    const [rows] = await pool.query(`
        SELECT 
            p.id_producto,
            p.nombre_prod,
            SUM(dv.cantidad_dv) AS total_vendido,
            COALESCE(SUM(dv.sub_total_dv), 0) AS total_ingresos
        FROM detalles_ventas dv
        INNER JOIN productos p ON dv.productos_id_producto = p.id_producto
        INNER JOIN ventas v ON dv.ventas_id_venta = v.id_venta
        WHERE v.estado_registro_venta != 'anulado'
        GROUP BY p.id_producto, p.nombre_prod
        ORDER BY total_vendido DESC
        LIMIT 5
    `);
    return rows;
}

// Ventas por sucursal
export async function obtenerVentasPorSucursal() {
    const [rows] = await pool.query(`
        SELECT 
            s.id_sucursal,
            s.nombre_suc,
            COALESCE(SUM(v.total_pagar), 0) AS total_ventas,
            COUNT(v.id_venta) AS cantidad_ventas
        FROM sucursales s
        LEFT JOIN usuarios_sucursal us ON s.id_sucursal = us.sucursales_id_sucursal
        LEFT JOIN ventas v ON us.id_usuarios_sucursal = v.usuarios_sucursal_id_usuarios_sucursal
            AND v.estado_registro_venta != 'anulado'
        WHERE s.estado_suc = 'activo'
        GROUP BY s.id_sucursal, s.nombre_suc
        ORDER BY total_ventas DESC
    `);
    return rows;
}

// Ventas agrupadas por periodo (semana, mes, año) para gráficos de líneas
export async function obtenerVentasPorPeriodo(periodo = 'mes') {
    let groupBy, selectFecha, orderBy;

    switch (periodo) {
        case 'semana':
            // Últimas 12 semanas
            selectFecha = `DATE_FORMAT(MIN(DATE_SUB(v.fecha_venta, INTERVAL WEEKDAY(v.fecha_venta) DAY)), '%Y-%m-%d') AS periodo_inicio,
                           YEARWEEK(v.fecha_venta, 1) AS periodo_key`;
            groupBy = 'YEARWEEK(v.fecha_venta, 1)';
            orderBy = 'periodo_key ASC';
            break;
        case 'anio':
            // Por año
            selectFecha = `YEAR(v.fecha_venta) AS periodo_inicio,
                           YEAR(v.fecha_venta) AS periodo_key`;
            groupBy = 'YEAR(v.fecha_venta)';
            orderBy = 'periodo_key ASC';
            break;
        case 'mes':
        default:
            // Últimos 12 meses
            selectFecha = `DATE_FORMAT(v.fecha_venta, '%Y-%m') AS periodo_inicio,
                           DATE_FORMAT(v.fecha_venta, '%Y-%m') AS periodo_key`;
            groupBy = `DATE_FORMAT(v.fecha_venta, '%Y-%m')`;
            orderBy = 'periodo_key ASC';
            break;
    }

    const [rows] = await pool.query(`
        SELECT 
            ${selectFecha},
            COALESCE(SUM(v.total_pagar), 0) AS total_ventas,
            COUNT(v.id_venta) AS cantidad_ventas
        FROM ventas v
        WHERE v.estado_registro_venta != 'anulado'
        GROUP BY ${groupBy}
        ORDER BY ${orderBy}
        LIMIT 24
    `);
    return rows;
}

// Ventas por sucursal agrupadas por periodo (para gráfico de líneas por sucursal)
export async function obtenerVentasPorSucursalYPeriodo(periodo = 'mes') {
    let groupByPeriodo, selectFecha, orderBy;

    switch (periodo) {
        case 'semana':
            selectFecha = `DATE_FORMAT(MIN(DATE_SUB(v.fecha_venta, INTERVAL WEEKDAY(v.fecha_venta) DAY)), '%Y-%m-%d') AS periodo_inicio,
                           YEARWEEK(v.fecha_venta, 1) AS periodo_key`;
            groupByPeriodo = 'YEARWEEK(v.fecha_venta, 1)';
            orderBy = 'periodo_key ASC';
            break;
        case 'anio':
            selectFecha = `YEAR(v.fecha_venta) AS periodo_inicio,
                           YEAR(v.fecha_venta) AS periodo_key`;
            groupByPeriodo = 'YEAR(v.fecha_venta)';
            orderBy = 'periodo_key ASC';
            break;
        case 'mes':
        default:
            selectFecha = `DATE_FORMAT(v.fecha_venta, '%Y-%m') AS periodo_inicio,
                           DATE_FORMAT(v.fecha_venta, '%Y-%m') AS periodo_key`;
            groupByPeriodo = `DATE_FORMAT(v.fecha_venta, '%Y-%m')`;
            orderBy = 'periodo_key ASC';
            break;
    }

    const [rows] = await pool.query(`
        SELECT 
            s.id_sucursal,
            s.nombre_suc,
            ${selectFecha},
            COALESCE(SUM(v.total_pagar), 0) AS total_ventas,
            COUNT(v.id_venta) AS cantidad_ventas
        FROM sucursales s
        INNER JOIN usuarios_sucursal us ON s.id_sucursal = us.sucursales_id_sucursal
        INNER JOIN ventas v ON us.id_usuarios_sucursal = v.usuarios_sucursal_id_usuarios_sucursal
        WHERE v.estado_registro_venta != 'anulado'
          AND s.estado_suc = 'activo'
        GROUP BY s.id_sucursal, s.nombre_suc, ${groupByPeriodo}
        ORDER BY s.nombre_suc, ${orderBy}
    `);
    return rows;
}
