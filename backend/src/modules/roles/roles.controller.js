import * as RolesModel from './roles.model.js'
import { insertarMovimiento, TIPOS_MOVIMIENTO } from '../movimientos/movimientos.model.js';

export async function crearRol(req, res) {
    try{
        const nuevoId = await RolesModel.crearRol(req.body);

        const permisos = await RolesModel.obtenerPermisos(req.body.permisos);
        console.log(JSON.stringify(permisos));

        let oracionLegible = []
        for (const valPropiedad in permisos) {
            oracionLegible.push(`${valPropiedad}: ${permisos[valPropiedad]}`); // Formateamos cada módulo con sus permisos como "Módulo -> Permiso1, Permiso2"
        }

        const detalles = `, Permisos -> ${oracionLegible.join(', ')} ` 
        await insertarMovimiento(TIPOS_MOVIMIENTO.CREACION, 'Rol: ' + req.body.nombre_rol + detalles, req.usuario.id); // Registramos el movimiento de creación de rol
        res.status(201).json({ id: nuevoId, mensaje: `Rol creado exitosamente` });
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

        const cuerpoAnterior = await RolesModel.obtenerRolPorId(id);

        const permisosAnteriores = cuerpoAnterior.permisos; // [4, 5, 6, 1]
        const permisosEnviados = req.body.permisos; // [4, 5, 6, 2]

        for (const valPropiedad in req.body) {
            if (cuerpoAnterior[valPropiedad] !== req.body[valPropiedad]) {
                console.log(`Valor cambiado para ${valPropiedad}: ${cuerpoAnterior[valPropiedad]} -> ${req.body[valPropiedad]}`);
            }
        }

        const permisosActivados = permisosEnviados.filter(p => !permisosAnteriores.includes(p));
        const permisosDesactivados = permisosAnteriores.filter(p => !permisosEnviados.includes(p));

        if (permisosActivados.length > 0 || permisosDesactivados.length > 0) {
            console.log(`Permisos activados: ${permisosActivados.join(', ')}`);
            console.log(`Permisos desactivados: ${permisosDesactivados.join(', ')}`);
        } else {
            console.log('No se detectaron cambios en los permisos.');
        }

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
        const rolAnterior = await RolesModel.obtenerRolPorId(id);
        const filasAfectadas = await RolesModel.eliminarRol(id);
        if(filasAfectadas === 0){
            return res.status(404).json({ mensaje: "Rol no encontrado" });
        }
        await insertarMovimiento(TIPOS_MOVIMIENTO.ELIMINACION, 'Rol eliminado: ' + rolAnterior.nombre_rol, req.usuario.id); // Registramos el movimiento de eliminación de rol
        res.json({ mensaje: "Rol eliminado exitosamente" });
    }catch(error){
        console.error("❌ Error al eliminar rol:", error);
        if (error.message.includes('usuario(s) asignado(s)')) {
            return res.status(409).json({ mensaje: error.message });
        }
        res.status(500).json({ mensaje: "Error al eliminar el rol", error: error.message });
    }
}

export async function actualizarEstadoRol(req, res) {
    try{
        const { id } = req.params;
        const { estado } = req.body;
        const rolAnterior = await RolesModel.obtenerRolPorId(id);
        const filasAfectadas = await RolesModel.actualizarEstadoRol(id, estado);    
        if(filasAfectadas === 0){
            return res.status(404).json({ mensaje: "Rol no encontrado" });
        }
        await insertarMovimiento(TIPOS_MOVIMIENTO.ACTUALIZACION_ESTADO, `Estado del rol actualizado: ${rolAnterior.nombre_rol} a estado ${estado}`, req.usuario.id); // Registramos el movimiento de actualización de estado del rol
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
        const rolAnterior = await RolesModel.obtenerRolPorId(id);
        await insertarMovimiento(TIPOS_MOVIMIENTO.ACTUALIZACION_ESTADO, `Requiere sucursal actualizado: ${rolAnterior.nombre_rol} a ${requiereSucursal}`, req.usuario.id); // Registramos el movimiento de actualización de requiere sucursal
        res.json({ mensaje: "Requiere sucursal actualizado" });
    }catch(error){
        console.log("Error al actualizar requiere sucursal")
        res.status(500).json({ mensaje: "Error al actualizar require sucursal", error: error.message })
    }
}
