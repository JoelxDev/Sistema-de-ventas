import { Router } from 'express';
import * as UsuariosController from './usuarios.controller.js';

const router = Router();
router.get('/', UsuariosController.obtenerTodosLosPersonales);
router.get('/:id', UsuariosController.obtenerPersonalPorId);
router.post('/', UsuariosController.crearPersonal);
router.put('/:id', UsuariosController.actualizarPersonal);
router.delete('/:id', UsuariosController.eliminarPersonalUsuario);
router.patch('/:id/estado', UsuariosController.actualizarEstadoUsuario);

export default router;