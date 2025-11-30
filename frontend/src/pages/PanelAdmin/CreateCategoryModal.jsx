import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import './PanelAdmin.css';

function CreateCategoryModal({ isOpen, onClose, onCategoryCreated }) {
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });

    if (!isOpen) return null;

    const handleNewCategoryChange = (e) => {
        setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
    }

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

        onCategoryCreated(data);
        setNewCategory({ name: '', description: '' });
        onClose();
    }

    const cancelCreateCategory = () => {
        setNewCategory({ name: '', description: '' });
        onClose();
    }

    return (
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
    );
}

export default CreateCategoryModal;
