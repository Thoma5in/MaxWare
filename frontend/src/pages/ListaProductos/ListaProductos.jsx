import React, { useEffect, useState } from 'react';
import { useCart } from '../../contexts/CartContext'; 
import api from "../../services/api";
import './ListaProductos.css';

const ListaProductos = () => {
    const [productos, setProductos] = useState([]);
    // Usamos el hook de carrito
    const { addToCart } = useCart(); 
    // Estado para manejar el filtro de ordenamiento
    const [ordenamiento, setOrdenamiento] = useState('none'); 
    

    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                // Llamando a tu endpoint /productos
                const respuesta = await api.get('/productos');
                console.log(respuesta.data);
                setProductos(respuesta.data);
            } catch (error) {
                console.error("Error al obtener productos:", error);
            }
        }
        obtenerProductos();
    }, []);

    // Función para manejar el clic en "Agregar al Carrito"
    const handleAddToCart = (producto) => {
        addToCart(producto);
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
                {/* Asumo que ya tienes un componente de Búsqueda aquí */}
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
                    <button className="filter-button">Rating</button>
                </div>
            </div>
            
            {/* --- Lista de Productos --- */}
            <div className="lista-productos"> 
                {productosOrdenados.map(producto => (
                    <article className="producto-card" key={producto.id}>
                        {/* 1. Imagen del producto */}
                        {/* Asumo que 'image' es una URL a la imagen */}
                        <img 
                            src={producto.image_url || 'placeholder.jpg'} 
                            alt={producto.name} 
                            className="producto-imagen"
                        />

                        <div className="producto-card-body">
                            <h3 className="producto-nombre">{producto.name}</h3>
                            {producto.price !== undefined && 
                                <p className="producto-precio">${producto.price}</p>
                            }
                            <p className="producto-descripcion">{producto.description}</p>
                            
                            {/* 2. Botón "add to car" */}
                            <button 
                                className="btn-add-to-cart"
                                onClick={() => handleAddToCart(producto)}
                            >
                                add to car
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}

export default ListaProductos;