import * as DashboardController from './dashboard.controller.js';
import { Router } from 'express';
import { verificarToken } from '../../middlewares/verificarToken.js';
import { verificarPermisos } from '../../middlewares/verificarPermisos.js';

const router = Router();
router.use(verificarToken);

router.get('/resumen', verificarPermisos('dashboard', 'Vista'), DashboardController.obtenerResumen);
router.get('/grafico-ventas', verificarPermisos('dashboard', 'Vista'), DashboardController.obtenerGraficoVentas);
router.get('/grafico-ventas-sucursal', verificarPermisos('dashboard', 'Vista'), DashboardController.obtenerGraficoVentasPorSucursal);

export default router;
