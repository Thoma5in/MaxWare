import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FailurePage.css';

function FailurePage() {
    const navigate = useNavigate();

    return (
        <div className="failure-container">
            <h1>¡Fallo en el Pago! </h1>
            <h2>La transacción no pudo ser procesada o fue rechazada.</h2>
            <p>
                Por favor, verifica los datos de tu tarjeta, el saldo disponible o intenta con otro método de pago.
            </p>
            <p>
                Si el problema persiste, contacta a tu banco o a soporte técnico.
            </p>
            
            <button 
                className="btn-retry" 
                onClick={() => navigate('/productos')}
            >
                Volver al Carrito
            </button>
        </div>
    );
}

export default FailurePage;