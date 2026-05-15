import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { Button, Container, Modal, Form } from 'react-bootstrap';

function Login({setUser}) {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);
    const [msgSesion, setMsgSession] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const msg = localStorage.getItem("msgLogout");
        if(msg) {
            setMsgSession(msg);
            setMostrarModal(true);
            localStorage.removeItem("msgLogout");
        }
    },[])

    const handleChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login", credentials);
            const userData = {...response.data.user, loggedIn: true, role: "admin"};
            const token = response.data.access_token;
            //guardar usuario en LocalStorage
            // localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", token)
            localStorage.setItem("MsgBienvenida", "Bienvenido admin")
            setUser(userData);
            
            console.log("Usuario logueado " + response.data.user.name);
            navigate("/tabla-admin");

        } catch(error) {
            console.error("Error en login:", error.response?.data || error.message);
            console.log("Capturando error en el componente...");
            setError("Email o contrasena incorrectos");
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center vh-100">
            <div>
                <div >
                    <div>
                        <div >
                            <h2 className="title mb-4">Login Admin</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" name="email" onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Contrasena</Form.Label>
                                    <Form.Control type="password" name="password" onChange={handleChange} required />
                                </Form.Group>
                                <Button type="submit" className="btn-primary mt-3 w-100 my-btn">Log in</Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="title">Sesión cerrada</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{msgSesion}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary my-btn" onClick={() => setMostrarModal(false)}>Aceptar</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Login;