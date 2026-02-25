import { useState, useEffect } from "react"
import { obtenerProductoPorId, actualizarProducto, crearProducto } from "../../api/ApiProductos/ApiProductos"
import { obtenerCategorias } from "../../api/ApiCategorias/ApiCategorias"

export function FormularioProductos({id, onGuardar, onCancelar}) {

    const [datosFormularioProductos, setDatosFormularioProductos] = useState({
        nombre_prod: "",
        descripcion_prod: "",
        precio_unitario_prod: "",
        idCategoria: "",
    });

    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarCategorias();
        if (id) {
            cargarProducto();
        }
    }, []);

    const cargarCategorias = async () => {
        setCargando(true);
        try {
            const categorias = await obtenerCategorias();
            setCategorias(categorias);
        } catch (error) {
            setError(error);
        } finally {
            setCargando(false);
        }
    };

    const cargarProducto = async () => {
        setCargando(true);
        try {
            const producto = await obtenerProductoPorId(id);
            setDatosFormularioProductos({
                nombre_prod: producto.nombre_prod,
                descripcion_prod: producto.descripcion_prod,
                precio_unitario_prod: producto.precio_unitario_prod,
                idCategoria: producto.categorias_id_categoria,
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    };

    const manejarCambio = (e) => {
        setDatosFormularioProductos({
            ...datosFormularioProductos,
            [e.target.name]: e.target.value,
        });
    }

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (id) {
                await actualizarProducto(id, datosFormularioProductos);
            } else {
                await crearProducto(datosFormularioProductos);
            }
            onGuardar();
        } catch (error) {
            setError(error);
        }
    };

    if (cargando) return <p>Cargando...</p>

    return (
        <form onSubmit={manejarEnvio}>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div style={{ marginBottom: "15px" }}>
                <label>Nombre Producto</label><br />
                <input
                    type="text"
                    name="nombre_prod"
                    value={datosFormularioProductos.nombre_prod}
                    onChange={manejarCambio}
                    required
                />
            </div>
            <div style={{ marginBottom: "15px" }}>
                <label>Descripcion</label><br />
                <input
                    type="text"
                    name="descripcion_prod"
                    value={datosFormularioProductos.descripcion_prod}
                    onChange={manejarCambio}
                />
            </div>
            <div style={{ marginBottom: "15px" }}>
                <label>Precio Unitario</label><br />
                <input
                    type="text"
                    name="precio_unitario_prod"
                    value={datosFormularioProductos.precio_unitario_prod}
                    onChange={manejarCambio}
                    required
                />
            </div>
            <div style={{ marginBottom: "15px" }}>
                <label>Asociar Categoria</label><br />
                <select
                    name="idCategoria"
                    value={datosFormularioProductos.idCategoria}
                    onChange={manejarCambio}
                    required
                >
                    <option value="">---Seleccionar categoria---</option>
                    {categorias.map((categoria) => (
                        <option key={categoria.id_categoria} value={categoria.id_categoria}>
                            {categoria.nombre_categoria}
                        </option>
                    ))}
                </select>
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" onClick={onCancelar}>
                    Cancelar
                </button>
                <button type="submit">
                    {id ? "Guardar cambios" : "Crear producto"}
                </button>
            </div>
        </form>
    )
}