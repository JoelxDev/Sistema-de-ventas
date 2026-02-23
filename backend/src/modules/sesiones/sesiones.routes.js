import * as SesionController from './sesiones.controller.js';
import { Router } from 'express';
import { verificarToken } from '../../middlewares/verificarToken.js';
import { verificarPermisos } from '../../middlewares/verificarPermisos.js';

const router = Router();
router.use(verificarToken);
router.get('/', verificarPermisos('sesiones', 'Vista'), SesionController.obtenerDatosSesiones);

export default router;