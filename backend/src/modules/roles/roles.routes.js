import { Router } from 'express'
import * as RolesController from './roles.controller.js';
import { verificarToken } from '../../middlewares/verificarToken.js';
import { verificarPermisos } from '../../middlewares/verificarPermisos.js';

const router = Router();
router.use(verificarToken);
router.post('/', verificarPermisos('roles', 'Crear'), RolesController.crearRol);
router.get('/', verificarPermisos('roles', 'Vista'), RolesController.obtenerTodosLosRoles);
router.get('/:id', verificarPermisos('roles', 'Vista'),RolesController.obtenerRolPorId);
router.put('/:id', verificarPermisos('roles', 'Editar'),RolesController.actualizarRol);
router.delete('/:id', verificarPermisos('roles', 'Eliminar'),RolesController.eliminarRol);
router.patch('/:id/estado', verificarPermisos('roles', 'Estados'),RolesController.actualizarEstadoRol);

export default router;

