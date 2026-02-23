import { Router } from 'express';
import * as LoginController from './autenticacion.controller.js';
import { verificarToken } from '../../middlewares/verificarToken.js';

const router = Router();
router.post('/', LoginController.login);
router.post('/logout', verificarToken, LoginController.logout);
router.get('/verificar', verificarToken, LoginController.verificarSesion);

export default router;