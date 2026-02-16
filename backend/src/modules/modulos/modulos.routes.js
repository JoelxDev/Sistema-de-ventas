import { Router } from 'express';
import * as ModulosController from "./modulos.controller.js";
import { verificarToken } from '../../middlewares/verificarToken.js';
import { verificarPermisos } from '../../middlewares/verificarPermisos.js';

const router = Router();
router.use(verificarToken);
router.post('/', verificarPermisos('modulos', 'Crear'), ModulosController.crearModulo);
router.get('/', verificarPermisos('modulos', 'Vista'), ModulosController.obtenerTodosLosModulos)
router.get('/:id', verificarPermisos('modulos', 'Vista'), ModulosController.obtenerModuloPorId)
router.put('/:id', verificarPermisos('modulos', 'Editar'), ModulosController.actualizarModulo)
router.delete('/:id', verificarPermisos('modulos', 'Eliminar'), ModulosController.eliminarModulo)
router.patch('/:id/estado', verificarPermisos('modulos', 'Estados'), ModulosController.actualizarEstadoModulo)


export default router;