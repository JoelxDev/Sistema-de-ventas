import pool from '../../config/conexion_bd.js';

export async function crearProducto(datos) {
    const { nombre_prod, descripcion_prod, precio_unitario_prod, idCategoria } = datos;

    const [result] = await pool.query(
        'INSERT INTO productos (nombre_prod, descripcion_prod, precio_unitario_prod, estado_prod, categorias_id_categoria) VALUES (?, ?, ?, ?, ?)',
        [nombre_prod, descripcion_prod, precio_unitario_prod, 'inactivo', idCategoria]
    );
    return result.insertId;
}

export async function obtenerProductos() {
    const [rows] = await pool.query('SELECT * FROM productos');
    return rows;
}

export async function obtenerProductoPorId(idProducto) {
    const [rows] = await pool.query(
        'SELECT * FROM productos WHERE id_producto = ?', [idProducto]);
    return rows[0];
}

export async function actualizarProducto(idProducto, datos) {
    const { nombre_prod, descripcion_prod, precio_unitario_prod, idCategoria } = datos;
    const [result] = await pool.query(
        'UPDATE productos SET nombre_prod = ?, descripcion_prod = ?, precio_unitario_prod = ?, categorias_id_categoria = ? WHERE id_producto = ?',
        [nombre_prod, descripcion_prod, precio_unitario_prod, idCategoria, idProducto]
    );
    return result.affectedRows
}

export async function eliminarProducto(idProducto) {
    const [result] = await pool.query(
        'DELETE FROM productos WHERE id_producto = ? AND estado_prod = "inactivo"',
        [idProducto]
    );
    return result.affectedRows;
}

export async function actualizarEstadoProducto(idProducto, estado_prod) {
    const result = await pool.query(
        'UPDATE productos SET estado_prod = ? WHERE id_producto = ?',
    [estado_prod, idProducto]
    );
    return result.affectedRows;
}