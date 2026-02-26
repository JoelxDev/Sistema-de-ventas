import pool from '../../config/conexion_bd.js';
import { obtenerProductoPorId } from '../productos/productos.model.js';
import { obtenerUsuarioSucursal } from '../sucursales/sucursales.model.js';

export async function crearVenta(datos, idUsuarioSucursal) {
    const conecction = await pool.getConnection();
    const { tipo_venta, metodo_pago_venta, total_pagar, monto_recivido, detalles_ventas } = datos

    const usuarioSucursal = await obtenerUsuarioSucursal(idUsuarioSucursal)

    if(!usuarioSucursal.sucursales_id_sucursal){
         throw new Error("Para registrar una venta tiene que estar asociado a una sucursal");
    }

    if (total_pagar > monto_recivido) {
        throw new Error("El monto recibido no puede ser menor al total a pagar");
    }

    if (detalles_ventas.length === 0) {
        throw new Error("Estas intenta registrar una venta sin productos");
    }

    try {
        await conecction.beginTransaction();

        let vuelto;
        if (total_pagar === monto_recivido) {
            vuelto = 0;
        } else {
            vuelto = monto_recivido - total_pagar;
        }


        const [Resultventa] = await conecction.query(
            'INSERT INTO ventas (tipo_venta, metodo_pago_venta, fecha_venta, total_pagar, monto_recivido, vuelto, usuarios_sucursal_id_usuarios_sucursal) VALUES (?, ?, NOW(), ?, ?, ?, ?)',
            [tipo_venta, metodo_pago_venta, total_pagar, monto_recivido, vuelto, idUsuarioSucursal]
        );

        const idVenta = Resultventa.insertId;

        for (const detalle of detalles_ventas) {
            const { cantidad_prod, sub_total, productos_id_producto } = detalle;
            const producto = await obtenerProductoPorId(productos_id_producto);
            if (!producto) {
                throw new Error(`El producto con ID ${productos_id_producto} no existe`);
            }
            const subTotalBackend = cantidad_prod * producto.precio_unitario_prod;

            if (sub_total !== subTotalBackend) {
                throw new Error(`El sub total para el producto con ID ${productos_id_producto} es incorrecto. Esperado: ${subTotalBackend}, Recibido: ${sub_total}`);
            }

            await conecction.query(
                `INSERT INTO detalles_ventas (cantidad_dv, sub_total_dv, fecha_dv, productos_id_producto, ventas_id_venta) VALUES (?, ?, NOW(), ?, ?)`,
                [cantidad_prod, sub_total, productos_id_producto, idVenta]
            );
        }
        
        await conecction.commit();
        
        return idVenta;

    } catch (error) {
        await conecction.rollback();
        throw error;
    } finally {
        conecction.release();
    }
}

export async function obtenerVentas() {
    const [rows] = await pool.query(`
        SELECT 
            v.id_venta,
            v.tipo_venta,
            v.metodo_pago_venta,
            v.fecha_venta,
            v.total_pagar,
            v.monto_recivido,
            v.vuelto,
            u.id_usuario,
            CONCAT(p.nombre_per, ' ', p.apellido_per) AS nombre_completo,
            s.nombre_suc AS sucursal,
            dv.id_detalles_venta,
            dv.cantidad_dv,
            dv.sub_total_dv,
            dv.fecha_dv,
            pr.id_producto,
            pr.nombre_prod,
            pr.precio_unitario_prod
        FROM ventas v
        INNER JOIN usuarios_sucursal us ON v.usuarios_sucursal_id_usuarios_sucursal = us.id_usuarios_sucursal
        INNER JOIN usuarios u ON us.usuarios_id_usuario = u.id_usuario
        INNER JOIN personal p ON u.personal_id_personal = p.id_personal
        INNER JOIN sucursales s ON us.sucursales_id_sucursal = s.id_sucursal
        INNER JOIN detalles_ventas dv ON v.id_venta = dv.ventas_id_venta
        INNER JOIN productos pr ON dv.productos_id_producto = pr.id_producto
        ORDER BY v.fecha_venta DESC
    `);

    return agruparVentas(rows);
}

export async function obtenerVentasPorSucursal(idSucursal) {
    const [rows] = await pool.query(`
        SELECT 
            v.id_venta,
            v.tipo_venta,
            v.metodo_pago_venta,
            v.fecha_venta,
            v.total_pagar,
            v.monto_recivido,
            v.vuelto,
            s.id_sucursal,
            s.nombre_suc AS sucursal,
            s.ubicacion_suc,
            u.id_usuario,
            CONCAT(p.nombre_per, ' ', p.apellido_per) AS nombre_vendedor,
            p.dni_per,
            dv.id_detalles_venta,
            dv.cantidad_dv,
            dv.sub_total_dv,
            dv.fecha_dv,
            pr.id_producto,
            pr.nombre_prod,
            pr.precio_unitario_prod
        FROM ventas v
        INNER JOIN usuarios_sucursal us ON v.usuarios_sucursal_id_usuarios_sucursal = us.id_usuarios_sucursal
        INNER JOIN usuarios u ON us.usuarios_id_usuario = u.id_usuario
        INNER JOIN personal p ON u.personal_id_personal = p.id_personal
        INNER JOIN sucursales s ON us.sucursales_id_sucursal = s.id_sucursal
        INNER JOIN detalles_ventas dv ON v.id_venta = dv.ventas_id_venta
        INNER JOIN productos pr ON dv.productos_id_producto = pr.id_producto
        WHERE s.id_sucursal = ?
        ORDER BY v.fecha_venta DESC
    `, [idSucursal]);

    return agruparVentas(rows);
}

// --- Helper para agrupar filas planas en JSON anidado ---
function agruparVentas(rows) {
    const ventasMap = new Map();

    for (const row of rows) {
        if (!ventasMap.has(row.id_venta)) {
            ventasMap.set(row.id_venta, {
                id_venta: row.id_venta,
                tipo_venta: row.tipo_venta,
                metodo_pago_venta: row.metodo_pago_venta,
                fecha_venta: row.fecha_venta,
                total_pagar: row.total_pagar,
                monto_recivido: row.monto_recivido,
                vuelto: row.vuelto,
                vendedor: {
                    id_usuario: row.id_usuario,
                    nombre_completo: row.nombre_completo ?? row.nombre_vendedor,
                    // dni_per: row.dni_per ?? null,
                    sucursal: row.sucursal,
                    // ubicacion_suc: row.ubicacion_suc ?? null,
                },
                detalles_ventas: []
            });
        }

        ventasMap.get(row.id_venta).detalles_ventas.push({
            id_detalles_venta: row.id_detalles_venta,
            cantidad_dv: row.cantidad_dv,
            sub_total_dv: row.sub_total_dv,
            fecha_dv: row.fecha_dv,
            producto: {
                id_producto: row.id_producto,
                nombre_prod: row.nombre_prod,
                precio_unitario_prod: row.precio_unitario_prod
            }
        });
    }

    return Array.from(ventasMap.values());
}