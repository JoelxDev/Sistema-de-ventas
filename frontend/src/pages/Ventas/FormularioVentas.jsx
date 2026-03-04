import { useState, useEffect } from "react";
import { crearVenta } from "../../api/ApiVentas/ApiVentas";
import { obtenerProductosActivos } from "../../api/ApiProductos/ApiProductos";
import { useToast } from "../../context/ToastContext";

const TIPOS_VENTA = ["Unica", "Multiple"];
const METODOS_PAGO = ["Efectivo", "Tarjeta", "Transferencia", "Yape", "Plin"];

export function FormularioVentas({ idVenta, onGuardar, onCancelar }) {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const toast = useToast();

    const [tipoVenta, setTipoVenta] = useState("Unica");
    const [metodoPago, setMetodoPago] = useState("Efectivo");
    const [montoRecibido, setMontoRecibido] = useState("");

    // Líneas del detalle: { productos_id_producto, nombre_prod, precio_unitario_prod, cantidad_prod }
    const [lineas, setLineas] = useState([
        { productos_id_producto: "", nombre_prod: "", precio_unitario_prod: 0, cantidad_prod: 1 }
    ]);

    useEffect(() => {
        cargarProductos();
    }, []);

    async function cargarProductos() {
        try {
            setCargando(true);
            const data = await obtenerProductosActivos();
            setProductos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }

    // --- Manejo de líneas ---
    function cambiarProductoLinea(index, idProducto) {
        const producto = productos.find(p => String(p.id_producto) === String(idProducto));
        const nuevasLineas = [...lineas];
        nuevasLineas[index] = {
            ...nuevasLineas[index],
            productos_id_producto: idProducto,
            nombre_prod: producto?.nombre_prod ?? "",
            precio_unitario_prod: producto?.precio_unitario_prod ?? 0,
        };
        setLineas(nuevasLineas);
    }

    function cambiarCantidadLinea(index, cantidad) {
        const nuevasLineas = [...lineas];
        nuevasLineas[index] = {
            ...nuevasLineas[index],
            cantidad_prod: Math.max(1, Number(cantidad)),
        };
        setLineas(nuevasLineas);
    }

    function agregarLinea() {
        setLineas([...lineas, { productos_id_producto: "", nombre_prod: "", precio_unitario_prod: 0, cantidad_prod: 1 }]);
    }

    function eliminarLinea(index) {
        if (lineas.length === 1) return;
        setLineas(lineas.filter((_, i) => i !== index));
    }

    // --- Cálculos ---
    const totalPagar = lineas.reduce(
        (acc, l) => acc + (Number(l.precio_unitario_prod) * Number(l.cantidad_prod)),
        0
    );
    const vuelto = Number(montoRecibido) - totalPagar;

    // --- Envío ---
    async function manejarEnvio(e) {
        e.preventDefault();
        setError(null);

        const lineasInvalidas = lineas.some(l => !l.productos_id_producto);
        if (lineasInvalidas) {
            setError("Selecciona un producto en cada línea del detalle.");
            return;
        }

        if (Number(montoRecibido) < totalPagar) {
            setError("El monto recibido no puede ser menor al total a pagar.");
            return;
        }

        const detalles_ventas = lineas.map(l => ({
            productos_id_producto: Number(l.productos_id_producto),
            cantidad_prod: Number(l.cantidad_prod),
            sub_total: Number(l.precio_unitario_prod) * Number(l.cantidad_prod),
        }));

        const datos = {
            tipo_venta: tipoVenta,
            metodo_pago_venta: metodoPago,
            total_pagar: totalPagar,
            monto_recivido: Number(montoRecibido),
            detalles_ventas,
        };

        try {
            setCargando(true);
            await crearVenta(datos);
            onGuardar();
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setCargando(false);
        }
    }

    if (cargando && productos.length === 0) return <p>Cargando productos...</p>;

    return (
        <form onSubmit={manejarEnvio}>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Tipo de venta y método de pago */}
            <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
                <div style={{ flex: 1 }}>
                    <label>Tipo de Venta</label><br />
                    <select value={tipoVenta} onChange={e => setTipoVenta(e.target.value)} required>
                        {TIPOS_VENTA.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label>Método de Pago</label><br />
                    <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)} required>
                        {METODOS_PAGO.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
            </div>

            {/* Detalle de productos */}
            <fieldset style={{ marginBottom: "15px" }}>
                <legend>Productos</legend>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "left", padding: "4px 8px" }}>Producto</th>
                            <th style={{ textAlign: "right", padding: "4px 8px" }}>P. Unitario</th>
                            <th style={{ textAlign: "center", padding: "4px 8px" }}>Cantidad</th>
                            <th style={{ textAlign: "right", padding: "4px 8px" }}>Subtotal</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {lineas.map((linea, i) => (
                            <tr key={i}>
                                <td style={{ padding: "4px 8px" }}>
                                    <select
                                        value={linea.productos_id_producto}
                                        onChange={e => cambiarProductoLinea(i, e.target.value)}
                                        required
                                        style={{ width: "100%" }}
                                    >
                                        <option value="">-- Seleccionar --</option>
                                        {productos.map(p => (
                                            <option key={p.id_producto} value={p.id_producto}>
                                                {p.nombre_prod}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td style={{ textAlign: "right", padding: "4px 8px" }}>
                                    {linea.precio_unitario_prod > 0
                                        ? `S/ ${Number(linea.precio_unitario_prod).toFixed(2)}`
                                        : "-"}
                                </td>
                                <td style={{ textAlign: "center", padding: "4px 8px" }}>
                                    <input
                                        type="number"
                                        min="1"
                                        value={linea.cantidad_prod}
                                        onChange={e => cambiarCantidadLinea(i, e.target.value)}
                                        style={{ width: "70px", textAlign: "center" }}
                                        required
                                    />
                                </td>
                                <td style={{ textAlign: "right", padding: "4px 8px" }}>
                                    S/ {(Number(linea.precio_unitario_prod) * Number(linea.cantidad_prod)).toFixed(2)}
                                </td>
                                <td style={{ padding: "4px 8px" }}>
                                    <button
                                        type="button"
                                        onClick={() => eliminarLinea(i)}
                                        disabled={lineas.length === 1}
                                        title="Eliminar línea"
                                    >✕</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button type="button" onClick={agregarLinea} style={{ marginTop: "8px" }}>
                    + Agregar producto
                </button>
            </fieldset>

            {/* Totales */}
            <div style={{ marginBottom: "15px", textAlign: "right" }}>
                <strong>Total a Pagar: S/ {totalPagar.toFixed(2)}</strong>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label>Monto Recibido (S/)</label><br />
                <input
                    type="number"
                    min={totalPagar}
                    step="0.01"
                    value={montoRecibido}
                    onChange={e => setMontoRecibido(e.target.value)}
                    required
                    style={{ width: "150px" }}
                />
                {montoRecibido !== "" && (
                    <span style={{ marginLeft: "15px", color: vuelto >= 0 ? "green" : "red" }}>
                        Vuelto: S/ {vuelto.toFixed(2)}
                    </span>
                )}
            </div>

            {/* Acciones */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" onClick={onCancelar}>Cancelar</button>
                <button type="submit" disabled={cargando}>
                    {cargando ? "Guardando..." : "Registrar Venta"}
                </button>
            </div>
        </form>
    );
}