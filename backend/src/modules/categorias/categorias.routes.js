import * as CategotiasController from './categorias.controller.js';
import express from 'express';
import { verificarToken } from '../../middlewares/verificarToken.js';
import { verificarPermisos } from '../../middlewares/verificarPermisos.js';

const router = express.Router();
router.use(verificarToken);
router.post('/', verificarPermisos('categorias', 'Crear'), CategotiasController.crearCategoria);
router.get('/', verificarPermisos('categorias', 'Vista'), CategotiasController.obtenerTodasLasCategorias);
router.get('/:idCategoria', verificarPermisos('categorias', 'Vista'), CategotiasController.obtenerCategoriaPorId);
router.put('/:idCategoria', verificarPermisos('categorias', 'Editar'), CategotiasController.actualizarCategoria);
router.delete('/:idCategoria', verificarPermisos('categorias', 'Eliminar'), CategotiasController.eliminarCategoria);

export default router;