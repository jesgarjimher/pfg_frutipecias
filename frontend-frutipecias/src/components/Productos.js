import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Productos() {

    const [productos, setProductos] = useState([]);
    const {categoria} = useParams();
    const pathStorageImg = "http://127.0.0.1:8000/storage/";
    const [pagina, setPagina] = useState(1);
    const [paginacion, setPaginacion] = useState({});
    const [busqueda, setBusqueda] = useState("");
    
    const getProductos = async (pagina = 1) => {
        try {
            let url = `http://127.0.0.1:8000/api/productos?page=${pagina}`;

            if(categoria) {
                url += `&categoria=${categoria}`;
            }

            if(busqueda) {
                url += `&search=${busqueda}`;
            }
            const res = await axios.get(url, {
            headers: {
                'Accept': 'application/json'
            }
        });
            setProductos(res.data.data);
            setPaginacion(res.data);
            setPagina(res.data.current_page);
        }catch (error){
            console.error("Error detallado:", error);
            const msg = error.response?.data?.message || "Error de conexión o CORS";
            alert(msg);
        }
    }

    useEffect(() => {
        getProductos(1); //setear la pag 1 cada cambio de categoria
    }, [categoria, busqueda]);

    const botonesPaginacion = [];

    for(let pag = 1; pag <= paginacion.last_page; pag++) {
        botonesPaginacion.push(
            <button key={pag} onClick={() => getProductos(pag)}>{pag}</button>
        )
    }

    return (
        <div>
            <div>
                <input type="text" placeholder="buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}></input>
            </div>
            <h1>{categoria}</h1>
            {productos.map((producto, index) => (
                <div key={producto.id}>
                    <p>{index+1}-{producto.nombre}</p>
                    <p>{producto.categoria.nombre}</p>
                    <p>{producto.nutriscore}</p>
                    <img src={pathStorageImg + producto.imagen} alt={producto.name}></img>
                </div>
                

            ))}
            <div>
                {botonesPaginacion}
            </div>
        </div>
    )
}

export default Productos;