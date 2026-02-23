import pool from '../../config/conexion_bd.js';

export async function crearCategoria(datos) {
    const { nombre_categoria, descripcion_categoria } = datos;
    const [result] = await pool.query(
        'INSERT INTO categorias (nombre_categoria, descripcion_categoria, fecha_crea_categoria) VALUES (?, ?,  NOW())',
        [nombre_categoria, descripcion_categoria]
    );
    return result.insertId;
}

export async function obtenerTodasLasCategorias() {
    const [rows] = await pool.query('SELECT * FROM categorias');
    return rows;
}

export async function obtenerCategoriaPorId(idCategoria) {
    const [row] = await pool.query(
        'SELECT * FROM categorias WHERE id_categoria = ?', [idCategoria]
    );
    return row[0];
}

export async function actualizarCategoria(idCategoria, datos) {
    const { nombre_categoria, descripcion_categoria } = datos;
    await pool.query(
        'UPDATE categorias SET nombre_categoria = ?, descripcion_categoria = ? WHERE id_categoria = ?',
        [nombre_categoria, descripcion_categoria, idCategoria]
    );
}

export async function eliminarCategoria(idCategoria) {
    const [result] = await pool.query(
        'DELETE FROM categorias WHERE id_categoria = ?', [idCategoria]
    );
    return result.affectedRows;
}


