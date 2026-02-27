import { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';
import { obtenerResumenDashboard, obtenerGraficoVentas, obtenerGraficoVentasPorSucursal } from '../../api/ApiDashboard/ApiDashboard.jsx';
import '../../css/Dashboard.css';

const COLORES_SUCURSALES = ['#2563eb', '#e11d48', '#16a34a', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

const ETIQUETAS_PERIODO = {
    semana: 'Semanal',
    mes: 'Mensual',
    anio: 'Anual'
};

function formatearMoneda(valor) {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(valor);
}

function formatearPeriodo(periodo, tipoPeriodo) {
    if (tipoPeriodo === 'semana') {
        return `Sem ${periodo}`;
    }
    if (tipoPeriodo === 'mes') {
        const [anio, mes] = periodo.split('-');
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return `${meses[parseInt(mes) - 1]} ${anio}`;
    }
    return periodo;
}

export function Dashboard() {
    const [resumen, setResumen] = useState(null);
    const [datosGrafico, setDatosGrafico] = useState([]);
    const [datosGraficoSucursal, setDatosGraficoSucursal] = useState([]);
    const [periodoVentas, setPeriodoVentas] = useState('mes');
    const [periodoSucursal, setPeriodoSucursal] = useState('mes');
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Cargar resumen general
    useEffect(() => {
        async function cargarResumen() {
            try {
                setCargando(true);
                const data = await obtenerResumenDashboard();
                setResumen(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        }
        cargarResumen();
    }, []);

    // Cargar gráfico de ventas cuando cambia el periodo
    useEffect(() => {
        async function cargarGrafico() {
            try {
                const data = await obtenerGraficoVentas(periodoVentas);
                const datosFormateados = data.map(item => ({
                    ...item,
                    periodo_label: formatearPeriodo(item.periodo_inicio, periodoVentas),
                    total_ventas: parseFloat(item.total_ventas)
                }));
                setDatosGrafico(datosFormateados);
            } catch (err) {
                console.error('Error al cargar gráfico:', err);
            }
        }
        cargarGrafico();
    }, [periodoVentas]);

    // Cargar gráfico de ventas por sucursal cuando cambia el periodo
    useEffect(() => {
        async function cargarGraficoSucursal() {
            try {
                const data = await obtenerGraficoVentasPorSucursal(periodoSucursal);
                // Transformar datos: agrupar por periodo con una línea por sucursal
                const periodos = {};
                const sucursales = new Set();

                data.forEach(item => {
                    const key = item.periodo_inicio;
                    if (!periodos[key]) {
                        periodos[key] = { periodo_label: formatearPeriodo(key, periodoSucursal) };
                    }
                    periodos[key][item.nombre_suc] = parseFloat(item.total_ventas);
                    sucursales.add(item.nombre_suc);
                });

                setDatosGraficoSucursal({
                    datos: Object.values(periodos),
                    sucursales: Array.from(sucursales)
                });
            } catch (err) {
                console.error('Error al cargar gráfico por sucursal:', err);
            }
        }
        cargarGraficoSucursal();
    }, [periodoSucursal]);

    if (cargando) return <div className="dashboard-cargando">Cargando dashboard...</div>;
    if (error) return <div className="dashboard-error">Error: {error}</div>;

    return (
        <div className="dashboard-pagina">
            <h1 className="dashboard-titulo">Dashboard</h1>

            {/* Tarjetas de resumen */}
            <div className="dashboard-tarjetas">
                <div className="tarjeta-resumen tarjeta-dia">
                    <div className="tarjeta-icono">📅</div>
                    <div className="tarjeta-contenido">
                        <span className="tarjeta-etiqueta">Ventas del Día</span>
                        <span className="tarjeta-valor">{formatearMoneda(resumen?.ventasDia?.total_ventas || 0)}</span>
                        <span className="tarjeta-detalle">{resumen?.ventasDia?.cantidad_ventas || 0} ventas</span>
                    </div>
                </div>

                <div className="tarjeta-resumen tarjeta-mes">
                    <div className="tarjeta-icono">📆</div>
                    <div className="tarjeta-contenido">
                        <span className="tarjeta-etiqueta">Ventas del Mes</span>
                        <span className="tarjeta-valor">{formatearMoneda(resumen?.ventasMes?.total_ventas || 0)}</span>
                        <span className="tarjeta-detalle">{resumen?.ventasMes?.cantidad_ventas || 0} ventas</span>
                    </div>
                </div>

                <div className="tarjeta-resumen tarjeta-producto">
                    <div className="tarjeta-icono">🏆</div>
                    <div className="tarjeta-contenido">
                        <span className="tarjeta-etiqueta">Producto Más Vendido</span>
                        <span className="tarjeta-valor">{resumen?.productosMasVendidos?.[0]?.nombre_prod || 'Sin datos'}</span>
                        <span className="tarjeta-detalle">
                            {resumen?.productosMasVendidos?.[0]?.total_vendido || 0} unidades vendidas
                        </span>
                    </div>
                </div>

                <div className="tarjeta-resumen tarjeta-sucursal-top">
                    <div className="tarjeta-icono">🏪</div>
                    <div className="tarjeta-contenido">
                        <span className="tarjeta-etiqueta">Sucursal Líder</span>
                        <span className="tarjeta-valor">{resumen?.ventasPorSucursal?.[0]?.nombre_suc || 'Sin datos'}</span>
                        <span className="tarjeta-detalle">
                            {formatearMoneda(resumen?.ventasPorSucursal?.[0]?.total_ventas || 0)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Top 5 productos más vendidos */}
            <div className="dashboard-seccion">
                <h2 className="seccion-titulo">Productos Más Vendidos</h2>
                <div className="grafico-contenedor">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={resumen?.productosMasVendidos || []} layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="nombre_prod" width={150} tick={{ fontSize: 12 }} />
                            <Tooltip
                                formatter={(value, name) => {
                                    if (name === 'total_vendido') return [value, 'Unidades vendidas'];
                                    if (name === 'total_ingresos') return [formatearMoneda(value), 'Ingresos'];
                                    return [value, name];
                                }}
                            />
                            <Legend formatter={(value) => value === 'total_vendido' ? 'Unidades vendidas' : 'Ingresos'} />
                            <Bar dataKey="total_vendido" fill="#2563eb" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Ventas por sucursal (barras) */}
            <div className="dashboard-seccion">
                <h2 className="seccion-titulo">Ventas por Sucursal</h2>
                <div className="grafico-contenedor">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={resumen?.ventasPorSucursal || []}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="nombre_suc" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip
                                formatter={(value, name) => {
                                    if (name === 'total_ventas') return [formatearMoneda(value), 'Total ventas'];
                                    if (name === 'cantidad_ventas') return [value, 'Cantidad'];
                                    return [value, name];
                                }}
                            />
                            <Legend formatter={(value) => value === 'total_ventas' ? 'Total ventas' : 'Cantidad'} />
                            <Bar dataKey="total_ventas" fill="#16a34a" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="cantidad_ventas" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Gráfico de líneas - Ventas por periodo */}
            <div className="dashboard-seccion">
                <div className="seccion-header">
                    <h2 className="seccion-titulo">Evolución de Ventas</h2>
                    <div className="periodo-selector">
                        {['semana', 'mes', 'anio'].map(p => (
                            <button
                                key={p}
                                className={`btn-periodo ${periodoVentas === p ? 'activo' : ''}`}
                                onClick={() => setPeriodoVentas(p)}
                            >
                                {ETIQUETAS_PERIODO[p]}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grafico-contenedor">
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={datosGrafico} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="periodo_label" tick={{ fontSize: 11 }} />
                            <YAxis />
                            <Tooltip
                                formatter={(value, name) => {
                                    if (name === 'total_ventas') return [formatearMoneda(value), 'Total ventas'];
                                    if (name === 'cantidad_ventas') return [value, 'Cantidad'];
                                    return [value, name];
                                }}
                            />
                            <Legend formatter={(value) => value === 'total_ventas' ? 'Total ventas' : 'Cantidad'} />
                            <Line type="monotone" dataKey="total_ventas" stroke="#2563eb" strokeWidth={2}
                                dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="cantidad_ventas" stroke="#e11d48" strokeWidth={2}
                                dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Gráfico de líneas - Ventas por sucursal y periodo */}
            <div className="dashboard-seccion">
                <div className="seccion-header">
                    <h2 className="seccion-titulo">Ventas por Sucursal (Tendencia)</h2>
                    <div className="periodo-selector">
                        {['semana', 'mes', 'anio'].map(p => (
                            <button
                                key={p}
                                className={`btn-periodo ${periodoSucursal === p ? 'activo' : ''}`}
                                onClick={() => setPeriodoSucursal(p)}
                            >
                                {ETIQUETAS_PERIODO[p]}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grafico-contenedor">
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={datosGraficoSucursal.datos || []}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="periodo_label" tick={{ fontSize: 11 }} />
                            <YAxis />
                            <Tooltip formatter={(value) => formatearMoneda(value)} />
                            <Legend />
                            {(datosGraficoSucursal.sucursales || []).map((suc, idx) => (
                                <Line
                                    key={suc}
                                    type="monotone"
                                    dataKey={suc}
                                    stroke={COLORES_SUCURSALES[idx % COLORES_SUCURSALES.length]}
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}