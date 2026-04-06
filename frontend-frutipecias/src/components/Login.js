import React, { useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

function Login({setUser}) {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login", credentials);
            const userData = response.data.user;
            const token = response.data.access_token;
            //guardar usuario en LocalStorage
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("token", token)

            setUser(userData);
            
            alert("Usuario logueado " + response.data.user.name);
            navigate("/tabla-admin");
        } catch(errror) {
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
        </div>
    );
}

export default Login;