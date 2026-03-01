import * as VentasController from './ventas.controller.js';
import { Router } from 'express';
import { verificarToken } from '../../middlewares/verificarToken.js';
import { verificarPermisos } from '../../middlewares/verificarPermisos.js';

const router = Router();
router.use(verificarToken)
router.post('/',verificarPermisos('ventas', 'Crear'), VentasController.crearVenta);
router.get('/', verificarPermisos('ventas', 'Vista'), VentasController.obtenerVentas);
router.get('/filtrar', verificarPermisos('ventas', 'Vista'), VentasController.obtenerVentasFiltradas);
router.get('/:idSucursal', verificarPermisos('ventas', 'Vista'), VentasController.obtenerVentasPorSucursal);

export default router;