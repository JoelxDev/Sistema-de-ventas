import { Router } from 'express';
import * as MovimientosController from './movimientos.controller.js';

const router = Router();
router.post('/', MovimientosController.registrarMovimiento);

export default router;