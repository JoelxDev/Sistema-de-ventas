import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { probarConexion } from './src/config/conexion_bd.js';
// ============================================================
// IMPORTACIONES DE LAS RUTAS
import loginRoutes from './src/modules/login/autenticacion.routes.js';
import usuariosRoutes from './src/modules/usuarios/usuarios.routes.js';
import permisosRoutes from './src/modules/permisos/permisos.routes.js';
import modulosRoutes from './src/modules/modulos/modulos.routes.js';
import rolesRoutes from './src/modules/roles/roles.routes.js';
import sucursalesRoutes from './src/modules/sucursales/sucursales.routes.js';
import sesionesRoutes from './src/modules/sesiones/sesiones.routes.js';
import categoriasRoutes from './src/modules/categorias/categorias.routes.js';
import produtosRoutes from './src/modules/productos/productos.routes.js';
import ventasRoutes from './src/modules/ventas/ventas.routes.js';
import dashboardRoutes from './src/modules/dashboard/dashboard.routes.js';
import movimientosRoutes from './src/modules/movimientos/movimientos.routers.js';
// ============================================================
dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// =============================================================
// RUTAS ENDPOINTS
app.use('/api/login', loginRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/permisos', permisosRoutes);
app.use('/api/modulos', modulosRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/sucursales', sucursalesRoutes);
app.use('/api/sesiones', sesionesRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/productos', produtosRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/movimientos', movimientosRoutes);
// =============================================================

app.get('/', (req, res) => {
  res.send('Backend OK');
});

const PORT = process.env.PORT || 3200;

app.listen(PORT, async () => {
  console.log(`Backend corriendo en puerto ${PORT}`);
  await probarConexion();
});
