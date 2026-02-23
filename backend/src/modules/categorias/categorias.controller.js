import * as CategoriasModel from './categorias.model.js';

export async function crearCategoria(req, res) {
    try {
        const nuevoId = await CategoriasModel.crearCategoria(req.body);
        res.status(201).json({ id: nuevoId, mensaje: "Categoría creada exitosamente" });
    } catch (error) {
        console.error("❌ Error al crear categoría:", error);
        res.status(500).json({ mensaje: "Error al crear la categoría", error: error.message });
    }
}

export async function obtenerTodasLasCategorias(req, res) {
    try {
        const categorias = await CategoriasModel.obtenerTodasLasCategorias();
        res.json(categorias);
    }catch (error) {
        console.error("❌ Error al obtener categorías:", error);
        res.status(500).json({ mensaje: "Error al obtener las categorías", error: error.message });
    }
}

export async function obtenerCategoriaPorId(req, res) {
    try {
        const { idCategoria } = req.params;
        const categoria = await CategoriasModel.obtenerCategoriaPorId(idCategoria);
        if (!categoria) {
            return res.status(404).json({ mensaje: "Categoría no encontrada" });
        }
        res.json(categoria);
    } catch (error) {
        console.error("❌ Error al obtener categoría por ID:", error);
        res.status(500).json({ mensaje: "Error al obtener la categoría", error: error.message });
    }
}

export async function actualizarCategoria(req, res) {
    try {
        const { idCategoria } = req.params;
        const filasAfectadas = await CategoriasModel.actualizarCategoria(idCategoria, req.body);
        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: "Categoría no encontrada" });
        }
        res.json({ mensaje: "Categoría actualizada correctamente" });
    } catch (error) {
        console.error("❌ Error al actualizar categoría:", error);
        res.status(500).json({ mensaje: "Error al actualizar la categoría", error: error.message });
    }
}

export async function eliminarCategoria(req, res) {
    try {
        const { idCategoria } = req.params;
        const filasAfectadas = await CategoriasModel.eliminarCategoria(idCategoria);
        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: "Categoría no encontrada" });
        }
        res.json({ mensaje: "Categoría eliminada exitosamente" });
    } catch (error) {
        console.error("❌ Error al eliminar categoría:", error);
        res.status(500).json({ mensaje: "Error al eliminar la categoría", error: error.message });
    }
}

