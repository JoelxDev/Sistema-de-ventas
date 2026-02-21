import * as SucursalModel from './sucursales.model.js';

export async function crearSucursal(req, res) {
    try {
        // console.log("📥 Datos recibidos para crear sucursal:", req.body);
        const nuevoId = await SucursalModel.crearSucursal(req.body);
        res.status(201).json({ id: nuevoId, mensaje: "Sucursal creada exitosamente" });
    } catch (error) {
        console.error("❌ Error al crear sucursal:", error);
        res.status(500).json({ mensaje: "Error al crear la sucursal", error: error.message });
    }
}

export async function obtenerSucursales(req, res) {
    try {
        const sucursales = await SucursalModel.obtenerSucursales();
        res.json(sucursales);
    } catch (error) {
        console.error("❌ Error al obtener sucursales:", error);
        res.status(500).json({ mensaje: "Error al obtener las sucursales", error: error.message });
    }
}

export async function obtenerSucursalPorId(req, res) {
    try {
        const { id } = req.params;
        const sucursal  = await SucursalModel.obtenerSucursalPorId(id)
        if (!sucursal) {
            return res.status(404).json({ mensaje: "Sucursal no encontrada" });
        }
        res.json(sucursal);
    } catch (error) {
        console.error("❌ Error al obtener sucursal por ID:", error);
        res.status(500).json({ mensaje: "Error al obtener la sucursal", error: error.message });
    }
}

export async function actualizarSucursal(req, res) {
    try {
        const { id } = req.params;
        const filasAfectadas = await SucursalModel.actualizarSucursal(id, req.body);
        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: "Sucursal no encontrada" });
        }
        res.json({ mensaje: "Sucursal actualizada correctamente" });
    } catch (error) {
        console.error("❌ Error al actualizar sucursal:", error);
        res.status(500).json({ mensaje: "Error al actualizar la sucursal", error: error.message });
    }
}

export async function eliminarSucursal(req, res){
    try {
        const { id } = req.params;

        const sucursal = await SucursalModel.obtenerSucursalPorId(id);
        if (!sucursal) {
            return res.status(404).json({ mensaje: "Sucursal no encontrada" });
        }

        if (sucursal.estado_suc !== 'inactivo') {
            return res.status(400).json({ 
                mensaje: "No se puede eliminar la sucursal porque está en estado '" + sucursal.estado_suc + "'. Debe estar en estado 'inactivo'" 
            });
        }

        const filasAfectadas = await SucursalModel.eliminarSucursal(id);
        if (filasAfectadas === 0) {
            return res.status(500).json({ mensaje: "No se pudo eliminar la sucursal" });
        }
        res.json({ mensaje: "Sucursal eliminada exitosamente" });
    } catch (error) {
        console.error("❌ Error al eliminar sucursal:", error);
        res.status(500).json({ mensaje: "Error al eliminar la sucursal", error: error.message });
    }
}

export async function actualizarEstadoSucursal(req, res) {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        await SucursalModel.actualizarEstadoSucursal(id, estado);
        res.json({ mensaje: "Estado de sucursal actualizado correctamente" });
    } catch (error) {
        console.error("❌ Error al actualizar estado de sucursal:", error);
        res.status(500).json({ mensaje: "Error al actualizar el estado de la sucursal", error: error.message });
    }
}