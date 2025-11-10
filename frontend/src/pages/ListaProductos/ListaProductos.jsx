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
                    <div className="producto" key={producto.id}>
                    <li key={producto.id}>
                        <h3>{producto.nombre}</h3>
                        <p>Descripción: {producto.descripcion}</p>
                    </li>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ListaProductos;