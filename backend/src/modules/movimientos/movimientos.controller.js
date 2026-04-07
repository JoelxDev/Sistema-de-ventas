import * as MovimientosModel from './movimientos.model.js';

export async function registrarMovimiento(req, res) {
    try {
        const { movimiento, detalles } = req.body;
        const idUsuario = req.usuario.id; // obtenemos el ID del usuario desde el token JWT
        const idMovimiento = await MovimientosModel.insertarMovimiento(movimiento, detalles, idUsuario);
        res.status(201).json({ id: idMovimiento, mensaje: "Movimiento registrado exitosamente" });
    } catch (error) {
        console.error("❌ Error al registrar movimiento:", error);
        res.status(500).json({ mensaje: "Error al registrar el movimiento", error: error.message });
    }
}