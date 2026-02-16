import { Router } from 'express';
import * as UsuariosController from './usuarios.controller.js';
import { verificarToken } from '../../middlewares/verificarToken.js'; 
import { verificarPermisos } from '../../middlewares/verificarPermisos.js';

const router = Router();
router.use(verificarToken);
router.get('/', verificarPermisos('usuarios', 'Vista') , UsuariosController.obtenerTodosLosPersonales);
router.get('/:id', verificarPermisos('usuarios', 'Vista'), UsuariosController.obtenerPersonalPorId);
router.post('/', verificarPermisos('usuarios', 'Crear'),  UsuariosController.crearPersonal);
router.put('/:id', verificarPermisos('usuarios', 'Editar'), UsuariosController.actualizarPersonal);
router.delete('/:id', verificarPermisos('usuarios', 'Eliminar'), UsuariosController.eliminarPersonalUsuario);
router.patch('/:id/estado', verificarPermisos('usuarios', 'Estados'), UsuariosController.actualizarEstadoUsuario);

export default router;
