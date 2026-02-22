import * as RolesModel from './roles.model.js'

export async function crearRol(req, res) {
    try{
        const nuevoId = await RolesModel.crearRol(req.body);
        res.status(201).json({ id: nuevoId, mensaje: "Rol creado exitosamente" });
    }catch(error){
        console.error("❌ Error al crear rol:", error);
        res.status(500).json({ mensaje: "Error al crear el rol", error: error.message });
    }
}

export async function obtenerTodosLosRoles(req, res) {
    try{
        const roles = await RolesModel.obtenerTodosLosRoles();
        res.json(roles);
    }catch(error){
        console.error("❌ Error al obtener roles:", error);
        res.status(500).json({ mensaje: "Error al obtener los roles", error: error.message });
    }
}

export async function obtenerRolPorId(req, res) {
    try{
        const { id } = req.params;
        const rol = await RolesModel.obtenerRolPorId(id);
        if(!rol){
            return  res.status(404).json({ mensaje: "Rol no encontrado" });
        }
        res.json(rol);
    }catch(error){   
        console.error("❌ Error al obtener rol por ID:", error);
        res.status(500).json({ mensaje: "Error al obtener el rol", error: error.message });
    }   
}

export async function actualizarRol(req, res) {
    try{
        const { id } = req.params;  
        const filasAfectadas = await RolesModel.actualizarRol(id, req.body);
        if(filasAfectadas === 0){
            return res.status(404).json({ mensaje: "Rol no encontrado" });
        }
        res.json({ mensaje: "Rol actualizado exitosamente" });
    }catch(error){
        console.error("❌ Error al actualizar rol:", error);
        res.status(500).json({ mensaje: "Error al actualizar el rol", error: error.message });
    }
}

export async function eliminarRol(req, res) {
    try{
        const { id } = req.params;
        const filasAfectadas = await RolesModel.eliminarRol(id);
        if(filasAfectadas === 0){
            return res.status(404).json({ mensaje: "Rol no encontrado" });
        }
        res.json({ mensaje: "Rol eliminado exitosamente" });
    }catch(error){
        console.error("❌ Error al eliminar rol:", error);
        res.status(500).json({ mensaje: "Error al eliminar el rol", error: error.message });
    }
}

export async function actualizarEstadoRol(req, res) {
    try{
        const { id } = req.params;
        const { estado } = req.body;
        const filasAfectadas = await RolesModel.actualizarEstadoRol(id, estado);    
        if(filasAfectadas === 0){
            return res.status(404).json({ mensaje: "Rol no encontrado" });
        }
        res.json({ mensaje: "Estado del rol actualizado exitosamente" });
    }catch(error){
        console.error("❌ Error al actualizar estado del rol:", error);
        res.status(500).json({ mensaje: "Error al actualizar el estado del rol", error: error.message });
    }
}

export async function actualizarRequiereSucursal(req, res) {
    try{
        const { id } = req.params;
        const { requiereSucursal } = req.body;
        const filasAfectadas = await RolesModel.actualizarRequiereSucursal(id, requiereSucursal);
        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: "Rol no encontrado" });
        }
        res.json({ mensaje: "Requiere sucursal actualizado" })
    }catch(error){
        console.log("Error al actualizar requiere sucursal")
        res.status(500).json({ mensaje: "Error al actualizar require sucursal", error: error.message })
    }
}
