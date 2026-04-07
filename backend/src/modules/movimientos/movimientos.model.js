import pool from '../../config/conexion_bd.js';

export const TIPOS_MOVIMIENTO = {
    CONSULTA: 'Consulta',
    CREACION: 'Creación',
    EDICION: 'Edición',
    ELIMINACION: 'Eliminación',
    ACTUALIZACION_ESTADO: 'Actualización de estado'
};

export async function insertarMovimiento(movimiento, detalles, idUsuario) {
    const [result] = await pool.query(
        'INSERT INTO movimientos_usuarios (movimiento, detalles_movimiento, fecha_movimiento, usuarios_id_usuario) VALUES (?, ?, NOW(), ?)',
        [movimiento, detalles, idUsuario]
    );
    return result.insertId;

}