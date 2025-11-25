import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { validatePrice, validateStock } from './validation';
import './PanelAdmin.css';

function PanelAdmin() {
    const [products, setProducts] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [form, setForm] = useState({
        name: '',
        price: '',
        description: '',
        image_url: '',
        stock: '',
        category_id: ''
    })
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Navega a la página anterior
    };

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

    //Cargar categorias
    const fetchCategories = async () => {
        const { data } = await supabase
            .from('categories')
            .select('*');
        setCategories(data || []);
    }

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [])

    //Manejar inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Si el usuario selecciona la opción especial para crear una nueva categoría
        if (name === 'category_id' && value === '__new__') {
            setShowCategoryForm(true);
            // mantener el select sin seleccionar hasta que se cree la categoría
            setForm({ ...form, category_id: '' });
            return;
        }

        setForm({ ...form, [name]: value });
    }

    //Manejar selección de imagen
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    }

    //Manejar inputs del formulario de nueva categoría
    const handleNewCategoryChange = (e) => {
        setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
    }

    //Crear nueva categoría en Supabase
    const createCategory = async (e) => {
        e.preventDefault();
        const name = (newCategory.name || '').trim();
        if (!name) {
            alert('El nombre de la categoría es requerido');
            return;
        }

        const { data, error } = await supabase
            .from('categories')
            .insert([{ name, description: newCategory.description || '' }])
            .select()
            .single();

        if (error) {
            console.error(error);
            alert('Error al crear la categoría: ' + error.message);
            return;
        }

        // Agregar a la lista local y seleccionar la nueva categoría
        setCategories((prev) => [...(prev || []), data]);
        setForm((prev) => ({ ...prev, category_id: data.id }));
        setNewCategory({ name: '', description: '' });
        setShowCategoryForm(false);
    }

    const cancelCreateCategory = () => {
        setNewCategory({ name: '', description: '' });
        setShowCategoryForm(false);
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

        const productData = { ...form, image_url: imageUrl, category_id: form.category_id ? Number(form.category_id) : null };

        const { error } = await supabase.from('products').insert([productData]);
        if (!error) {
            setForm({
                name: '',
                price: '',
                description: '',
                image_url: '',
                stock: '',
                category_id: ''
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
                <div className='admin-actions'>

                    <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                    <button onClick={handleGoBack} className="btn-back">
                        ← Volver
                    </button>
                </div>
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

                <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Selecciona categoría</option>
                    <option value="__new__">+ Crear nueva categoría</option>
                    {categories?.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <textarea
                    name="description"
                    placeholder="Descripción"
                    value={form.description}
                    onChange={handleChange}
                ></textarea>

                <input type="file" onChange={handleImageUpload} />

                <button type="submit">Agregar producto</button>
            </form>

            {showCategoryForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Crear nueva categoría</h3>
                        <form onSubmit={createCategory} className="new-cat-form">
                            <input
                                type="text"
                                name="name"
                                placeholder="Nombre de la categoría"
                                value={newCategory.name}
                                onChange={handleNewCategoryChange}
                                required
                            />
                            <textarea
                                name="description"
                                placeholder="Descripción (opcional)"
                                value={newCategory.description}
                                onChange={handleNewCategoryChange}
                            ></textarea>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={cancelCreateCategory}>Cancelar</button>
                                <button type="submit" className="btn-submit">Crear</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <h2>Productos actuales</h2>
            <div className="products-list">
                {products?.map((p) => (
                    <div className="product-card" key={p.id}>
                        <img src={p.image_url} alt={p.name} />
                        <h3>{p.name}</h3>
                        <p>${p.price}</p>
                        <p>Stock: {p.stock}</p>

                        <button onClick={() => deleteProducts(p.id)}>Eliminar</button>
                        <button onClick={() => navigate(`/admin/edit/${p.id}`)}>Editar</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PanelAdmin;