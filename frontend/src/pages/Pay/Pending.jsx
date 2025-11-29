import React from 'react';
import { Link } from 'react-router-dom'; // Asumiendo que usas React Router
import { postCreateCardToken } from '../../services/api'; // añadido si no existía

const Pending = () => {
    // Aquí puedes intentar extraer el ID de la orden de la URL
    // Aunque Mercado Pago no siempre pasa el ID en la URL Pending
    
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>⏳ Pago Pendiente de Confirmación</h1>
                <p style={styles.message}>
                    Tu pago ha sido iniciado, pero está pendiente de acreditación.
                    Esto puede tardar unos minutos si usaste métodos como transferencia bancaria o efectivo.
                </p>
                <p style={styles.details}>
                    El estado de tu orden se actualizará automáticamente una vez que Mercado Pago nos notifique la acreditación.
                </p>
                <Link to="/" style={styles.link}>
                    Volver a la tienda
                </Link>
            </div>
        </div>
    );
};

/* Añadida: función segura para crear token (maneja SDK cliente y fallback a backend) */
async function handleCreateToken(cardData) {
    const mpKey = process.env.REACT_APP_MERCADOPAGO_PUBLIC_KEY;
    if (!mpKey) {
        console.error('Falta REACT_APP_MERCADOPAGO_PUBLIC_KEY en .env');
        throw new Error('Configuración: clave pública de MercadoPago no disponible');
    }
    if (!window.Mercadopago) {
        console.error('Mercadopago SDK no inicializado en window');
        throw new Error('SDK de MercadoPago no inicializado');
    }

    try {
        // Si usas el SDK de MercadoPago en cliente
        if (typeof window.Mercadopago.createCardToken === 'function') {
            const response = await new Promise((resolve, reject) => {
                window.Mercadopago.createCardToken(cardData, (status, result) => {
                    if (status >= 200 && status < 300) resolve(result);
                    else reject(result || new Error('Tokenización fallida (SDK)'));
                });
            });
            if (!response || !response.id) {
                console.error('Tokenización inválida (SDK)', response);
                throw new Error('Tokenización fallida: no se recibió id');
            }
            return response.id;
        }

        // Fallback: pedir al backend que cree el token
        const backendResp = await postCreateCardToken(cardData);
        if (!backendResp || !backendResp.id) {
            console.error('Respuesta backend inválida', backendResp);
            throw new Error('Tokenización fallida (backend): no se recibió id');
        }
        return backendResp.id;
    } catch (err) {
        if (err instanceof ProgressEvent) {
            console.error('Error de red/CORS durante tokenización', err);
            throw new Error('Error de red/CORS durante tokenización');
        }
        console.error('handleCreateToken error', err);
        throw err;
    }
}

/* Añadida: helper para leer id de refs de forma segura */
function safeReadElementId(ref) {
    if (!ref) return null;
    const el = ref.current || ref;
    if (!el) return null;
    return el.id || null;
}

// Estilos básicos para hacerlo legible
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        backgroundColor: '#f8f8f8',
    },
    card: {
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '450px',
        width: '100%',
    },
    title: {
        color: '#ffc107',
        marginBottom: '20px',
        fontSize: '24px',
    },
    message: {
        color: '#333',
        marginBottom: '15px',
        fontSize: '16px',
    },
    details: {
        color: '#666',
        marginBottom: '30px',
        fontSize: '14px',
    },
    link: {
        display: 'inline-block',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '4px',
        fontWeight: 'bold',
    }
};

export default Pending;