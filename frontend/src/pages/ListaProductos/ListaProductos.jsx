import React, { useEffect, useState } from 'react';
import api from "../../services/api";
import './ListaProductos.css';

const ListaProductos = () => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const respuesta = await api.get('/productos');
                console.log(respuesta.data);
                setProductos(respuesta.data);
            } catch (error) {
                console.error("Error al obtener productos:", error);
            }
        }
        obtenerProductos();
    }, []);

    return (
        <div className="productos-container">
            <h2>Lista de Productos 📦</h2>
            <div className="lista-productos"> 
                {productos.map(producto => (
                    // tarjeta por producto
                    <article className="producto-card" key={producto.id}>
                        <div className="producto-card-body">
                            <h3 className="producto-nombre">{producto.name}</h3>
                            {producto.price !== undefined && <p className="producto-precio">Precio: ${producto.price}</p>}
                            <p className="producto-descripcion">{producto.description}</p>
                            {/* puedes añadir imagen si existe: producto.image */}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}

export default ListaProductos;