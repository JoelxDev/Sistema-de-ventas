import pool from '../../config/conexion_bd.js';

export async function crearModulo(datos) {
    const { nombre_modulo, descripcion_modulo } = datos;
    const [result] = await pool.query(
        'INSERT INTO modulos (nombre_modulo, descripcion_modulo, estado_modulo ,fecha_crea_modulo) VALUES (?, ?, ?, NOW())',
        [nombre_modulo, descripcion_modulo, 'inactivo']
    );
    return result.insertId;
}

export async function obtenerTodosLosModulos() {
    const [rows] = await pool.query('SELECT * FROM modulos');
    return rows;
}

export async function obtenerModuloPorId(id) {
    const [row] = await pool.query(
        'SELECT * FROM modulos WHERE id_modulo = ?', [id]
    );
    return row[0];
}

export async function actualizarModulo(id, datos) {
    const { nombre_modulo, descripcion_modulo } = datos;
    await pool.query(
        'UPDATE modulos SET nombre_modulo = ?, descripcion_modulo = ? WHERE id_modulo = ?',
        [nombre_modulo, descripcion_modulo, id]
    );
}

export async function eliminarModulo(id) {
    const [result] = await pool.query(
        'DELETE FROM modulos WHERE id_modulo = ?', [id]
    );
    return result.affectedRows;
}

export async function actualizarEstadoModulo(id, estado) {
    const result = await pool.query(
        'UPDATE modulos SET estado_modulo = ? WHERE id_modulo = ?',
    [estado, id]
    );
    return result.affectedRows;
}