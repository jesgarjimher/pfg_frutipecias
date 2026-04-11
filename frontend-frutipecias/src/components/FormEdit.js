import axios from "axios";
import React, {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";

function FormEdit() {
    const {id} = useParams();
    const navigate = useNavigate();

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
            const res = await axios.get(`http://127.0.0.1:8000/api/productos/${id}`, {
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
            const resCategorias = await axios.get(`http://127.0.0.1:8000/api/categorias`);
            setCategorias(resCategorias.data);

            //alergenos
            const resAlergenos = await axios.get(`http://127.0.0.1:8000/api/alergenos`);
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


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            await axios.put(`http://127.0.0.1:8000/api/productos/${id}`, producto, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            alert("Producto actualziado");
            navigate("/tabla-admin");
        }catch(error) {
            console.error("Error al actualizar", error);
            if(error.response?.status === 401) {
                alert("Tu sesion ha caducado");
                navigate("/login");
            }
        }
    }

    return (
        <div>
            <h1>Editar Producto #{id}</h1>
            <form onSubmit={handleSubmit}>
                <h3>Datos Generales</h3>
                <label>Nombre:</label>
                <input name="nombre" value={producto.nombre || ""} onChange={handleChange} /><br />

                <label>Descripción:</label>
                <textarea name="descripcion" value={producto.descripcion || ""} onChange={handleChange} /><br />

                <label>Ingredientes:</label>
                <textarea name="ingredientes" value={producto.ingredientes || ""} onChange={handleChange} /><br />

                <label>Nutriscore:</label>
                <input name="nutriscore" value={producto.nutriscore || ""} maxLength="1" onChange={handleChange} style={{width: '30px'}} /><br />

                <label>Categoría:</label>
                <select name="categoria_id" value={producto.categoria_id || ""} onChange={handleChange}>
                    <option value="">Seleccione...</option>
                    {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                </select>

                <hr />
                <h3>Información Nutricional (por 100g)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <label>Energía: <input type="number" step="0.01" name="informacion_nutricional.energia" value={producto.informacion_nutricional?.energia || 0} onChange={handleChange} /></label>
                    <label>Grasas: <input type="number" step="0.01" name="informacion_nutricional.grasas" value={producto.informacion_nutricional?.grasas || 0} onChange={handleChange} /></label>
                    <label>Grasas Sat: <input type="number" step="0.01" name="informacion_nutricional.grasas_saturadas" value={producto.informacion_nutricional?.grasas_saturadas || 0} onChange={handleChange} /></label>
                    <label>Carbohidratos: <input type="number" step="0.01" name="informacion_nutricional.carbohidratos" value={producto.informacion_nutricional?.carbohidratos || 0} onChange={handleChange} /></label>
                    <label>Azúcares: <input type="number" step="0.01" name="informacion_nutricional.azucares" value={producto.informacion_nutricional?.azucares || 0} onChange={handleChange} /></label>
                    <label>Proteínas: <input type="number" step="0.01" name="informacion_nutricional.proteinas" value={producto.informacion_nutricional?.proteinas || 0} onChange={handleChange} /></label>
                    <label>Sal: <input type="number" step="0.01" name="informacion_nutricional.sal" value={producto.informacion_nutricional?.sal || 0} onChange={handleChange} /></label>
                </div>

                <hr />
                <h3>Alérgenos</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    {alergenos.map(alergeno => (
                        <label key={alergeno.id}>
                            <input 
                                type="checkbox" 
                                checked={producto.alergenos.includes(alergeno.id)} 
                                onChange={() => handleAlergenosChange(alergeno.id)}
                            />
                            {alergeno.nombre}
                        </label>
                    ))}
                </div>

                <hr />
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white' }}>Guardar Cambios</button>
                <button type="button" onClick={() => navigate(-1)} style={{ marginLeft: '10px' }}>Cancelar</button>
            </form>
        </div>);


}

export default FormEdit;