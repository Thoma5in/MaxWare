import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import './SuccessPage.css';

function SuccessPage() {
    const navigate = useNavigate();
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
        const timer = setTimeout(() => {
            navigate('/productos'); 
        }, 5000);
        return () => clearTimeout(timer);
    }, [navigate]); 

    return (
        <div className="success-container">
            <h1>¡Compra Exitosa!</h1>
            <h2>Tu pago fue procesado correctamente.</h2>
            <p>
                Mercado Pago ha confirmado la transacción.
                Recibirás un correo con los detalles de tu orden.
            </p>
            <p>
                Serás redirigido a la tienda en unos segundos... 
                Si no quieres esperar, haz clic abajo.
            </p>
            <button 
                className="btn-go-home" 
                onClick={() => navigate('/productos')}
            >
                Ir a la Tienda
            </button>
        </div>
    );
}

export default SuccessPage;