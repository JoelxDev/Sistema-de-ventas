import * as VentasController from './ventas.controller.js';
import { Router } from 'express';
import { verificarToken } from '../../middlewares/verificarToken.js';
import { verificarPermisos } from '../../middlewares/verificarPermisos.js';

const router = Router();
router.post('/', VentasController.crearVenta);
router.get('/', VentasController.obtenerVentas);
router.get('/:idSucursal', VentasController.obtenerVentasPorSucursal);

export default router;