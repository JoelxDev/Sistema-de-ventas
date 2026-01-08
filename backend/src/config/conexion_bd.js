import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function probarConexion() {
    try {
        const conexion = await pool.getConnection();
        console.log("Conexión a la base de datos exitosa");
        conexion.release();
        return true;
    } catch (error) {
        console.error("Error de conexión a la base de datos:", error);
        return false;
    }
}

export default pool;