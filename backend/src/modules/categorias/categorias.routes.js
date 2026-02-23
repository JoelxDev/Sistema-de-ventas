import * as CategotiasController from './categorias.controller.js';
import express from 'express';

const router = express.Router();

router.post('/', CategotiasController.crearCategoria);
router.get('/', CategotiasController.obtenerTodasLasCategorias);
router.get('/:idCategoria', CategotiasController.obtenerCategoriaPorId);
router.put('/:idCategoria', CategotiasController.actualizarCategoria);
router.delete('/:idCategoria', CategotiasController.eliminarCategoria);

export default router;