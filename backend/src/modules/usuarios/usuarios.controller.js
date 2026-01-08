import * as UsuariosModel from "./usuarios.model.js";

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
       res.status(201).json({ id: nuevoId, mensaje: "Personal creado exitosamente" });
    } catch (error) {
       console.error("❌ Error al crear personal:", error);
       res.status(500).json({ mensaje: "Error al crear el personal", error: error.message });
    }
}

export async function actualizarPersonal(req, res) {
    try {
       const { id } = req.params;
       const filasAfectadas = await UsuariosModel.actualizarPersonal(id, req.body);
         if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: "Personal no encontrado" });
         }
         res.json({ mensaje: "Personal actualizado exitosamente" });
    } catch (error) {
       console.error("❌ Error al actualizar personal:", error);
       res.status(500).json({ mensaje: "Error al actualizar el personal", error: error.message });
    }
}


export async function eliminarPersonalUsuario(req, res) {
   try {
      const { id } = req.params;
      const filasAfectadas = await UsuariosModel.eliminarPersonalUsuario(id);
      if (filasAfectadas === 0) {
         return res.status(404).json({ mensaje: "Personal no encontrado" });
      }
      res.json({ mensaje: "Personal eliminado exitosamente" });
   } catch (error) {
      console.error("❌ Error al eliminar personal:", error);
      res.status(500).json({ mensaje: "Error al eliminar el personal", error: error.message });
   }
}

export async function actualizarEstadoUsuario(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      await UsuariosModel.actualizarEstadoUsuario(id, estado);
      res.json({ mensaje: "Estado del personal actualizado exitosamente" });
    }catch (error) {
      console.error("❌ Error al actualizar estado del personal:", error);
      res.status(500).json({ mensaje: "Error al actualizar el estado del personal", error: error.message });
      }
}