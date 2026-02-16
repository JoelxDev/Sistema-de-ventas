import * as PermisosModel from './permisos.model.js';

export async function crearPermiso(req, res) {
    try {
        const nuevoId = await PermisosModel.crearPermiso(req.body);
        res.status(201).json({ id: nuevoId, mensaje: "Permiso creado exitosamente" });
    } catch (error) {
        console.error("❌ Error al crear permiso:", error);
        res.status(500).json({ mensaje: "Error al crear el permiso", error: error.message });
    }
}

export async function obtenerTodosLosPermisos(req, res) {
    try {
        const permisos = await PermisosModel.obtenerTodosLosPermisos();
        res.json(permisos);
    } catch (error) {
        console.error("❌ Error al obtener permisos:", error);
        res.status(500).json({ mensaje: "Error al obtener los permisos", error: error.message });
    }  
}

export async function obtenerPermisoPorId(req, res) {
    try {
        const { id } = req.params;
        const permiso = await PermisosModel.obtenerPermisoPorId(id);
        if (!permiso) {
            return res.status(404).json({ mensaje: "Permiso no encontrado" });
        }
        res.json(permiso);
    } catch (error) {   
        console.error("❌ Error al obtener permiso por ID:", error);
        res.status(500).json({ mensaje: "Error al obtener el permiso", error: error.message });
    }
}

export async function actualizarPermiso(req, res) {
    try {
        const { id } = req.params;
        const filasAfectadas = await PermisosModel.actualizarPermiso(id, req.body);
        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: "Permiso no encontrado" });
        }
        res.json({ mensaje: "Permiso actualizado exitosamente",  });
    } catch (error) {
        console.error("❌ Error al actualizar permiso:", error);
        res.status(500).json({ mensaje: "Error al actualizar el permiso", error: error.message });
    }
}

export async function eliminarPermiso(req, res) {
    try {
        const { id } = req.params;
        const filasAfectadas = await PermisosModel.eliminarPermiso(id);
        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: "Permiso no encontrado" });
        }
        res.json({ mensaje: "Permiso eliminado exitosamente" });
    } catch (error) {
        console.error("❌ Error al eliminar permiso:", error);
        res.status(500).json({ mensaje: "Error al eliminar el permiso", error: error.message });
    }
}

export async function actualizarEstadoPermiso(req, res) {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const filasAfectadas = await PermisosModel.actualizarEstadoPermiso(id, estado);
        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: "Permiso no encontrado" });
        }
        res.json({ mensaje: "Estado del permiso actualizado exitosamente" });
    } catch (error) {
        console.error("❌ Error al actualizar estado del permiso:", error);
        res.status(500).json({ mensaje: "Error al actualizar el estado del permiso", error: error.message });
    }
}