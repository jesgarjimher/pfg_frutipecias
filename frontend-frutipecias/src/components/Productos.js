import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Placeholder } from "react-bootstrap";


function Productos() {

    const [productos, setProductos] = useState([]);
    const {categoria} = useParams();
    const pathStorageImg = "http://127.0.0.1:8000/storage/";
    const [pagina, setPagina] = useState(1);
    const [paginacion, setPaginacion] = useState({});
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);
    
    const getProductos = async (pagina = 1) => {
        setCargando(true);
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
        }finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        const delayCall = setTimeout(() => {
            getProductos(1); //setear la pag 1 cada cambio de categoria

        },500)
        return () => clearTimeout(delayCall); //limpa el timeout si se sigue escribiendo
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
            <div className="row">
                {cargando ? (
                    [1,2,3,4,5,6,7,8].map((n) => (
                        <div className="col-12 col-md-6 col-xl-3 mb-4" key={n}>
                            <Card style={{ width: '18rem' }}>
                                {/* Un div gris que simula la imagen */}
                                <div className="placeholder-glow">
                                    <div className="placeholder col-12" style={{ height: '180px' }}></div>
                                </div>
                                <Card.Body>
                                    <Placeholder as={Card.Title} animation="glow">
                                        <Placeholder xs={6} />
                                    </Placeholder>
                                    <Placeholder as={Card.Text} animation="glow">
                                        <Placeholder xs={7} /> <Placeholder xs={4} />
                                        <Placeholder xs={4} />
                                    </Placeholder>
                                    <Placeholder.Button variant="primary" xs={6} />
                                </Card.Body>
                            </Card>
                        </div>
                    ))
                ) : (
                    productos.map((producto, index) => (
                <div className="col-12 col-md-6 col-xl-3" key={producto.id}>
                    <Card style={{ width: '18rem' }} key={producto.id}>
                        <Card.Img variant="top" src={pathStorageImg + producto.imagen} />
                        <Card.Body>
                            <Card.Title>{producto.nombre}</Card.Title>
                            <Card.Text>
                                {producto.categoria.nombre}
                            </Card.Text>
                            <Button variant="primary">Ver más</Button>
                        </Card.Body>
                    </Card> 
                </div>
                // <div key={producto.id}>
                //     <p>{index+1}-{producto.nombre}</p>
                //     <p>{producto.categoria.nombre}</p>
                //     <p>{producto.nutriscore}</p>
                //     <img src={pathStorageImg + producto.imagen} alt={producto.name}></img>
                // </div>
                

            ))
                )};
            
            </div>

            <div>
                {botonesPaginacion}
            </div>
        </div>
    )
}

export default Productos;