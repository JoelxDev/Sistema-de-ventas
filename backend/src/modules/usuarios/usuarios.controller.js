import * as UsuariosModel from "./usuarios.model.js";
import { insertarMovimiento, TIPOS_MOVIMIENTO } from "../movimientos/movimientos.model.js";

export async function obtenerTodosLosPersonales(req, res) {
    try {
        const personales = await UsuariosModel.obtenerTodosLosPersonales();
        res.json(personales);
    } catch (error) {
        console.error("❌ Error al obtener personales:", error);
        res.status(500).json({ mensaje: "Error al obtener los personales", error: error.message });
    }
}

export async function obtenerPersonalPorId(req, res)  {
   try {
      const { id } = req.params;
      const personal = await UsuariosModel.obtenerPersonalPorId(id);

      if (!personal) {
         return res.status(404).json({ mensaje: "Personal no encontrado" });
      }
      res.json(personal);
   } catch (error) {
      console.error("❌ Error al obtener personal por ID:", error);
      res.status(500).json({ mensaje: "Error al obtener el personal", error: error.message });
   }
}

export async function crearPersonal(req, res) {
    try {
       const nuevoId = await UsuariosModel.crearPersonal(req.body); 
       await insertarMovimiento(TIPOS_MOVIMIENTO.CREACION, 'Nuevo usuario: ' + nuevoId.nombre_usuario, req.usuario.id); // Registramos el movimiento de creación de personal                       
       res.status(201).json({ id: nuevoId, mensaje: "Personal creado exitosamente" });
    } catch (error) {
       console.error("❌ Error al crear personal:", error);
       res.status(500).json({ mensaje: "Error al crear el personal", error: error.message });
    }
}

export async function actualizarPersonal(req, res) {
    try {
      const { id } = req.params;
      const usuarioAnterior = await UsuariosModel.obtenerPersonalPorId(id); // Obtenemos el usuario antes de la actualización para registrar el movimiento con los datos anteriores
      if (!usuarioAnterior) {
          return res.status(404).json({ mensaje: "Personal no encontrado" });
      }

      // Identificamos los cambios realizados para registrar en el movimiento
      let cambios = [];
      
      for (const nombPropiedad in req.body){ // Comparamos cada campo del cuerpo de la solicitud con el usuario anterior para detectar cambios
         if (req.body[nombPropiedad] !== usuarioAnterior[nombPropiedad]){ // Si el valor del campo ha cambiado [nombPropiedad], lo agregamos a la lista de cambios
            cambios.push(`${nombPropiedad} : ${req.body[nombPropiedad]} -> ${usuarioAnterior[nombPropiedad]}`); // Formateamos el cambio como "campo: nuevo valor -> valor anterior"
         }
      }
      
      const filasAfectadas = await UsuariosModel.actualizarPersonal(id, req.body);
      if (filasAfectadas === 0) {
         return res.status(404).json({ mensaje: "Personal no encontrado" });
      }
      const detalles = cambios.length > 0 ? cambios.join(', ') : 'Sin cambios detectados'; // Si hay cambios, los unimos en una cadena, si no hay cambios, indicamos que no se detectaron cambios
      
      await insertarMovimiento(TIPOS_MOVIMIENTO.EDICION, detalles, req.usuario.id);
      res.json({ mensaje: "Personal actualizado exitosamente" });
    } catch (error) {
       console.error("❌ Error al actualizar personal:", error);
       res.status(500).json({ mensaje: "Error al actualizar el personal", error: error.message });
    }
}


export async function eliminarPersonalUsuario(req, res) {
   try {
      const { id } = req.params;
      const usuarioEliminado = await UsuariosModel.obtenerPersonalPorId(id); // Obtenemos el usuario antes de la eliminación para registrar el movimiento 
      if (!usuarioEliminado) {
         return res.status(404).json({ mensaje: "Personal no encontrado" });
      }
      const filasAfectadas = await UsuariosModel.eliminarPersonalUsuario(id);
      if (filasAfectadas === 0) {
         return res.status(404).json({ mensaje: "Personal no encontrado" });
      }
      await insertarMovimiento(TIPOS_MOVIMIENTO.ELIMINACION, 'Usuario eliminado: ' + usuarioEliminado.nombre_usuario, req.usuario.id); // Registramos el movimiento de eliminación de personal
      res.json({ mensaje: "Personal eliminado exitosamente" });
   } catch (error) {
      console.error("❌ Error al eliminar personal:", error);
      res.status(500).json({ mensaje: "Error al eliminar el personal", error: error.message });
   }
}

export async function actualizarEstadoUsuario(req, res) {
    try {
      const { id } = req.params;
      const usuario = await UsuariosModel.obtenerPersonalPorId(id);
      if (!usuario) {
        return res.status(404).json({ mensaje: "Personal no encontrado" });
      }
      const { estado } = req.body;
      await UsuariosModel.actualizarEstadoUsuario(id, estado);
      await insertarMovimiento(TIPOS_MOVIMIENTO.ACTUALIZACION_ESTADO, 'El usuario ' + usuario.nombre_usuario + ' pasó de: ' + usuario.estado_usuario + ' -> ' + estado, req.usuario.id); // Registramos el movimiento de actualización de estado del usuario
      res.json({ mensaje: "Estado del personal actualizado exitosamente" });
    }catch (error) {
      console.error("❌ Error al actualizar estado del personal:", error);
      res.status(500).json({ mensaje: "Error al actualizar el estado del personal", error: error.message });
      }
}