import axios from "axios";
import React, {useEffect, useState} from "react";
import { Alert, Button, Card, Col, Container, Row, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

function AltaProducto() {
    const navigate = useNavigate();
    const [imagen, setImagen] = useState(null);
    const [errors, setErrors] = useState({});
    const [producto, setProducto] = useState({
        nombre: "",
        ingredientes: "",
        nutriscore: "",
        descripcion: "",
        categoria_id: "",
        informacion_nutricional: {
            energia: 0, grasas: 0, grasas_saturadas: 0,
            carbohidratos: 0, azucares: 0, proteinas: 0, sal: 0
        },
        alergenos: [] 
    })

    const [categorias, setCategorias] = useState([]);
    const [alergenos, setAlegernos] = useState([]);

    useEffect(() => {
        const fetchCategoriasYAlergenos = async () => {
            try {
                const resCategorias = await axios.get(`${API_URL}/api/categorias`);
                const resAlergenos = await axios.get(`${API_URL}/api/alergenos`);

                setCategorias(resCategorias.data);
                setAlegernos(resAlergenos.data);
            }catch(error) {
                console.error("Error al cargar categorias y alergenos", error);
            }
        }
        fetchCategoriasYAlergenos();
    },[])

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

    const handleAlergenosChange = (id) => {
        const nuevos = producto.alergenos.includes(id)
            ? producto.alergenos.filter(aId => aId !== id)
            : [...producto.alergenos, id];
        setProducto({ ...producto, alergenos: nuevos });
    };

    const handleFileChange = (e) => {
        setImagen(e.target.files[0]);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        setErrors({});
        const formData = new FormData();

        formData.append("nombre", producto.nombre);
        formData.append("descripcion", producto.descripcion || "");
        formData.append("ingredientes", producto.ingredientes || "");
        formData.append("nutriscore", producto.nutriscore);
        formData.append("categoria_id", producto.categoria_id);

        if(imagen) {
            formData.append("imagen", imagen);
        }

        formData.append("informacion_nutricional", JSON.stringify(producto.informacion_nutricional));
        formData.append("alergenos", JSON.stringify(producto.alergenos));

        try {
            await axios.post(`${API_URL}/api/productos`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            alert("producto creado");
            navigate("/tabla-admin");
        }catch(error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            }else if (error.response?.status === 401) {
                navigate("/login");
            }
        }
    }


    return (
        <Container className="my-5">
            <Card className="border-0 shadow-sm">
                <Card.Header className="border-0 py-3">
                    <h1 className="mb-0 title">Alta de Nuevo Producto</h1>
                </Card.Header>
                <Card.Body className="px-4">
                    <Form onSubmit={handleSubmit}>
                        {Object.keys(errors).length > 0 && (
                            <Alert variant="danger" onClose={() => setErrors({})} dismissible>
                                <Alert.Heading>Error al crear el producto:</Alert.Heading>
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
                                    <Form.Label>Nombre del Producto:</Form.Label>
                                    <Form.Control name="nombre" type="text" maxLength="100" placeholder="Ej: nueces" onChange={handleChange} />
                                </Form.Group>
                            </Col>
                            <Col md={8}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción:</Form.Label>
                                    <Form.Control name="descripcion" as="textarea" maxLength="1000" placeholder="Descripción..." onChange={handleChange} />
                                </Form.Group>
                            </Col>
                            <Col md={8}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ingredientes:</Form.Label>
                                    <Form.Control as="textarea" name="ingredientes" maxLength="1000" placeholder="Agua, conservantes..." onChange={handleChange} required />
                                </Form.Group>
                            </Col>

                                <Form.Group className="mb-3 my-nutri">
                                    <Form.Label>Nutriscore</Form.Label>
                                    <Form.Control name="nutriscore" maxLength="1" pattern="[A-Ea-e]{1}" onChange={handleChange} placeholder="A-E" className="text-center" required />
                                </Form.Group>

                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Categoría:</Form.Label>
                                    <Form.Select name="categoria_id" onChange={handleChange} required>
                                        <option value="">Selecciona Categoria</option>
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
                                        <div className="border rounded d-flex align-items-center justify-content-center bg-light img-preview-container">
                                            {imagen ? (
                                                <img src={URL.createObjectURL(imagen)} alt="Vista previa" className="img-preview" />
                                            ) : (
                                                <span className="text-muted small text-center px-1">Sin imagen</span>
                                            )}
                                        </div>
                                        <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>

                        <hr />

                        <h3 className="mb-3 mt-4">Información Nutricional por cada 100g</h3>
                        <Row className="g-3">
                            <Col xs={6} md={3}>
                                <Form.Label className="small">Energía (kcal)</Form.Label>
                                <Form.Control type="number" name="informacion_nutricional.energia" placeholder="0" onChange={handleChange} required />
                            </Col>
                            <Col xs={6} md={3}>
                                <Form.Label className="small">Grasas (g)</Form.Label>
                                <Form.Control type="number" step="0.1" name="informacion_nutricional.grasas" placeholder="0.0" onChange={handleChange} required />
                            </Col>
                            <Col xs={6} md={3}>
                                <Form.Label className="small">Grasas Sat. (g)</Form.Label>
                                <Form.Control type="number" step="0.1" name="informacion_nutricional.grasas_saturadas" placeholder="0.0" onChange={handleChange} required />
                            </Col>
                            <Col xs={6} md={3}>
                                <Form.Label className="small">Carbohidratos (g)</Form.Label>
                                <Form.Control type="number" step="0.1" name="informacion_nutricional.carbohidratos" placeholder="0.0" onChange={handleChange} required />
                            </Col>
                            <Col xs={6} md={3}>
                                <Form.Label className="small">Azúcares (g)</Form.Label>
                                <Form.Control type="number" step="0.1" name="informacion_nutricional.azucares" placeholder="0.0" onChange={handleChange} required />
                            </Col>
                            <Col xs={6} md={3}>
                                <Form.Label className="small">Proteínas (g)</Form.Label>
                                <Form.Control type="number" step="0.1" name="informacion_nutricional.proteinas" placeholder="0.0" onChange={handleChange} required />
                            </Col>
                            <Col xs={6} md={3}>
                                <Form.Label className="small">Sal (g)</Form.Label>
                                <Form.Control type="number" step="0.01" name="informacion_nutricional.sal" placeholder="0.00" onChange={handleChange} required />
                            </Col>
                        </Row>

                        <hr className="my-4" />

                        <h5 className="text-muted mb-3">Alérgenos</h5>
                        <div className="d-flex flex-wrap gap-2 mb-4">
                            {alergenos.map(a => (
                                <div key={a.id} className="border rounded p-2 bg-light">
                                    <Form.Check 
                                        type="checkbox"
                                        id={`alergeno-${a.id}`}
                                        label={a.nombre}
                                        checked={producto.alergenos.includes(a.id)}
                                        onChange={() => handleAlergenosChange(a.id)}
                                    />
                                </div>
                            ))}
                        </div>

                        <hr className="my-4" />

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="light" type="button" onClick={() => navigate(-1)}>
                                Cancelar
                            </Button>
                            <Button type="submit" className="my-btn px-4" style={{ backgroundColor: '#007bff', color: 'white', border: 'none' }}>
                                Crear Producto
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}


export default AltaProducto;