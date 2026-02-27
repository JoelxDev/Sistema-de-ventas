import { Router } from 'express';
import * as SucursalesController from './sucursales.controller.js';
import { verificarToken } from '../../middlewares/verificarToken.js';
import { verificarPermisos } from '../../middlewares/verificarPermisos.js';


const router = Router();
router.use(verificarToken);
router.post('/', verificarPermisos('sucursales', 'Crear'),SucursalesController.crearSucursal);
router.get('/',  verificarPermisos('sucursales', 'Vista'), SucursalesController.obtenerSucursales);
router.get('/activas', verificarPermisos('sucursales', 'Vista'), SucursalesController.obtenerSucursalesActivas);
router.get('/:id', verificarPermisos('sucursales', 'Vista'), SucursalesController.obtenerSucursalPorId);
router.put('/:id', verificarPermisos('sucursales', 'Editar'), SucursalesController.actualizarSucursal);
router.delete('/:id', verificarPermisos('sucursales', 'Eliminar'), SucursalesController.eliminarSucursal);
router.patch('/:id/estado', verificarPermisos('sucursales', 'Estados'), SucursalesController.actualizarEstadoSucursal);
export default router;