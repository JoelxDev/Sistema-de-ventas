import pool from '../../config/conexion_bd.js';

export async function crearSucursal(datos) {
    const { nombre_suc, ubicacion_suc } = datos;
    const [result] = await pool.query(
        'INSERT INTO sucursales (nombre_suc, ubicacion_suc, estado_suc, fecha_crea_suc) VALUES (?, ?, ?, NOW())',
        [nombre_suc, ubicacion_suc, 'activo']
    );
    return result.insertId;
}

export async function obtenerSucursales() {
    const [rows] = await pool.query('SELECT * FROM sucursales');
    return rows;
}

export async function obtenerSucursalPorId(id) {
    const [rows] = await pool.query(
        'SELECT * FROM sucursales WHERE id_sucursal = ?', [id]);
    return rows[0];
}

export async function actualizarSucursal(id, datos) {
    const { nombre_suc, ubicacion_suc } = datos;
    await pool.query(
        'UPDATE sucursales SET nombre_suc = ?, ubicacion_suc = ? WHERE id_sucursal = ?',
        [nombre_suc, ubicacion_suc, id]
    );
}

export async function eliminarSucursal(id) {
    const [result] = await pool.query(
        'DELETE FROM sucursales WHERE id_sucursal = ? AND estado_suc = "inactivo"',
        [id]
    );
    return result.affectedRows;
}

export async function actualizarEstadoSucursal(id, estado) {
    const result = await pool.query(
        'UPDATE sucursales SET estado_suc = ? WHERE id_sucursal = ?',
    [estado, id]
    );
    return result.affectedRows;
}

export async function obtenerUsuarioSucursal(idUsuarioSucursal) {
    const [ row ] = await pool.query(
        'SELECT * FROM usuarios_sucursal WHERE id_usuarios_sucursal = ?',
         [idUsuarioSucursal]
    )
    return row[0]
}