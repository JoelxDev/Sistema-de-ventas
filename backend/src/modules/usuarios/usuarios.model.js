import pool from '../../config/conexion_bd.js';
import bcryp from 'bcrypt'

export async function obtenerTodosLosPersonales() {
    const [rows] = await pool.query(`
        SELECT p.*, u.estado_usuario, u.nombre_usuario, r.nombre_rol
        FROM personal p
        LEFT JOIN usuarios u ON u.personal_id_personal = p.id_personal
        LEFT JOIN roles r ON r.id_rol = u.roles_id_rol
    `);
    return rows;
}

export async function obtenerPersonalPorId(id) {
    const [rows] = await pool.query(
        `SELECT p.*, u.roles_id_rol 
        FROM personal p
        LEFT JOIN usuarios u ON u.personal_id_personal = p.id_personal
        WHERE p.id_personal = ?`, [id]
    );
    return rows[0];
}

export async function crearPersonal(datos) {
    const { nombre_per, apellido_per, dni_per, telefono_per, correo_elect_per, roles_id_rol } = datos;
    const connection = await pool.getConnection();

    const [rol] = await pool.query(
        'SELECT id_rol FROM roles WHERE id_rol = ? AND estado_rol = "activo"',
        [roles_id_rol]
    );

    if (rol.length === 0) {
        throw new Error("El rol asociado no existe o no está activo.");
    }

    try {
        await connection.beginTransaction();

        const [resultPersonal] = await pool.query(
            'INSERT INTO personal (nombre_per, apellido_per, dni_per, telefono_per, correo_elect_per, fecha_crea_per) VALUES (?, ?, ?, ?, ?, NOW())',
            [nombre_per, apellido_per, dni_per, telefono_per, correo_elect_per]
        );
        // return resultPersonal.insertId;
        const idPersonal = resultPersonal.insertId;

        // 2. Generar credenciales de usuario
        // nombre_usuario: primer nombre + primer apellido
        const primerNombre = nombre_per.split(' ')[0].toLowerCase();
        const primerApellido = apellido_per.split(' ')[0].toLowerCase();
        const nombreUsuario = `${primerNombre}${primerApellido}`;
        // contraseña: dni + inicial del nombre
        const inicialNombre = nombre_per.charAt(0).toUpperCase();
        const contraseniaPlana = `${dni_per}${inicialNombre}`;
        // Encriptar contraseña
        const contraseniaHash = await bcryp.hash(contraseniaPlana, 10);

        await connection.query(
            'INSERT INTO usuarios (nombre_usuario, contrasenia_usuario, estado_usuario, roles_id_rol, personal_id_personal) VALUES (?, ?, ?, ?, ?)',
            [nombreUsuario, contraseniaHash, 'inactivo', roles_id_rol, idPersonal]
        )

        await connection.commit();

        return {
            id_personal: idPersonal,
            nombre_usuario: nombreUsuario,
            contrasenia_temporal: contraseniaPlana
        }
    } catch(error){
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

export async function actualizarPersonal(id, datos) {
    const { nombre_per, apellido_per, dni_per, telefono_per, correo_elect_per, roles_id_rol } = datos;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query(
            'UPDATE personal SET nombre_per = ?, apellido_per = ?, dni_per = ?, telefono_per = ?, correo_elect_per = ? WHERE id_personal = ?',
            [nombre_per, apellido_per, dni_per, telefono_per, correo_elect_per, id]
        );

        await connection.query(
            'UPDATE usuarios SET roles_id_rol = ? WHERE personal_id_personal = ?',
            [roles_id_rol, id]
        );

    }catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}


export async function eliminarPersonalUsuario(id) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Eliminar usuario asociado
        await connection.query(
            'DELETE FROM usuarios WHERE personal_id_personal = ?', [id]
        );

        const [result] = await connection.query(
            'DELETE FROM personal WHERE id_personal = ?', [id]
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

export async function actualizarEstadoUsuario(id, estado) {
    const [result] = await pool.query(
        'UPDATE usuarios SET estado_usuario = ? WHERE personal_id_personal = ?',
        [estado, id]
    );
    return result.affectedRows;
}