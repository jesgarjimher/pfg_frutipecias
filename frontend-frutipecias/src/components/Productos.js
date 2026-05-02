import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge, Button, Card, Col, Container, ListGroup, Modal, Placeholder, Row } from "react-bootstrap";


function Productos() {

    const [productos, setProductos] = useState([]);
    const {categoria} = useParams();
    const pathStorageImg = "http://127.0.0.1:8000/storage/";
    const [pagina, setPagina] = useState(1);
    const [paginacion, setPaginacion] = useState({});
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [productoClicado, setProductoClicado] = useState(null);

    const handleClose = () => setMostrarModal(false);

    const handleMostrarModal = (producto) => {
        setProductoClicado(producto);
        setMostrarModal(true);
    }
    
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
        <Container className="my-5">
            <Row className="justify-content-center mb-5">
                <Col className="text-center">
                    <input type="text" placeholder="buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}></input>
                </Col>
            </Row >
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
                            <Button variant="primary" onClick={() => handleMostrarModal(producto)}>Ver más</Button>
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

            <Modal show={mostrarModal} onHide={handleClose} size="lg" centered>
                {productoClicado && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>{productoClicado.nombre}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col md={5}>
                                    <img src={pathStorageImg + productoClicado.imagen} alt={productoClicado.nombre} className="img-fluid rounded shadow-sm mb-3"/>
                                    <div className="text-center">
                                        <h5>Nutriscore: <Badge bg="success">{productoClicado.nutriscore}</Badge></h5>
                                    </div>
                                </Col>
                                <Col md={7}>
                                    <h5>Descripción</h5>
                                    <p>{productoClicado.descripcion || "Sin descripción"}</p>
                                    <h5>Ingredientes</h5>
                                    <p className="small text-muted">{productoClicado.ingredientes}</p>

                                    {productoClicado.informacion_nutricional && (
                                        <div className="mt-3">
                                            <h5>Información Nutricional (por 100g)</h5>
                                            <TableStats info={productoClicado.informacion_nutricional} />
                                        </div>
                                    )}

                                    {productoClicado.alergenos && productoClicado.alergenos.length > 0 && (
                                        <div className="mt-3">
                                            <h5>Alérgenos</h5>
                                            {productoClicado.alergenos.map(alergeno => (
                                                <Badge key={alergeno.id} bg="danger" className="me-1">{alergeno.nombre}</Badge>
                                            ))}
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </Container>
    )


    
}


function TableStats({ info }) {
        return (
            <ListGroup variant="flush" className="border rounded">
                <ListGroup.Item className="d-flex justify-content-between"><span>Energía:</span> <strong>{info.energia} kcal</strong></ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between"><span>Grasas:</span> <strong>{info.grasas}g</strong></ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between"><span>Carbohidratos:</span> <strong>{info.carbohidratos}g</strong></ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between"><span>Azúcares:</span> <strong>{info.azucares}g</strong></ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between"><span>Proteínas:</span> <strong>{info.proteinas}g</strong></ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between"><span>Sal:</span> <strong>{info.sal}g</strong></ListGroup.Item>
            </ListGroup>
        );
    }
export default Productos;