import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import CreateProductForm from './CreateProductForm';
import CreateCategoryModal from './CreateCategoryModal';
import EditProductModal from './EditProductModal';
import ProductList from './ProductList';
import NotificationsTable from './NotificationsTable';
import './PanelAdmin.css';

function PanelAdmin() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [lastCreatedCategoryId, setLastCreatedCategoryId] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
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

    //Eliminar producto
    const deleteProducts = async (id) => {
        await supabase.from('products').delete().eq('id', id);
        fetchProducts();
    }

    const handleCategoryCreated = (newCategory) => {
        setCategories((prev) => [...(prev || []), newCategory]);
        setLastCreatedCategoryId(newCategory.id);
        setShowCategoryForm(false);
    }

    const handleEditProduct = (product) => {
        setEditingProduct(product);
    }

    const handleProductUpdated = () => {
        fetchProducts();
        setEditingProduct(null);
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

            <CreateProductForm
                categories={categories}
                onProductCreated={fetchProducts}
                onOpenCategoryModal={() => setShowCategoryForm(true)}
                preSelectedCategoryId={lastCreatedCategoryId}
            />

            <CreateCategoryModal
                isOpen={showCategoryForm}
                onClose={() => setShowCategoryForm(false)}
                onCategoryCreated={handleCategoryCreated}
            />

            <EditProductModal
                isOpen={!!editingProduct}
                onClose={() => setEditingProduct(null)}
                product={editingProduct}
                onProductUpdated={handleProductUpdated}
                categories={categories}
            />

            <h2>Productos actuales</h2>
            <ProductList
                products={products}
                onDelete={deleteProducts}
                onEdit={handleEditProduct}
            />

            <NotificationsTable theme={theme} />
        </div>
    )
}

export default PanelAdmin;