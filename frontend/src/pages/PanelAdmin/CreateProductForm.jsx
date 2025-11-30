import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { validatePrice, validateStock } from './validation';
import './PanelAdmin.css';

function CreateProductForm({ categories, onProductCreated, onOpenCategoryModal, preSelectedCategoryId }) {
    const [imageFile, setImageFile] = useState(null);
    const [form, setForm] = useState({
        name: '',
        price: '',
        description: '',
        image_url: '',
        stock: '',
        category_id: ''
    });

    React.useEffect(() => {
        if (preSelectedCategoryId) {
            setForm(prev => ({ ...prev, category_id: preSelectedCategoryId }));
        }
    }, [preSelectedCategoryId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Si el usuario selecciona la opción especial para crear una nueva categoría
        if (name === 'category_id' && value === '__new__') {
            onOpenCategoryModal();
            // mantener el select sin seleccionar hasta que se cree la categoría
            setForm({ ...form, category_id: '' });
            return;
        }

        setForm({ ...form, [name]: value });
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    }

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
            onProductCreated();
        } else {
            alert('Error al crear el producto: ' + error.message);
        }
    }

    return (
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
    );
}

export default CreateProductForm;
