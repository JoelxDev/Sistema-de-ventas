import * as SesionModel from './sesiones.model.js'

export async function obtenerDatosSesiones(req, res) {
    try {
        const datosSesiones = await SesionModel.obtenerDatosSesion();
        res.json(datosSesiones);
    }catch (error) {
        console.error("❌ Error al obtener datos de sesiones:", error);
        res.status(500).json({ mensaje: "Error al obtener los datos de sesiones", error: error.message });
    }
}
