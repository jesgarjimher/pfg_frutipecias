import axios from "axios";
import React, {useEffect, useState} from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";


function FormEdit() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const [nuevaImagen, setNuevaImagen] = useState(null);

    const [producto, setProducto] = useState({
        nombre: "",
        ingredientes: "",
        nutriscore: "",
        descripcion: "",
        categoria_id: "",
        informacion_nutricional: {
            energia: 0,
            grasas: 0,
            grasas_saturadas: 0,
            carbohidratos: 0,
            azucares: 0,
            proteinas: 0,
            sal: 0
        },
        alergenos: []
    })

    const [categorias, setCategorias] = useState([]);
    const [alergenos, setAlergenos] = useState([]);

    useEffect(() => {
    const fetchData = async () => {
        try {
            //producto
            const res = await axios.get(`${API_URL}/api/productos/${id}`, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });
            const datosProducto = res.data;

            //alergenos array de ids
            if (datosProducto.alergenos && Array.isArray(datosProducto.alergenos)) {
                datosProducto.alergenos = datosProducto.alergenos.map(a => a.id);
            } else {
                datosProducto.alergenos = []; 
            }

            setProducto(datosProducto);

            //categorias
            const resCategorias = await axios.get(`${API_URL}/api/categorias`);
            setCategorias(resCategorias.data);

            //alergenos
            const resAlergenos = await axios.get(`${API_URL}/api/alergenos`);
            setAlergenos(resAlergenos.data);

        } catch(error) {
            console.error("Error al cargar los datos", error);
        }
    };
    
    fetchData();
}, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setProducto({
                ...producto,
                [parent]: { ...producto[parent], [child]: value }
            });
        } else {
            setProducto({ ...producto, [name]: value });
        }
    };

    const handleAlergenosChange = (alergenoId) => {
        let nuevosAlergenos = [...producto.alergenos];
        if (nuevosAlergenos.includes(alergenoId)) {
            //borrar del estado los unchecked
            nuevosAlergenos = nuevosAlergenos.filter(id => id !== alergenoId);
        } else {
            //anadir los checked
            nuevosAlergenos.push(alergenoId);
        }
        setProducto({ ...producto, alergenos: nuevosAlergenos });
    };

    const handleFileChange = (e) => {
        setNuevaImagen(e.target.files[0]);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const token = localStorage.getItem("token");

        const formData = new FormData();
        //fuerza a laravel a entender que es un UPDATE aunque sea tipo POST
        formData.append("_method", "PUT"); 

        // Añadimos los campos básicos
        formData.append("nombre", producto.nombre);
        formData.append("descripcion", producto.descripcion);
        formData.append("ingredientes", producto.ingredientes);
        formData.append("nutriscore", producto.nutriscore);
        formData.append("categoria_id", producto.categoria_id)

        if(nuevaImagen) {
            formData.append("imagen", nuevaImagen)
        }

        formData.append("informacion_nutricional", JSON.stringify(producto.informacion_nutricional));
        formData.append("alergenos", JSON.stringify(producto.alergenos));

        try {
            await axios.post(`${API_URL}/api/productos/${id}`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            alert("Producto actualziado");
            navigate("/tabla-admin");
        }catch(error) {
            console.error("Error al actualizar", error);
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            }else if (error.response?.status === 401) {
                navigate("/login");
            }
        }
    }

    return (
        <Container className="my-5">
            <Card className="border-0">
                <Card.Header className="border-0 py-3">
                    <h1 className="mb-0 title">Editar Producto ID:{id}</h1>
                </Card.Header>
                <Card.Body className="px-4">
                    <Form onSubmit={handleSubmit}>
                        {Object.keys(errors).length > 0 && (
                            <Alert variant="danger" onClose={() => setErrors({})} dismissible>
                                <Alert.Heading>Error al guardar los cambios:</Alert.Heading>
                                <ul className="mb-0">
                                    {Object.entries(errors).map(([field, messages]) => (
                                        <li key={field}>
                                            <strong>{field.replace('_', ' ')}:</strong> {messages.join(", ")}
                                        </li>
                                    ))}
                                </ul>
                            </Alert>
                        )}
                        <h3 className="mb-3 mt-2">Datos Generales</h3>
                        <Row>
                            <Col md={8}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre:</Form.Label>
                                    <Form.Control name="nombre" type="text" maxLength="100" value={producto.nombre} onChange={handleChange} required/>
                                </Form.Group>
                            </Col>
                            <Col md={8}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción:</Form.Label>
                                    <Form.Control name="descripcion" as="textarea" maxLength="1000" value={producto.descripcion || ""} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                            <Col md={8}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ingredientes:</Form.Label>
                                    <Form.Control as="textarea" name="ingredientes" maxLength="1000" value={producto.ingredientes || ""} onChange={handleChange} required/>
                                </Form.Group>
                            </Col>
                          
                                <Form.Group className="mb-3 my-nutri">
                                    <Form.Label>Nutriscore</Form.Label>
                                    <Form.Control name="nutriscore" value={producto.nutriscore} maxLength="1" pattern="[A-Ea-e]{1}" onChange={handleChange} placeholder="A-E" className="text-center" required/>
                                </Form.Group>

                            <Col md={3}>
                                <Form.Group className="mb-3 text-end">
                                    <Form.Label>Categoría:</Form.Label>
                                        <Form.Select name="categoria_id" value={producto.categoria_id} onChange={handleChange} required>
                                            {categorias.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                            ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>



                            <Col md={12} className="mt-2">
                            <Form.Group className="mb-3">
                                <Form.Label>Imagen:</Form.Label>
                                <div className="d-flex align-items-center gap-3 mb-2">
                                    <div className="border rounded d-flex align-items-center justify-content-center bg-light img-preview-container" >
                                        {nuevaImagen ? (
                                            <img src={URL.createObjectURL(nuevaImagen)} alt="Vista previa" className="img-preview" />
                                        ) : producto.imagen ? (
                                            <img src={`${API_URL}/storage/${producto.imagen}`} alt="Imagen actual" className="img-preview" />
                                        ) : (
                                            <span className="text-muted small text-center px-1">Sin imagen</span>
                                        )}
                                    </div>
                                    <Form.Control type="file" accept="image/*" onChange={handleFileChange} />   
                                </div>
                            </Form.Group>
                        </Col>
                        </Row>
                        
                        <hr/>
                        
                        <Row className="g-3">
                            <Col xs={6} md={3}>
                                <Form.Label className="small">Energía</Form.Label>
                                <Form.Control type="number" step="0.01" min="0" max="10000" name="informacion_nutricional.energia" value={producto.informacion_nutricional?.energia || 0} onChange={handleChange} required/>
                            </Col>
                            <Col xs={6} md={3}>
                                <Form.Label className="small">Grasas</Form.Label>
                                <Form.Control type="number" step="0.01" min="0" max="10000" name="informacion_nutricional.grasas" value={producto.informacion_nutricional?.grasas || 0} onChange={handleChange} required/>
                            </Col>
                            <Col xs={6} md={3}>
                                <Form.Label className="small">Grasas Sat.</Form.Label>
                                <Form.Control type="number" step="0.01" min="0" max="10000" name="informacion_nutricional.grasas_saturadas" value={producto.informacion_nutricional?.grasas_saturadas || 0} onChange={handleChange} required/>
                            </Col>
                            <Col xs={6} md={3}>
                                <Form.Label className="small">Carbohidratos</Form.Label>
                                <Form.Control type="number" step="0.01" min="0" max="10000" name="informacion_nutricional.carbohidratos" value={producto.informacion_nutricional?.carbohidratos || 0} onChange={handleChange} required/>
                            </Col>
                            <Col xs={6} md={3}>
                                <Form.Label className="small">Azúcares</Form.Label>
                                <Form.Control type="number" step="0.01" min="0" max="10000" name="informacion_nutricional.azucares" value={producto.informacion_nutricional?.azucares || 0} onChange={handleChange} required/>
                            </Col>
                            <Col xs={6} md={3}>
                                <Form.Label className="small">Proteínas</Form.Label>
                                <Form.Control type="number" step="0.01" min="0" max="10000" name="informacion_nutricional.proteinas" value={producto.informacion_nutricional?.proteinas || 0} onChange={handleChange} required/>
                            </Col>
                            <Col xs={6} md={3}>
                                <Form.Label className="small">Sal</Form.Label>
                                <Form.Control type="number" step="0.01" min="0" max="10000" name="informacion_nutricional.sal" value={producto.informacion_nutricional?.sal || 0} onChange={handleChange} required/>
                            </Col>
                        </Row>

                        <hr className="my-4" />

                        <h5 className="text-muted mb-3">Alérgenos</h5>
                        <div className="d-flex flex-wrap gap-2 mb-4">
                            {alergenos.map(alergeno => (
                                <div key={alergeno.id} className="border rounded p-2 bg-light">
                                    <Form.Check 
                                        type="checkbox"
                                        id={`alergeno-${alergeno.id}`}
                                        label={alergeno.nombre}
                                        checked={producto.alergenos.includes(alergeno.id)}
                                        onChange={() => handleAlergenosChange(alergeno.id)}
                                    />
                                </div>
                            ))}
                        </div>

                        <hr className="my-4" />

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="light" type="button" onClick={() => navigate(-1)}>
                                Cancelar
                            </Button>
                            <Button type="submit" className="my-btn px-4">
                                Guardar Cambios
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>);


}

export default FormEdit;