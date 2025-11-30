import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { validatePrice, validateStock } from './validation';
import './PanelAdmin.css';

function EditProductModal({ isOpen, onClose, product, onProductUpdated, categories }) {
    const [imageFile, setImageFile] = useState(null);
    const [form, setForm] = useState({
        name: '',
        price: '',
        description: '',
        image_url: '',
        stock: '',
        category_id: ''
    });

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name,
                price: product.price,
                description: product.description || '',
                image_url: product.image_url,
                stock: product.stock,
                category_id: product.category_id
            });
            setImageFile(null);
        }
    }, [product]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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

        let imageUrl = form.image_url;

        if (imageFile) {
            const fileName = `${Date.now()}-${imageFile.name}`;
            const { error: uploadError } = await supabase.storage
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

        const productData = {
            ...form,
            image_url: imageUrl,
            category_id: form.category_id ? Number(form.category_id) : null
        };

        const { error } = await supabase
            .from('products')
            .update(productData)
            .eq('id', product.id);

        if (!error) {
            alert('Producto actualizado correctamente');
            onProductUpdated();
            onClose();
        } else {
            console.error(error);
            alert('Error al actualizar el producto: ' + error.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Editar Producto</h3>
                <form onSubmit={handleSubmit} className="admin-edit-form">
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

                    <div className="current-image">
                        <p>Imagen actual:</p>
                        <img src={form.image_url} alt="Current" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain' }} />
                    </div>

                    <input type="file" onChange={handleImageUpload} />

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-submit">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProductModal;
