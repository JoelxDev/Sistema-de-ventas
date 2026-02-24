import * as ProductoModel from './productos.model.js';

export async function crearProducto(req, res) {
    try {
        const idProducto = await ProductoModel.crearProducto(req.body);
        res.status(201).json({ id: idProducto, mensaje: "Producto creado exitosamente" });
    } catch (error) {
        console.error("❌ Error al crear producto:", error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
}

export async function obtenerProductos(req, res) {
    try {
        const productos = await ProductoModel.obtenerProductos()
        res.json(productos);
    } catch(error) {
        console.error("❌ Error al obtener productos:", error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
}

export async function obtenerProductoPorId(req, res) {
    try {
        const { idProducto } = req.params;
        const producto = await ProductoModel.obtenerProductoPorId(idProducto);
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.json(producto)
    } catch(error) {
        console.error("❌ Error al obtener producto por ID:", error);
        res.status(500).json({ mensaje: "Error al obtener la producto", error: error.message })
    }
}

export async function actualizarProducto(req, res) {
    try {
        const { idProducto } = req.params;
        const filasAfectadas = await ProductoModel.actualizarProducto(idProducto, req.body);
        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado", producto: idProducto || "Hola" });
        }
        res.json({ mensaje: "Producto actualizado correctamente", datosActualizados: req.body });
    }catch (error){
        console.error("❌ Error al actualizar el producto:", error);
        res.status(500).json({ mensaje: "Error al actualizar el producto", error: error.message })
    }
}

export async function eliminarProducto(req, res) {
    try {
        const { idProducto } = req.params
        const producto = await ProductoModel.obtenerProductoPorId(idProducto)
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" })
        }
        if (producto.estado_prod !== 'activo') {
            return res.status(400).json({
                mensaje: "No se puede eliminar un producto con estado ACTIVO"
            })
        }

        const filasAfectadas = await ProductoModel.eliminarProducto(idProducto)

        if (filasAfectadas === 0) {
            return res.status(500).json({ mensaje: "No se pudo eliminar el producto" })
        }

        res.json({ mensaje: "Producto eliminado correctamente" })
    } catch(error) {
        console.error("❌ Error al eliminar el producto:", error);
        res.status(500).json({ mensaje: "Error al eliminar el producto", error: error.message })
    }
}

export async function actualizarEstadoProducto(req, res) {
    try {
        const { idProducto } = req.params
        const { estadoProducto } = req.body
        await ProductoModel.actualizarEstadoProducto(idProducto, estadoProducto)
        res.json({ mensaje: "Estado del producto actualizado correctamente" })
    } catch (error) {
        console.error("❌ Error al actualizar estado del producto:", error);
        res.status(500).json({ mensaje: "Error al actualizar estado del producto", error: error.message })
    }
}