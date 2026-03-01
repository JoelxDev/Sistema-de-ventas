import * as VentasModel from './ventas.model.js';

export async function crearVenta(req, res) {
    try {
        const { idUsuarioSucursal } = req.usuario;
        // if ()
        const idVenta = await VentasModel.crearVenta(req.body, idUsuarioSucursal);
        res.status(201).json({ id: idVenta, mensaje: "Venta creada exitosamente" });
    } catch (error) {
        console.error("❌ Error al crear venta:", error);
        res.status(500).json({ error: 'Error al crear la venta', mensaje: error.message });
    }
}

export async function obtenerVentas(req, res) {
    try{
        const ventas = await VentasModel.obtenerVentas();
        res.status(200).json(ventas);
    }catch(error){
        console.error("❌ Error al obtener ventas:", error);
        res.status(500).json({error: 'Error al obtener las ventas', mensaje: error.message});
    }
}

export async function obtenerVentasPorSucursal(req, res) {
    try {
        const { idSucursal } = req.params;

        const ventas = await VentasModel.obtenerVentasPorSucursal(idSucursal);

        if (ventas.length === 0) {
            return res.status(404).json({ mensaje: "No se encontraron ventas para esta sucursal" });
        }

        res.status(200).json(ventas);
    } catch (error) {
        console.error("❌ Error al obtener ventas por sucursal:", error);
        res.status(500).json({ error: 'Error al obtener las ventas', mensaje: error.message });
    }
}

export async function obtenerVentasFiltradas(req, res) {
    try {
        const filtros = {
            tipo_venta: req.query.tipo_venta || null,
            metodo_pago: req.query.metodo_pago || null,
            fecha_desde: req.query.fecha_desde || null,
            fecha_hasta: req.query.fecha_hasta || null,
            producto: req.query.producto || null,
            id_sucursal: req.query.id_sucursal || null,
        };

        const ventas = await VentasModel.obtenerVentasFiltradas(filtros);
        res.status(200).json(ventas);
    } catch (error) {
        console.error("❌ Error al filtrar ventas:", error);
        res.status(500).json({ error: 'Error al filtrar las ventas', mensaje: error.message });
    }
}