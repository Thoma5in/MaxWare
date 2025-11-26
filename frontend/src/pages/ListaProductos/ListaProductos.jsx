import React, { useEffect, useState } from 'react';
import { useCart } from '../../contexts/CartContext'; 
import api from "../../services/api";
import ProductDetail from '../../components/ProductDetail';
import './ListaProductos.css';

const ListaProductos = () => {
    const [productos, setProductos] = useState([]);
    // Usamos el hook de carrito
    const { addToCart } = useCart(); 
    //Filtro de categorías
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    // Estado para manejar el filtro de ordenamiento
    const [ordenamiento, setOrdenamiento] = useState('none'); 


    useEffect(() => {
        const obtenerCategorias = async () => {
            try {
                const res = await api.get('/categorias'); // Mi endpoint de categorías
                setCategorias(res.data);
            } catch (error) {
                console.error("Error al obtener categorías:", error);
            }
        }
        obtenerCategorias();
    }, [])
    

    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                // Llamando a tu endpoint /productos
                const respuesta = await api.get('/productos', {
                    params:{
                        categoria: categoriaSeleccionada || undefined,
                    }
                }); 
                setProductos(respuesta.data);
            } catch (error) {
                console.error("Error al obtener productos:", error);
            }
        }
        obtenerProductos();
    }, [categoriaSeleccionada]);

    // Función para manejar el clic en "Agregar al Carrito"
    const handleAddToCart = (producto) => {
        addToCart(producto);
    };

    // Mostrar detalle al hacer clic en la tarjeta
    const handleProductClick = (producto) => {
        setSelectedProduct({
            ...producto,
            image: producto.image_url || 'placeholder.jpg',
            images: [
                producto.image_url || 'placeholder.jpg',
                producto.image_url || 'placeholder.jpg',
                producto.image_url || 'placeholder.jpg',
                producto.image_url || 'placeholder.jpg',
            ],
            title: producto.name,
        });
    };

    // Función para ordenar productos (simulación de filtros)
    const productosOrdenados = [...productos].sort((a, b) => {
        if (ordenamiento === 'price_asc') {
            return (a.price || 0) - (b.price || 0);
        }
        if (ordenamiento === 'price_desc') {
            return (b.price || 0) - (a.price || 0);
        }
        // Puedes añadir más lógica de ordenamiento (e.g., Rating, Nombre)
        return 0;
    });

    return (
        <div className="productos-container">
            {/* --- Sección de Filtros --- */}
            <div className="product-filters-row">
                <input type="search" placeholder="Search" className="search-input" /> 
                <div className="filters-right">
                    <button className="filter-button new-button">✓ New</button>
                    <button 
                        className={`filter-button ${ordenamiento === 'price_asc' ? 'active' : ''}`}
                        onClick={() => setOrdenamiento('price_asc')}
                    >
                        Price ascending
                    </button>
                    <button 
                        className={`filter-button ${ordenamiento === 'price_desc' ? 'active' : ''}`}
                        onClick={() => setOrdenamiento('price_desc')}
                    >
                        Price descending
                    </button>
                </div>
            </div>
            {/* --- Lista de Productos --- */}
            <div className="lista-productos"> 

                {/* --- PANEL LATERAL DE FILTROS --- */}
            <aside className="sidebar-filtros">

                <h2>Filtros</h2>

                {/* Categorías */}
                <h3>Categorías</h3>
                <div className="filtro-categorias">
                    <label>
                        <input
                            type="radio"
                            value=""
                            checked={categoriaSeleccionada === ""}
                            onChange={() => setCategoriaSeleccionada("")}
                        />
                        <span className="radio-label">Todas</span>
                    </label>

                    {categorias.map(cat => (
                        <label key={cat.id}>
                            <input
                                type="radio"
                                value={cat.id}
                                checked={categoriaSeleccionada == cat.id}
                                onChange={() => setCategoriaSeleccionada(cat.id)}
                            />
                            <span className="radio-label">{cat.name}</span>
                        </label>
                    ))}
                </div>
            </aside>
                {productosOrdenados.map(producto => (
                    <article className="producto-card" key={producto.id} onClick={() => handleProductClick(producto)} style={{cursor:'pointer'}}>
                        <img 
                            src={producto.image_url || 'placeholder.jpg'} 
                            alt={producto.name} 
                            className="producto-imagen"
                        />
                        <div className="producto-card-body">
                            <h3 className="producto-nombre">{producto.name}</h3>
                            <p className="producto-precio">
                                ${producto.price !== undefined && producto.price !== null ? producto.price : 'N/A'}
                            </p>
                            <p className="producto-descripcion">{producto.description}</p>
                            <button 
                                className="btn-add-to-cart"
                                onClick={e => { e.stopPropagation(); handleAddToCart(producto); }}
                            >
                                add to car
                            </button>
                        </div>
                    </article>
                ))}
            </div>
            {/* Modal de detalle */}
            {selectedProduct && (
                <ProductDetail 
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onAddToCart={handleAddToCart}
                />
            )}
        </div>
    )
}

export default ListaProductos;