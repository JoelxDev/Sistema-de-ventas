import * as SesionController from './sesiones.controller.js';
import { Router } from 'express';
import { verificarToken } from '../../middlewares/verificarToken.js';


const router = Router();

router.get('/', SesionController.obtenerDatosSesiones);

export default router;