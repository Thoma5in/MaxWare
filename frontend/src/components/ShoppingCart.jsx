import React from 'react';
import {useCart} from '../contexts/CartContext';
import './ShoppingCart.css';

const ShoppingCart = ({isVisible, onClose}) => {
    const { cartItems, updateQuantity, clearCart } = useCart();
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    //Funcion para calcular total de la compra
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.price) || 0;
            return total + (price * item.quantity);
    }, 0); 
}
    const cartTotal = calculateTotal();

    return (
        <div className={`shopping-cart-sidebar ${isVisible ? 'visible' : ''}`}>
            <div className="cart-header">
            <button className="close-btn" onClick={onClose}>&times;</button>
            <h3>Carrito de Compras ({totalItems} items)</h3>
        </div>

        <div className="cart-items-list">
            {cartItems.length === 0 ? (
                <p>El carrito está vacío.</p>
            ) : (
                cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                        <img src={item.image_url} alt={item.name} className="item-img" />
                        <div className="item-details">
                            <p className="item-name">{item.name}</p>
                            <p className="item-price">${item.price} c/u</p>
                            <div className="item-controls">
                                <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                                <span className="item-quantity">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
        {cartItems.length > 0 && (
            <div className="cart-summary">
                <p>Subtotal:</p>
                <p className="total-amount">${cartTotal.toFixed(2)}</p>
            </div>
        )}

        <div className="cart-actions">
            <button className="btn-clear-all" onClick={clearCart}>Vaciar Carrito</button>
            <button className="btn-checkout" disabled={cartItems.length === 0}>Adquirir Productos</button>
        </div>
    </div>
    );
}
export default ShoppingCart;