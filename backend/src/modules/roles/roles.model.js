import pool from "../../config/conexion_bd.js";

export async function crearRol(datos) {
    const { nombre_rol, descripcion_rol, permisos } = datos;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        // Crear rol
        const result = await connection.query(
            'INSERT INTO roles (nombre_rol, descripcion_rol, fecha_crea_rol, estado_rol, requiere_sucursal) VALUES (?, ?, NOW(), ?, ?)',
            [nombre_rol, descripcion_rol, 'activo', 'no']
        );
        const idRol = result[0].insertId;
        // Insertar permisos en roles_y_permisos
        if (permisos && permisos.length > 0) {
            const valores = permisos.map(id_permiso => [idRol, id_permiso]);
            await connection.query(
                'INSERT INTO roles_y_permisos (roles_id_rol, permisos_id_permiso) VALUES ?',
                [valores]
            );
        }

        await connection.commit();
        return idRol;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

export async function obtenerTodosLosRoles() {
    const [rows] = await pool.query('SELECT * FROM roles');
    return rows;
}

export async function obtenerRolPorId(id) {
    const [rows] = await pool.query(
        'SELECT * FROM roles WHERE id_rol = ?', [id]
    );
    if(rows.length === 0) return null;
    const rol = rows[0];
    // Obtener permisos asociados al rol
    const [permisosRows] = await pool.query(
        'SELECT permisos_id_permiso FROM roles_y_permisos WHERE roles_id_rol = ?', 
        [id]);
    // Agregar array de IDs de permisos al rol
    rol.permisos = permisosRows.map(row => row.permisos_id_permiso);
    return rol;
}

export async function actualizarRol(id, datos) {
    const { nombre_rol, descripcion_rol, permisos} = datos;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        // Actualizar datos del rol
        await connection.query(
            'UPDATE roles SET nombre_rol = ?, descripcion_rol = ? WHERE id_rol = ?',
            [nombre_rol, descripcion_rol, id]
        );

        await connection.query(
            'DELETE FROM roles_y_permisos WHERE roles_id_rol = ?',
            [id]
        );

        if(permisos && permisos.length > 0){
            const valores = permisos.map(id_permiso => [id, id_permiso]);
            await connection.query(
                'INSERT INTO roles_y_permisos (roles_id_rol, permisos_id_permiso) VALUES ?',
                [valores]
            );
        }
        await connection.commit();
        return true;
    }catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

export async function eliminarRol(id) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [usuarios] = await connection.query(
            'SELECT id_usuario FROM usuarios WHERE roles_id_rol = ?', [id]
        );
        if (usuarios.length > 0) {
            throw new Error(`No se puede eliminar el rol porque tiene ${usuarios.length} usuario(s) asignado(s). Reasigna o elimina esos usuarios primero.`);
        }

        await connection.query(
            'DELETE FROM roles_y_permisos WHERE roles_id_rol = ?', [id]
        );

        const [result] = await connection.query(
            'DELETE FROM roles WHERE id_rol = ?', [id]
        );

        await connection.commit();
        return result.affectedRows;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

export async function actualizarEstadoRol(id, estado) {
    const result = await pool.query(
        'UPDATE roles SET estado_rol = ? WHERE id_rol = ?',
        [estado, id]
    );
    return result.affectedRows;
}

export async function actualizarRequiereSucursal(id, requireSucursal) {
    const result =  await pool.query(
        'UPDATE roles SET requiere_sucursal = ? WHERE id_rol = ?',
        [requireSucursal, id]
    );
    return result.affectedRows;
}

export async function obtenerPermisos(idPermisos) {
    const [rows] = await pool.query(
        `SELECT p.nombre_perm, m.nombre_modulo FROM permisos p
         JOIN modulos m ON p.modulos_id_modulo = m.id_modulo
         WHERE p.id_permiso IN (?)`,
        [idPermisos]
    );
    // transformamos a un objeto { modulo: [permiso1, permiso2, ...] }
    const permisosPorModulo = {};
    rows.forEach(row => {
        if (!permisosPorModulo[row.nombre_modulo]) {
            permisosPorModulo[row.nombre_modulo] = [];
        }
        permisosPorModulo[row.nombre_modulo].push(row.nombre_perm);
    });
    return permisosPorModulo;

}
