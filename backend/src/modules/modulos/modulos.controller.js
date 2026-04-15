import * as ModuloModel from './modulos.model.js';
import { insertarMovimiento, TIPOS_MOVIMIENTO } from '../movimientos/movimientos.model.js';

export async function crearModulo(req, res) {
    try {
        const nuevoId = await ModuloModel.crearModulo(req.body);
        await insertarMovimiento(TIPOS_MOVIMIENTO.CREACION, 'Nuevo modulo: ' + req.body.nombre_modulo, req.usuario.usuario); // Registramos el movimiento de creación de modulo
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
        console.error("❌ Error al obtener modulos:", error);
        res.status(500).json({ mensaje: "Error al obtener los modulos", error: error.message });
    }
}

export async function obtenerModuloPorId(req, res) {
    try {
        const { id } = req.params;
        const modulo = await ModuloModel.obtenerModuloPorId(id);
        if (!modulo) {
            return res.status(404).json({ mensaje: "Modulo no encontrado" });
        }
        res.json(modulo);
    } catch (error) {   
        console.error("❌ Error al obtener modulo por ID:", error);
        res.status(500).json({ mensaje: "Error al obtener el modulo", error: error.message });
    }
}

export async function actualizarModulo(req, res) {
    try {
        const { id } = req.params;
        const moduloAnterior = await ModuloModel.obtenerModuloPorId(id); 
        const filasAfectadas = await ModuloModel.actualizarModulo(id, req.body);
        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: "Modulo no encontrado" });
        }
        let cambios = [];
        const remasterizar = {
            nombre_modulo: "Nombre",
            descripcion_modulo: "Descripcion"
        }
        for (const nombPropiedad in req.body){
            if (req.body[nombPropiedad] !== moduloAnterior[nombPropiedad]){
                cambios.push(`${remasterizar[nombPropiedad] || nombPropiedad}: ${moduloAnterior[nombPropiedad]} -> ${req.body[nombPropiedad]}`);
            }
        }
        const detalles = cambios.length > 0 ? cambios.join(', ') : 'Sin cambios detectados';
        await insertarMovimiento(TIPOS_MOVIMIENTO.EDICION, detalles, req.usuario.usuario); 
        res.json({ mensaje: "Modulo actualizado correctamente" });
    } catch (error) {
        console.error("❌ Error al actualizar modulo:", error);
        res.status(500).json({ mensaje: "Error al actualizar el modulo", error: error.message });
    }
}

export async function eliminarModulo(req, res) {
    try {
        const { id } = req.params; 
        const moduloEliminado = await ModuloModel.obtenerModuloPorId(id);
        if (!moduloEliminado) {
            return res.status(404).json({ mensaje: "Modulo no encontrado" });
        }
        const filasAfectadas = await ModuloModel.eliminarModulo(id);
        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: "Modulo no encontrado" });
        }
        await insertarMovimiento(TIPOS_MOVIMIENTO.ELIMINACION, `Modulo eliminado: ${moduloEliminado.nombre_modulo}`, req.usuario.usuario); 
        res.json({ mensaje: "Modulo eliminado exitosamente" });
    } catch (error) {
        console.error("❌ Error al eliminar modulo:", error);
        res.status(500).json({ mensaje: "Error al eliminar el modulo", error: error.message });
    }
}

export async function actualizarEstadoModulo(req, res) {
    try{
        const { id } = req.params;
        const modulo = await ModuloModel.obtenerModuloPorId(id);
        if (!modulo) {
            return res.status(404).json({ mensaje: "Modulo no encontrado" });
        }
        const { estado } = req.body;
        await ModuloModel.actualizarEstadoModulo(id, estado)
        await insertarMovimiento(TIPOS_MOVIMIENTO.ACTUALIZACION_ESTADO, `Estado del modulo: ${modulo.nombre_modulo} | actualizado a: ${estado}`, req.usuario.usuario);
        res.json({ mensaje: "Estado del modulo actualizado correctamente"})
    }catch (error) {
        console.error("Error al actualizar el estado del modulo: ", error);
        res.status(500).json({ mensaje: "Error al actulizar estado del modulo", error: error.mensaje })
    }
}

