import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PanelAdmin.css';

function ProductList({ products, onDelete, onEdit }) {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredProducts = products?.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="product-list-container">
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            <div className="products-list">
                {filteredProducts?.map((p) => (
                    <div className="product-card" key={p.id}>
                        <img src={p.image_url} alt={p.name} />
                        <h3>{p.name}</h3>
                        <p>${p.price}</p>
                        <p>Stock: {p.stock}</p>

                        <button onClick={() => onEdit(p)}>Editar</button>
                        <button onClick={() => onDelete(p.id)}>Eliminar</button>
                        
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;
