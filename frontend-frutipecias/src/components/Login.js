import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';

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
    })

    const handleChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
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
            setError("Email o contrasena incorrectos");
        }
    };

    return (
        <div>
            <div>
                <div >
                    <div>
                        <div >
                            <h2>Login Admin</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label>Email</label>
                                    <input type="email" name="email" className="form-control" onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Contrasena</label>
                                    <input type="password" name="password" className="form-control" onChange={handleChange} required />
                                </div>
                                <button type="submit" className="btn btn-primary">Log in</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Sesión cerrada</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{msgSesion}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setMostrarModal(false)}>Aceptar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Login;