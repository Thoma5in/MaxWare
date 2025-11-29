import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import './SuccessPage.css';

function SuccessPage(props) {
    const navigate = useNavigate();
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
        const timer = setTimeout(() => {
            navigate('/productos'); 
        }, 5000);
        return () => clearTimeout(timer);
    }, [navigate]); 

    const search = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const queryId = search ? search.get('id') : null;
    // intentar diferentes orígenes donde podría venir el id
    const routeId = props?.match?.params?.id || props?.location?.state?.id || queryId;

    if (!routeId) {
        console.warn('SuccessPage: no se encontró id de pago en params/state/query');
        return (
            <div className="success-page">
                <h2>Pago procesado</h2>
                <p>No se encontró identificador de pago. Comprueba la URL o el estado.</p>
            </div>
        );
    }

    return (
        <div className="success-page">
            <h2>Pago procesado</h2>
            <p>Pago ID: {routeId}</p>
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
        </div>
    );
}

export default SuccessPage;