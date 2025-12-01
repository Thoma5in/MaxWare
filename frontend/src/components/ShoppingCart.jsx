import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import './ShoppingCart.css';

const ShoppingCart = ({isVisible, onClose}) => {
    const { cartItems, updateQuantity, clearCart, removeItem} = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptNumber, setReceiptNumber] = useState(null);

    // Cargar perfil del usuario logueado
    useEffect(() => {
        if (user && user.id) {
            const fetchProfile = async () => {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                if (!error && data) {
                    setUserProfile(data);
                } else {
                    console.warn('No profile found for user:', error);
                }
            };
            fetchProfile();
        }
    }, [user]);

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    //Funcion para calcular total de la compra
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.price) || 0;
            return total + (price * item.quantity);
    }, 0); 
}
    const cartTotal = calculateTotal();
    
    // Función para manejar el checkout
    const handleCheckout = async () => {
        // Validar que haya sesión iniciada
        if (!user || !user.id) {
            alert('Por favor inicia sesión para realizar una compra.');
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) return;

        // Generar número de recibo
        const receiptNum = 'RCP-' + Date.now();
        setReceiptNumber(receiptNum);

        // Mostrar modal de confirmación con recibo
        setShowReceipt(true);
    };

    // Función para confirmar la compra y proceder con el pago
    const confirmCheckout = async () => {

        // 1. Mapear los ítems en el formato que espera el servidor (Mercado Pago)
        const itemsForCheckout = cartItems.map(item => ({
            id: item.id,
            title: item.name,
            unit_price: item.price, 
            quantity: item.quantity,
        }));

        try {
            // LLAMADA AL SERVIDOR DE pago
            const response = await fetch('http://localhost:3001/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // El body envía ítems y datos del usuario
                body: JSON.stringify({ 
                    items: itemsForCheckout,
                    user_id: user.id,
                    user_profile: userProfile,
                    receipt_number: receiptNumber,
                }), 
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setShowReceipt(false);
                clearCart();
                
                // Mostrar mensaje de éxito con contacto
                alert(
                    `✅ ¡Compra completada exitosamente!\n\n` +
                    `Número de Recibo: ${data.receipt_number}\n` +
                    `Total: $${data.total_amount}\n\n` +
                    `📞 Para consultas contacte a:\n` +
                    `${data.contact_phone}\n` +
                    `${data.contact_email}\n\n` +
                    `Tu recibo en PDF ha sido generado.`
                );
            } else {
                console.error("Error al procesar la compra:", data.error);
                alert(`❌ Error: ${data.error || 'Error al procesar la compra'}`);
                setShowReceipt(false);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("❌ No se pudo conectar con el servidor. Asegúrate de que está corriendo en puerto 3001.");
            setShowReceipt(false);
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

        {/* Modal de Recibo de Confirmación */}
        {showReceipt && (
            <div className="receipt-modal-overlay" onClick={() => setShowReceipt(false)}>
                <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="receipt-header">
                        <h2>Confirmación de Compra</h2>
                        <button className="close-receipt-btn" onClick={() => setShowReceipt(false)}>×</button>
                    </div>
                    
                    <div className="receipt-content">
                        <div className="receipt-section">
                            <h3>Número de Recibo</h3>
                            <p className="receipt-number">{receiptNumber}</p>
                        </div>

                        <div className="receipt-section">
                            <h3>Datos del Cliente</h3>
                            {userProfile ? (
                                <div className="client-info">
                                    <p><strong>Usuario:</strong> {userProfile.username || '—'}</p>
                                    <p><strong>Teléfono:</strong> {userProfile.number || '—'}</p>
                                    <p><strong>Dirección:</strong> {userProfile.address || '—'}</p>
                                </div>
                            ) : (
                                <p>Cargando datos del usuario...</p>
                            )}
                        </div>

                        <div className="receipt-section">
                            <h3>Resumen de la Compra</h3>
                            <div className="receipt-items">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="receipt-item-row">
                                        <span>{item.name}</span>
                                        <span>x{item.quantity}</span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="receipt-total">
                                <strong>Total:</strong>
                                <strong>${calculateTotal().toFixed(2)}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="receipt-actions">
                        <button className="btn-cancel-receipt" onClick={() => setShowReceipt(false)}>Cancelar</button>
                        <button className="btn-confirm-receipt" onClick={confirmCheckout}>Confirmar y Pagar</button>
                    </div>
                </div>
            </div>
        )}
    </div>
    );
}
export default ShoppingCart;