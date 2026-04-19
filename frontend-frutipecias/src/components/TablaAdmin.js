import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";


function TablaAdmin() {
    const [productos, setProductos] = useState([]);
    const [paginacion, setPaginacion] = useState({});
    const [pagina, setPagina] = useState(1);
    const botonesPaginacion = [];
    const [borrarId, setBorrarId] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarErrorModal, setMostrarErrorModal] = useState(false);
    const [msgError, setMsgError] = useState("");

    for(let pag = 1; pag <= paginacion.last_page; pag++) {
        botonesPaginacion.push(
            <button key={pag} onClick={() => getProductos(pag)}>{pag}</button>
        )
    }

    const getProductos = async (pagina = 1) => {
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/productos?page=${pagina}`, {
                headers: {
                    "Accept": "application/json"
                }
            });
            setProductos(res.data.data);
            setPaginacion(res.data);
            setPagina(res.data.current_page);
        }catch(error) {
            console.error("Error detallado:", error);
            const msg = error.response?.data?.message || "Error de conexión o CORS";
            alert(msg);
        }

        

    } 



    const deleteProducto = async (id) => {
        const token = localStorage.getItem("token");
                try {
                    await axios.delete(`http://127.0.0.1:8000/api/productos/${id}`,
                        {headers: {
                            "Authorization": `Bearer ${token}`,
                            "Accept": "application/json"
                        }

                    });

                    setProductos(productos.filter(productosLista => productosLista.id !== id));
                }catch(error) {
                    setMsgError(error.response?.data?.message || "error al eliminar producto");
                    setMostrarErrorModal(true);
                    console.error("Error detallado:", error);
                }
            
        }

        const handleCerrar = () => {
            setMostrarModal(false);
        }

        const handleMostrar = (id) => {
            setBorrarId(id);
            setMostrarModal(true);
        }

        const confirmDelete = () => {
            deleteProducto(borrarId)
            handleCerrar();
        }

    useEffect(() => {
        getProductos();
    }, []);

    return (
        <div>
            <h1>Administrar productos</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                
                <tbody>
                    {productos.map(producto => 
                    <tr key={producto.id}>
                        <td>{producto.id}</td>
                        <td>{producto.nombre}</td>
                        <td>{producto.categoria.nombre}</td>
                        <td>
                            <button onClick={() => handleMostrar(producto.id)}>Eliminar</button>
                            <Link to={`/form-edit/${producto.id}`}>Editar</Link>
                        </td>
                    </tr>
                            
                    )}
                </tbody>
            </table>
            <Modal show={mostrarModal} onHide={handleCerrar} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                ¿Seguro que deseas borrar el producto con ID: {borrarId}? 
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleCerrar}>
                    Cancelar
                </Button>
                <Button onClick={confirmDelete}>
                    Eliminar Producto
                </Button>
            </Modal.Footer>
        </Modal>

        
        <Modal show={mostrarErrorModal} onHide={() => setMostrarErrorModal(false)}>
            <Modal.Header closeButton className="bg-danger text-white">
                <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{msgError}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => setMostrarErrorModal(false)}>Aceptar</Button>
            </Modal.Footer>
        </Modal>
            <div>
                {botonesPaginacion}
                

            </div>
        </div>
    )
}

export default TablaAdmin;