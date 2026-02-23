import * as LoginModel from './autenticacion.model.js';
import { registrarUsuarioSucursal, registrarFinSesion } from '../sesiones/sesiones.model.js';
import jwt from 'jsonwebtoken';

export async function login(req, res) {

    try{
        const { nombre_usuario, contrasenia, sucursalLogin } = req.body;
        if (!nombre_usuario || !contrasenia) {
            return res.status(400).json({ mensaje: "Usuario y contrasenia son requeridos" });
        }
        // Usamos el modelo autenticacion
        const usuario =  await LoginModel.loginSesion(nombre_usuario, contrasenia, sucursalLogin);

        // Registramos la sesion usando el modelo sesiones


        const { idUsuarioSucursal, idSesion } = await registrarUsuarioSucursal(usuario.id_usuario, sucursalLogin);

        // Crear el token JWT
        const token = jwt.sign(
            {
                id: usuario.id_usuario,
                usuario: usuario.nombre_usuario,
                rol: usuario.nombre_rol,
                permisos: usuario.permisos,
                idSesion,
                // idUsuarioSucursal,
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.cookie('token', token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:'strict',
            maxAge: 8 * 60 * 60 * 1000,
        });

        res.json({
            mensaje: "Login exitoso",
            usuario
        })

    } catch (error) {
        console.error("❌ Error en el login:", error.message);
        res.status(401).json({ mensaje: error.message });
    }

}

export async function logout(req, res) {
    try{
        const { idSesion } = req.usuario;

        await registrarFinSesion(idSesion);

        res.clearCookie('token');
        res.json({mensaje: 'Sesion cerrada'})
    }catch(error){
        console.error("❌ Error en el logout:", error.message);
        res.status(500).json({ mensaje: error.message });
    }
}

export async function verificarSesion(req, res) {
    // Ruta para verificar si el TOKEN sigue válido
    res.json({
        mensaje: "Token válido",
        usuario: req.usuario
    })
}
