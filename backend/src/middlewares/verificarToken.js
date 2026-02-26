import jwt from 'jsonwebtoken';
import { registrarFinSesion } from '../modules/sesiones/sesiones.model.js';

export async function verificarToken(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ mensaje: "No hay token, acceso denegado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();

    } catch (error) {

        // ✅ Token expirado → registrar cierre de sesión en BD
        if (error.name === "TokenExpiredError") {
            try {
                const decoded = jwt.decode(token); // Decodifica sin verificar
                if (decoded?.idSesion) {
                    await registrarFinSesion(decoded.idSesion);
                    console.log(`✅ Sesión ${decoded.idSesion} cerrada por token expirado`);
                }
            } catch (errBD) {
                console.error("❌ Error al cerrar sesión huérfana:", errBD.message);
            } 
            return res.status(401).json({ mensaje: "Token expirado, sesión cerrada" });
        }

        return res.status(401).json({ mensaje: "Token inválido" });
    }
}