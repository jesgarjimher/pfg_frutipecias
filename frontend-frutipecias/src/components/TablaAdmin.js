import axios from "axios";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";


function TablaAdmin() {
    const [productos, setProductos] = useState([]);

    const getProductos = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/productos", {
                headers: {
                    "Accept": "application/json"
                }
            });
            setProductos(res.data);
        }catch(error) {
            console.error("Error detallado:", error);
            const msg = error.response?.data?.message || "Error de conexión o CORS";
            alert(msg);
        }

        

       
    } 
    const deleteProducto = async (id) => {
        const token = localStorage.getItem("token");
            if(window.confirm(`Eliminar producto con ${id}???`)) {
                try {
                    await axios.delete(`http://127.0.0.1:8000/api/productos/${id}`,
                        {headers: {
                            "Authorization": `Bearer ${token}`,
                            "Accept": "application/json"
                        }

                    });

                    setProductos(productos.filter(productosLista => productosLista.id !== id));
                }catch(error) {
                    alert("error al eliminar producto");
                    console.error("Error detallado:", error);
                }
            }
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
                            <button onClick={() => deleteProducto(producto.id)}>Eliminar</button>
                            <Link to={`/form-edit/${producto.id}`}>Editar</Link>
                        </td>
                    </tr>
                            
                    )}
                </tbody>
            </table>
            
        </div>
    )
}

export default TablaAdmin;