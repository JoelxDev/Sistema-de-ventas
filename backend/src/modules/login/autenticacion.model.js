import pool from "../../config/conexion_bd.js";
import bcrypt from "bcrypt";



export async function loginSesion(nombre_usuario, contrasenia, sucursalLogin) {

    const [usuarios] = await pool.query(
        `SELECT
            u.id_usuario,
            u.nombre_usuario,
            u.contrasenia_usuario,
            u.estado_usuario,
            u.roles_id_rol,
            p.nombre_per,
            r.nombre_rol,
            r.requiere_sucursal
        FROM usuarios u
        JOIN personal p ON p.id_personal = u.personal_id_personal
        JOIN roles r ON r.id_rol = u.roles_id_rol
        WHERE u.nombre_usuario = ?`,
        [nombre_usuario]);
        
        if (usuarios.length === 0) {
            throw new Error("Usuario no encontrado");
        }
        const usuario = usuarios[0];

        if(usuario.estado_usuario !== 'activo') {
            throw new Error("Usuario inactivo. Solicite activacion.");
        }

        const contraseniaValida = await bcrypt.compare(contrasenia, usuario.contrasenia_usuario);
        if(!contraseniaValida) {
            throw new Error("Contraseña incorrecta");
        }
        
        if(usuario.requiere_sucursal === 'si' && !sucursalLogin) {
            throw new Error("Este usuario requiere ingresar una sucursal");
        }

        const [filaSucursal] = await pool.query(
            'SELECT * FROM sucursales WHERE id_sucursal = ? ',
        [sucursalLogin]
        );

        if(usuario.requiere_sucursal === 'si' && filaSucursal.length === 0){
            throw new Error("Sucursal no encontrada");
        }

        const sucursal = filaSucursal[0];

        if(usuario.requiere_sucursal === 'si' && sucursal.estado_suc !== 'activo') {
            throw new Error("Esta sucursal esta inactiva");
        }


        const [permisos] = await pool.query(
            `SELECT p.nombre_perm, m.nombre_modulo
             FROM roles_y_permisos rp
             JOIN permisos p ON rp.permisos_id_permiso = p.id_permiso
             JOIN modulos m ON m.id_modulo = p.modulos_id_modulo
             WHERE rp.roles_id_rol = ? AND p.estado_perm = 'activo' AND m.estado_modulo = 'activo'`,
             [usuario.roles_id_rol]
        )

        const permisosEstructurados = {};
        permisos.forEach(p => {
            if (!permisosEstructurados[p.nombre_modulo]) {
                permisosEstructurados[p.nombre_modulo] = [];
            }
            permisosEstructurados[p.nombre_modulo].push(p.nombre_perm);
        })

        return {
            id_usuario: usuario.id_usuario,
            nombre_usuario: usuario.nombre_usuario,
            nombre_personal: usuario.nombre_per,
            nombre_rol: usuario.nombre_rol,
            permisos: permisosEstructurados
        }
}
