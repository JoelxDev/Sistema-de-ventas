import * as ProductoController from './productos.controller.js'
import { Router } from 'express'
import { verificarToken } from '../../middlewares/verificarToken.js'
import { verificarPermisos } from '../../middlewares/verificarPermisos.js'

const router = Router()

router.post('/', ProductoController.crearProducto)
router.get('/', ProductoController.obtenerProductos)
router.get('/:idProducto', ProductoController.obtenerProductoPorId)
router.put('/:idProducto', ProductoController.actualizarProducto)
router.delete('/:idProducto', ProductoController.eliminarProducto)
router.patch('/:idProducto/estado', ProductoController.actualizarEstadoProducto)

export default router;

