import pool from "../../config/conexion_bd.js";

export async function crearPermiso(datos) {
    const { nombre_perm, descripcion_perm, modulos_id_modulo } = datos;

    const [modulo] = await pool.query(
        'SELECT id_modulo FROM modulos WHERE id_modulo = ? AND estado_modulo = "activo"',
        [modulos_id_modulo]
    );

    if (modulo.length === 0) {
        throw new Error("El módulo asociado no existe o no está activo.");
    }

    const [result] = await pool.query(
        'INSERT INTO permisos (nombre_perm, descripcion_perm, fecha_crea_perm, estado_perm, modulos_id_modulo) VALUES (?, ?, NOW(), ?, ?)',
        [nombre_perm, descripcion_perm, 'activo', modulos_id_modulo]
    );
    return result.insertId;
} 

export async function obtenerTodosLosPermisos() {
    const [rows] = await pool.query(`SELECT p.*, m.nombre_modulo 
        FROM permisos p
        LEFT JOIN modulos m ON m.id_modulo = p.modulos_id_modulo`);
    return rows;
}

export async function obtenerPermisoPorId(id) {
    const [rows] = await pool.query(
        'SELECT * FROM permisos WHERE id_permiso = ?', [id]
    );
    return rows[0];
}

export async function actualizarPermiso(id, datos) {
    const { nombre_perm, descripcion_perm, modulos_id_modulo } = datos;
    await pool.query(
        'UPDATE permisos SET nombre_perm = ?, descripcion_perm = ?, modulos_id_modulo = ? WHERE id_permiso = ?',
        [nombre_perm, descripcion_perm, modulos_id_modulo, id]
    );
}

export async function eliminarPermiso(id) {
    const [result] = await pool.query(
        'DELETE FROM permisos WHERE id_permiso = ?', [id]
    );
    return result.affectedRows;
}

export async function actualizarEstadoPermiso(id, estado) {
    const result = await pool.query(
        'UPDATE permisos SET estado_perm = ? WHERE id_permiso = ?',
    [estado, id]
    );
    return result.affectedRows;
}