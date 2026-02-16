import * as ModuloModel from './modulos.model.js';

export async function crearModulo(req, res) {
    try {
        const nuevoId = await ModuloModel.crearModulo(req.body);
        res.status(201).json({ id: nuevoId, mensaje: "Permiso creado exitosamente" });
    } catch (error) {
        console.error("❌ Error al crear permiso:", error);
        res.status(500).json({ mensaje: "Error al crear el permiso", error: error.message });
    }
}

export async function obtenerTodosLosModulos(req, res) {
    try {
        const modulos = await ModuloModel.obtenerTodosLosModulos();
        res.json(modulos);
    } catch (error) {
        console.error("❌ Error al obtener permisos:", error);
        res.status(500).json({ mensaje: "Error al obtener los permisos", error: error.message });
    }
}

export async function obtenerModuloPorId(req, res) {
    try {
        const { id } = req.params;
        const modulo = await ModuloModel.obtenerModuloPorId(id);
        if (!modulo) {
            return res.status(404).json({ mensaje: "Permiso no encontrado" });
        }
        res.json(modulo);
    } catch (error) {   
        console.error("❌ Error al obtener permiso por ID:", error);
        res.status(500).json({ mensaje: "Error al obtener el permiso", error: error.message });
    }
}

export async function actualizarModulo(req, res) {
    try {
        const { id } = req.params;
        const filasAfectadas = await ModuloModel.actualizarModulo(id, req.body);
        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: "Permiso no encontrado" });
        }
        res.json({ mensaje: "Modulo actualizado correctamente" });
    } catch (error) {
        console.error("❌ Error al actualizar permiso:", error);
        res.status(500).json({ mensaje: "Error al actualizar el permiso", error: error.message });
    }
}

export async function eliminarModulo(req, res) {
    try {
        const { id } = req.params; 
        const filasAfectadas = await ModuloModel.eliminarModulo(id);
        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: "Permiso no encontrado" });
        }
        res.json({ mensaje: "Permiso eliminado exitosamente" });
    } catch (error) {
        console.error("❌ Error al eliminar permiso:", error);
        res.status(500).json({ mensaje: "Error al eliminar el permiso", error: error.message });
    }
}

export async function actualizarEstadoModulo(req, res) {
    try{
        const { id } = req.params;
        const { estado } = req.body;
        await ModuloModel.actualizarEstadoModulo(id, estado)
        res.json({ mensaje: "Estado del modulo actualizado correctamente"})
    }catch (error) {
        console.error("Error al actualizar el estado del modulo: ", error);
        res.status(500).json({ mensaje: "Error al actulizar estado del modulo", error: error.mensaje })
    }
}

