import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { validatePrice, validateStock } from './validation';
import './PanelAdmin.css';

function PanelAdmin() {
    const [products, setProducts] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [form, setForm] = useState({
        name: '',
        price: '',
        description: '',
        image_url: '',
        stock: ''
    })

    // Estado del tema
    const [theme, setTheme] = useState(() => {
        if (localStorage.getItem('theme')) {
            return localStorage.getItem('theme');
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    // Efecto para aplicar el tema
    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    //Cargar productos
    const fetchProducts = async () => {
        const { data } = await supabase
            .from('products')
            .select('*');
        setProducts(data);
    }

    useEffect(() => {
        fetchProducts();
    }, [])

    //Manejar inputs
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    //Manejar selección de imagen
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    }

    //Crear producto en Supabase
    const handleSubmit = async (e) => {
        e.preventDefault()

        const priceError = validatePrice(form.price);
        if (priceError) {
            alert(priceError);
            return;
        }

        const stockError = validateStock(form.stock);
        if (stockError) {
            alert(stockError);
            return;
        }

        let imageUrl = '';

        if (imageFile) {
            const fileName = `${Date.now()}-${imageFile.name}`
            const { data, error: uploadError } = await supabase.storage
                .from('products')
                .upload(fileName, imageFile);

            if (uploadError) {
                console.error(uploadError);
                alert('Error al subir la imagen');
                return;
            }

            const { data: publicUrl } = supabase.storage
                .from('products')
                .getPublicUrl(fileName);

            imageUrl = publicUrl.publicUrl;
        }

        const productData = { ...form, image_url: imageUrl };

        const { error } = await supabase.from('products').insert([productData]);
        if (!error) {
            setForm({
                name: '',
                price: '',
                description: '',
                image_url: '',
                stock: ''
            });
            setImageFile(null);
            e.target.reset(); // Reset file input
            fetchProducts();
        } else {
            alert('Error al crear el producto: ' + error.message);
        }
    }

    //Eliminar producto
    const deleteProducts = async (id) => {
        await supabase.from('products').delete().eq('id', id);
        fetchProducts();
    }

    return (

        <div className={`admin-container ${theme}`}>

            <div className="admin-header">
                <h1>Panel de Administrador</h1>
                <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
            </div>

            <form className="admin-form" onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="name"
                    placeholder="Nombre del producto"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Precio"
                    value={form.price}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="description"
                    placeholder="Descripción"
                    value={form.description}
                    onChange={handleChange}
                ></textarea>

                <input type="file" onChange={handleImageUpload} />

                <button type="submit">Agregar producto</button>
            </form>

            <h2>Productos actuales</h2>
            <div className="products-list">
                {products?.map((p) => (
                    <div className="product-card" key={p.id}>
                        <img src={p.image_url} alt={p.name} />
                        <h3>{p.name}</h3>
                        <p>${p.price}</p>
                        <p>Stock: {p.stock}</p>

                        <button onClick={() => deleteProducts(p.id)}>Eliminar</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PanelAdmin;