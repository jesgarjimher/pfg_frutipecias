import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Productos() {

    const [productos, setProductos] = useState([]);
    const {categoria} = useParams();
    const pathStorageImg = "http://127.0.0.1:8000/storage/";

    const getProductos = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/productos", {
            headers: {
                'Accept': 'application/json'
            }
        });
            setProductos(res.data);
        }catch (error){
            console.error("Error detallado:", error);
            const msg = error.response?.data?.message || "Error de conexión o CORS";
            alert(msg);
        }
    }

    useEffect(() => {
        getProductos();
    }, []);

    return (
        <div>
            <h1>{categoria}</h1>
            {productos.map(producto => (
                <div key={producto.id}>
                    <p>{producto.nombre}</p>
                    <p>{producto.categoria.nombre}</p>
                    <p>{producto.nutriscore}</p>
                    <img src={pathStorageImg + producto.imagen} alt={producto.name}></img>
                </div>
                

            ))}
        </div>
    )
}

export default Productos;