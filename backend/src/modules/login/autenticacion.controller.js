import * as LoginModel from './autenticacion.model.js';
import jwt from 'jsonwebtoken';

export async function login(req, res) {

    try{
        const { nombre_usuario, contrasenia } = req.body;
        if (!nombre_usuario || !contrasenia) {
            return res.status(400).json({ mensaje: "Usuario y contrasenia son requeridos" });
        }
        const usuario =  await LoginModel.loginSesion(nombre_usuario, contrasenia);

        // Crear el token JWT
        const token = jwt.sign(
            {
                id: usuario.id_usuario,
                usuario: usuario.nombre_usuario,
                rol: usuario.nombre_rol,
                permisos: usuario.permisos
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
    res.clearCookie('token');
    res.json({mensaje: 'Sesion cerrada'})
}

export async function verificarSesion(req, res) {
    // Ruta para verificar si el TOKEN sigue válido
    res.json({
        mensaje: "Token válido",
        usuario: req.usuario
    })
}
