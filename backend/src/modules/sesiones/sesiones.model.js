import pool from '../../config/conexion_bd.js';

export async function registrarUsuarioSucursal(idUsuario, idSucursal) {
    const conecction = await pool.getConnection()

    try{
        await conecction.beginTransaction();

        const sucursalId = idSucursal || null;

        const [resultUsuarioSucursal] = await conecction.query(
            'INSERT INTO usuarios_sucursal (usuarios_id_usuario, sucursales_id_sucursal) VALUES (?, ?)',
            [idUsuario, sucursalId]
        );

        const idUsuarioSucursal =  resultUsuarioSucursal.insertId;

        const [resultSesion] = await conecction.query (
            'INSERT INTO sesiones (fecha_entrada_ses, usuarios_sucursal_id_usuarios_sucursal) VALUES(NOW(), ?)',
            [idUsuarioSucursal]
        );

        const idSesion = resultSesion.insertId; // <-- captura el id de la sesión

        await conecction.commit();

        return { idUsuarioSucursal, idSesion };

    }catch(error){
        await conecction.rollback();
        throw error;
    } finally{
        conecction.release();
    }
}


export async function registrarFinSesion(idSesion) {
    const conecction = await pool.getConnection();
    try {
        const [result] = await conecction.query(
            'UPDATE sesiones SET fecha_finalizo_ses = NOW() WHERE id_sesion = ?',
            [idSesion]
        );
        return result.affectedRows;
    } catch (error) {
        throw error;
    } finally {
        conecction.release();
    }
}

export async function obtenerDatosSesion() {
    const [rows] = await pool.query(
        `SELECT
            p.nombre_per,
            p.apellido_per,
            u.nombre_usuario,
            r.nombre_rol,
            s.nombre_suc,
            s.ubicacion_suc,
            ses.id_sesion,
            ses.fecha_entrada_ses,
            ses.fecha_finalizo_ses
        FROM sesiones ses
        JOIN usuarios_sucursal us ON us.id_usuarios_sucursal = ses.usuarios_sucursal_id_usuarios_sucursal
        JOIN usuarios u ON u.id_usuario = us.usuarios_id_usuario
        JOIN personal p ON p.id_personal = u.personal_id_personal
        JOIN roles r ON r.id_rol = u.roles_id_rol
        LEFT JOIN sucursales s ON s.id_sucursal = us.sucursales_id_sucursal
        ORDER BY ses.fecha_entrada_ses DESC`
    );
    return rows;
}

