import axios from "axios";
import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

function AltaProducto() {
    const navigate = useNavigate();
    const [imagen, setImagen] = useState(null);

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
                const resCategorias = await axios.get(`http://127.0.0.1:8000/api/categorias`);
                const resAlergenos = await axios.get(`http://127.0.0.1:8000/api/alergenos`);

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

        const formData = new formData();

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
            await axios.post("http://127.0.0.1:8000/api/productos", formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            alert("producto creado");
            navigate("/tabla-admin");
        }catch(error) {
            console.error("Error creando el producto",error);
            alert("error al crear el producto");
            if(error.response?.status === 401) {
                alert("sesion caducada");
                navigate("/login")
            }
        }
    }


    return(
        <div>
            <h1>Alta de Nuevo Producto</h1>
            <form onSubmit={handleSubmit}>
                <h3>Alimento</h3>
                <div>
        <label>Nombre del Producto:</label><br/>
        <input 
            type="text"
            name="nombre" 
            placeholder="Ej: nueces" 
            onChange={handleChange} 
            required 
        />
    </div>

    <div>
        <label>Descripcion</label><br/>
        <textarea 
            name="descripcion" 
            placeholder="Descripcion..." 
            onChange={handleChange} 
        />
    </div>

    <div>
        <label>Ingredientes:</label><br/>
        <textarea 
            name="ingredientes" 
            placeholder="Agua,conservantes..." 
            onChange={handleChange} 
        />
    </div>

        <div>
            <label>Nutriscore</label><br/>
            {/* usar select */}
            <input 
                type="text"
                name="nutriscore" 
                placeholder="A" 
                maxLength="1" 
                onChange={handleChange} 
            />
        </div><br/>
        <div>
            <label>Imagen</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
                
                <select name="categoria_id" onChange={handleChange} required>
                    <option value="">Selecciona Categoria</option>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>

                <h3>Información Nutricional por cada 100g</h3>
<div>
    
    <div>
        <label>Energía (kcal):</label><br/>
        <input type="number" name="informacion_nutricional.energia" placeholder="0" onChange={handleChange} />
    </div>

    <div>
        <label>Grasas totales (g):</label><br/>
        <input type="number" step="0.1" name="informacion_nutricional.grasas" placeholder="0.0" onChange={handleChange} />
    </div>

    <div>
        <label>Grasas Saturadas (g):</label><br/>
        <input type="number" step="0.1" name="informacion_nutricional.grasas_saturadas" placeholder="0.0" onChange={handleChange} />
    </div>

    <div>
        <label>Carbohidratos (g):</label><br/>
        <input type="number" step="0.1" name="informacion_nutricional.carbohidratos" placeholder="0.0" onChange={handleChange} />
    </div>

    <div>
        <label>Azúcares (g):</label><br/>
        <input type="number" step="0.1" name="informacion_nutricional.azucares" placeholder="0.0" onChange={handleChange} />
    </div>

    <div>
        <label>Proteínas (g):</label><br/>
        <input type="number" step="0.1" name="informacion_nutricional.proteinas" placeholder="0.0" onChange={handleChange} />
    </div>

    <div>
        <label>Sal (g):</label><br/>
        <input type="number" step="0.01" name="informacion_nutricional.sal" placeholder="0.00" onChange={handleChange} />
    </div>

</div>
                

                <h3>Alérgenos</h3>
                {alergenos.map(a => (
                    <label key={a.id}>
                        <input type="checkbox" onChange={() => handleAlergenosChange(a.id)} />
                        {a.nombre}
                    </label>
                ))}
                <br/><br/>
                <button type="submit" style={{backgroundColor: 'blue', color: 'white'}}>Crear Producto</button>
            </form>
        </div>
    )
}


export default AltaProducto;