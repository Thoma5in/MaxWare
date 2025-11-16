import React from "react";
import { useCart } from "../contexts/CartContext";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

    return (
        <div className="product-card">
            <img src={product.image || "paceholder.jpg"} alt={product.name} className="product-image" />
            <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">${product.price}</p>
                <p className="product-description">{product.description}</p>
                <button className="add-to-cart-btn" onClick={handleAddToCart}>Agregar al Carrito</button>
            </div>
        </div>
    );
}
export default ProductCard;