import { Router } from 'express';
import * as PermisosController from './permisos.controller.js';
import { verificarToken } from '../../middlewares/verificarToken.js';
import { verificarPermisos } from '../../middlewares/verificarPermisos.js';

const router = Router();
router.use(verificarToken);
router.post('/', verificarPermisos('permisos', 'Crear'), PermisosController.crearPermiso);
router.get('/', verificarPermisos('permisos', 'Vista'), PermisosController.obtenerTodosLosPermisos);
router.get('/:id', verificarPermisos('permisos', 'Vista'), PermisosController.obtenerPermisoPorId);
router.put('/:id', verificarPermisos('permisos', 'Editar'), PermisosController.actualizarPermiso);
router.delete('/:id', verificarPermisos('permisos', 'Eliminar'), PermisosController.eliminarPermiso);
router.patch('/:id/estado', verificarPermisos('permisos', 'Estados'), PermisosController.actualizarEstadoPermiso);

export default router;