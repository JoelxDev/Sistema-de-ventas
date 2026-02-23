import { useState, useEffect } from "react";
import { obtenerCategorias, eliminarCategoria, obtenerCategoriaPorId } from "../../api/ApiCategorias/ApiCategorias";
import { FormularioCategoria } from "./FormularioCategoria";
import { Modal } from "../../components/Modal";
import { useAutenticacion } from "../../context/AutenticacionContext";
// import "../../css/PaginaCategorias.css"

export function PaginaCategorias() {

    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const [modalAbierto, setModalAbierto] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    const { tienePermiso } = useAutenticacion();

    useEffect(() => {
        cargarCategorias();
    }, []);

    async function cargarCategorias() {
        try {
            setCargando(true);
            const data = await obtenerCategorias();
            setCategorias(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }

    function abrirModalCrear() {
        setIdEditar(null);
        setModalAbierto(true);
    }
    function abrirModalEditar(id) {
        setIdEditar(id);
        setModalAbierto(true)
    }
    function cerrarModal() {
        setModalAbierto(false);
        setIdEditar(null);
    }
    function manejarGuardado() {
        cerrarModal();
        cargarCategorias();
    }

    async function manejarEliminacion(id) {
        if (confirm('¿Estas seguro de eliminar esta categoria?')) {
            try {
                await eliminarCategoria(id);
                cargarCategorias();
            } catch (err) {
                setError(err.message);
            }
        }
    }

    if (cargando) return <p>Cargando categorias...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div>
            <button onClick={abrirModalCrear}>Aniadir Modulo/Submodulo</button>

            <h1>Categorias</h1>
            <table border="1" cellPadding="8" cellSpacing="0" style={{ marginTop: "15px", width: "100%" }}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripcion</th>
                        <th>Fecha creacion</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {categorias.map((cat) => (
                        <tr key={cat.id_categoria} >
                            <td>{cat.nombre_categoria}</td>
                            <td>{cat.descripcion_categoria}</td>
                            <td>{new Date(cat.fecha_crea_categoria).toLocaleString('es-ES')}</td>
                            <td>
                                <button onClick={() => abrirModalEditar(cat.id_categoria)}>Editar</button>
                                <button onClick={() => manejarEliminacion(cat.id_categoria)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal
                isOpen={modalAbierto}
                onCancelar={cerrarModal}
                titulo={idEditar ? "Editar Categoria" : "Aniadir Categoria"}
            >
                <FormularioCategoria
                    idCategoria={idEditar}
                    onGuardar={manejarGuardado}
                    onCancelar={cerrarModal}
                />
            </Modal>
        </div>
    )

}

