import * as SucursalModel from './sucursales.model.js';
import { insertarMovimiento, TIPOS_MOVIMIENTO } from '../movimientos/movimientos.model.js';

export async function crearSucursal(req, res) {
    try {
        const nuevoId = await SucursalModel.crearSucursal(req.body);
        await insertarMovimiento(TIPOS_MOVIMIENTO.CREACION, 'Nueva sucursal creada con ID: ' + req.body.nombre_suc, req.usuario.id); // Registramos el movimiento de creación de sucursal
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
        const sucursalAnterior = await SucursalModel.obtenerSucursalPorId(id); // Obtenemos la sucursal antes de la actualización para registrar el movimiento con los datos anteriores
        if (!sucursalAnterior) {
            return res.status(404).json({ mensaje: "Sucursal no encontrada" });
        }
        // Identificamos los cambios realizados para registrar en el movimiento
        let cambios = [];
        const remasterizar = {
            nombre_suc: "Nombre",
            ubicacion_suc: "Direccion",
        }
        for (const nombPropiedad in req.body){ // Comparamos cada campo del cuerpo de la solicitud con la sucursal anterior para detectar cambios
            if (req.body[nombPropiedad] !== sucursalAnterior[nombPropiedad]){ // Si el valor del campo ha cambiado [nombPropiedad], lo agregamos a la lista de cambios
                 cambios.push(`${remasterizar[nombPropiedad]}: ${sucursalAnterior[nombPropiedad]} -> ${req.body[nombPropiedad]}`); // Formateamos el cambio como "campo amigable: valor anterior -> nuevo valor"
            }
        }
        const detalles = cambios.length > 0 ? cambios.join(', ') : 'Sin cambios detectados';
        const filasAfectadas = await SucursalModel.actualizarSucursal(id, req.body);
        await insertarMovimiento(TIPOS_MOVIMIENTO.EDICION, detalles, req.usuario.id); // Registramos el movimiento de edición de sucursal con los cambios realizados
        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: "Sucursal no encontrada" });
        }
        res.json({ mensaje: "Sucursal actualizada correctamente " });
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
        await insertarMovimiento(TIPOS_MOVIMIENTO.ELIMINACION, `Nombre: ${sucursal.nombre_suc}, ID: ${id}`, req.usuario.id); // Registramos el movimiento de eliminación de sucursal
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
        const sucursal = await SucursalModel.obtenerSucursalPorId(id);
        if (!sucursal) {
            return res.status(404).json({ mensaje: "Sucursal no encontrada" });
        }
        await insertarMovimiento(TIPOS_MOVIMIENTO.ACTUALIZACION_ESTADO, `Nombre: ${sucursal.nombre_suc} a estado: ${estado}`, req.usuario.id); // Registramos el movimiento de actualización de estado de sucursal
        res.json({ mensaje: "Estado de sucursal actualizado correctamente" });
    } catch (error) {
        console.error("❌ Error al actualizar estado de sucursal:", error);
        res.status(500).json({ mensaje: "Error al actualizar el estado de la sucursal", error: error.message });
    }
}

export async function obtenerSucursalesActivas(req, res) {
    try {
        const sucursales = await SucursalModel.obtenerSucursalesActivas();
        res.json(sucursales);
    } catch (error) {
        console.error("❌ Error al obtener sucursales activas:", error);
        res.status(500).json({ mensaje: "Error al obtener las sucursales activas", error: error.message });
    }
}