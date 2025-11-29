import React from 'react';
import {useCart} from '../contexts/CartContext';
import {useAuth} from '../contexts/AuthContext';
import './ShoppingCart.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL  || 'http://localhost:4000';

function ShoppingCartItem({ item }) {
    if (!item) {
        console.warn('ShoppingCartItem: item es null/undefined');
        return null;
    }
    const id = item.id || item.product_id || null;
    if (!id) {
        console.warn('ShoppingCartItem: item sin id', item);
    }
    return (
        <div className="cart-item" data-id={id || ''}>
            <div className="cart-item__title">{item?.name || 'Sin nombre'}</div>
            <div className="cart-item__qty">{item?.quantity ?? 1}</div>
        </div>
    );
}

const ShoppingCart = ({isVisible, onClose}) => {
    const { cartItems, updateQuantity, clearCart, removeItem} = useCart();
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const {user, isAuthenticated} = useAuth();
    const userId = user?.id;

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.price) || 0;
            return total + (price * item.quantity);
    }, 0); 
    }
    const cartTotal = calculateTotal();
    
    // Función para manejar el checkout con Mercado Pago
    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        // 1. Mapear los ítems en el formato que espera el servidor (Mercado Pago)
        const itemsForCheckout = cartItems.map(item => ({
            id: item.id,
            // 🛑 Mercado Pago usa 'title' y tu carrito usa 'name'
            title: item.name, 
            unit_price: item.price, 
            quantity: item.quantity,
        }));

        try {
            // 🛑 LLAMADA AL SERVIDOR DE RENDER
            const response = await fetch(`${BACKEND_URL}/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: itemsForCheckout, userId: userId  }), 
            });

            const data = await response.json();

            // 🛑 MODIFICACIÓN CLAVE: Manejo de la respuesta de Mercado Pago
            if (response.ok && data.init_point) {
                
                // Redirigir al usuario a la URL de pago generada por Mercado Pago
                window.location.href = data.init_point; 
                
            } else {
                console.error("Error al generar la preferencia de pago:", data);
                alert('Error al generar la orden de pago. Revisa la consola y el servidor.');
            }
        } catch (error) {
            console.error("Error de conexión con el servidor de pagos:", error);
            alert(`No se pudo conectar con el servidor de pagos (${BACKEND_URL}). Asegúrate de que está desplegado y funcionando.`);
        }
    };

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
                        <button className="item-remove-btn" onClick={()=> removeItem(item.id)}>
                            &times;
                        </button>
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
                <button className="btn-checkout" onClick={handleCheckout} disabled={cartItems.length === 0}>Adquirir Productos</button>
            </div>
        </div>
    );
}
export default ShoppingCart;
