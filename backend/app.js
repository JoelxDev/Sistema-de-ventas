import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { probarConexion } from './src/config/conexion_bd.js';
import usuariosRoutes from './src/modules/usuarios/usuarios.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// =============================================================
// RUTAS ENDPOINTS
// =============================================================
app.use('/api/usuarios', usuariosRoutes);
// =============================================================
// FIN RUTAS ENDPOINTS  
// =============================================================

app.get('/', (req, res) => {
  res.send('Backend OK');
});

const PORT = process.env.PORT || 3200;

app.listen(PORT, async () => {
  console.log(`Backend corriendo en puerto ${PORT}`);
  await probarConexion();
});
