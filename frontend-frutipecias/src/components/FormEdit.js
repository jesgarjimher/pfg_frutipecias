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

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/productos/${id}`);
                setProducto(res.data);
            }catch(error) {
                console.error("Error al cargar producto", error);
            }
        }

        const fetchCategorias = async () => {
            const res = await axios.get(`http://127.0.0.1:8000/api/categorias`);
            setCategorias(res.data);
        }
        fetchProducto();
        fetchCategorias();
    },[id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setProducto({...producto,[parent]: { ...producto[parent], [child]: value }
            });
        } else {
            setProducto({ ...producto, [name]: value });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://127.0.0.1:8000/api/productos/${id}`, producto);
            alert("Producto actualziado");
            navigate("/tabla-admin");
        }catch(error) {
            console.error("Error actuzalando", error);
        }
    }

    return (
        <div>
            <h1>Editar Producto #{id}</h1>
            <form onSubmit={handleSubmit}>
                <h3>Alimento</h3>
                <label>Nombre:</label>
                <input name="nombre" value={producto.nombre}  onChange={handleChange}/><br/>

                <label>Ingredientes:</label>
                <textarea name="ingredientes" value={producto.ingredientes}  onChange={handleChange}/><br/>

                <label>Nutriscore:</label>
                <input name="nutriscore" value={producto.nutriscore}  maxLength="1" onChange={handleChange}/><br/>

                <label>Categoría:</label>
                <select name="categoria_id" value={producto.categoria_id} onChange={handleChange}>
                    {categorias.map(categoria => (
                        <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                    ))}
                </select>

                <hr/>
                <h3>Información Nutricional</h3>
                <label>Energía (kcal):</label>
                <input type="number" name="informacion_nutricional.energia" value={producto.informacion_nutricional?.energia} onChange={handleChange} /><br/>
                
                <label>Grasas:</label>
                <input type="number" name="informacion_nutricional.grasas" value={producto.informacion_nutricional?.grasas}  onChange={handleChange}/><br/>
                
                <label>Proteínas:</label>
                <input type="number" name="informacion_nutricional.proteinas" value={producto.informacion_nutricional?.proteinas}  onChange={handleChange}/><br/>

                <hr/>
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => navigate(-1)}>Cancelar</button>
            </form>
        </div>
    );


}

export default FormEdit;