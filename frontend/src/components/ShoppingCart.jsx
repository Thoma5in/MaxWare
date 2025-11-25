import React from 'react';
import {useCart} from '../contexts/CartContext';
import './ShoppingCart.css';

const ShoppingCart = ({isVisible, onClose}) => {
    const { cartItems, updateQuantity, clearCart, removeItem} = useCart();
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    //Funcion para calcular total de la compra
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
            title: item.name,
            unit_price: item.price, 
            quantity: item.quantity,
        }));

        try {
            // LLAMADA AL SERVIDOR DE Paypal
            const response = await fetch('http://localhost:3001/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // El body envía solo el array de ítems al endpoint 
                body: JSON.stringify({ items: itemsForCheckout }), 
            });

            const data = await response.json();

            if (response.ok && data.links) {
                const approveLink = data.links.find(link => link.rel === 'approve');
                if (approveLink) {
                    // Redirigir al usuario a la URL de aprobación de Mercado Pago
                    window.location.href = approveLink.href;
                }
            } else {
                console.error("Error al generar la orden de pago:", data.error);
                alert('Error al generar la orden de pago. Revisa la consola y el servidor.');
            }
        } catch (error) {
            console.error("Error de conexión con el servidor de pagos:", error);
            alert("No se pudo conectar con el servidor de pagos (Puerto 3001). Asegúrate de que está corriendo.");
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