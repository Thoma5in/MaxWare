import React from 'react';
import './ProductDetail.css';

const ProductDetail = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  return (
    <div className="product-detail-overlay">
      <div className="product-detail-modal">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <div className="product-detail-image-section">
          <img className="main-image" src={product.image} alt={product.title} />
          <div className="thumbnail-row">
            {product.images && product.images.map((img, idx) => (
              <img key={idx} className="thumbnail" src={img} alt={`thumb-${idx}`} />
            ))}
          </div>
        </div>
        <div className="product-detail-info">
          <h2>{product.title}</h2>
          <h3 className="product-detail-price">{product.price} $</h3>
          <p className="product-detail-description">Descripción: {product.description}</p>
          <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
