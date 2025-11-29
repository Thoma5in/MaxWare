import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { AuthProvider } from "./contexts/AuthContext";
import { postCreateCardToken } from './services/api';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

/* Implementación real: intenta tokenizar con SDK cliente y hace fallback al backend */
async function someCreateTokenFunction(cardData) {
    // SDK v1: window.Mercadopago.createCardToken, SDK v2 tiene otra API (ajusta según tu SDK)
    if (typeof window !== 'undefined' && window.Mercadopago && typeof window.Mercadopago.createCardToken === 'function') {
        return await new Promise((resolve, reject) => {
            try {
                window.Mercadopago.createCardToken(cardData, (status, result) => {
                    if (status >= 200 && status < 300) resolve(result);
                    else reject(result || new Error('Tokenización fallida (SDK)'));
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    // Fallback: pedir token al backend (usa postCreateCardToken definido en src/services/api.js)
    return await postCreateCardToken(cardData);
}

/* Envío del token al backend para procesar el pago (ajusta la ruta del backend si es necesario) */
async function sendTokenToBackend(tokenId) {
    const url = `${process.env.REACT_APP_API_URL || ''}/payments/process-token`; // crea esta ruta en tu backend si no existe
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // 🛑 CORRECCIÓN: Usar la variable 'tokenId' y cerrar el objeto correctamente
            body: JSON.stringify({ tokenId }), 
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error('sendTokenToBackend error', err);
        throw err;
    }
}

/* Reusa la función de ejemplo que añadiste antes (solo ejemplo) */
async function handleTokenCreation(cardData) {
    try {
        const tokenResponse = await someCreateTokenFunction(cardData);
        console.log('handleTokenCreation -> tokenResponse:', tokenResponse);

        // Guardia: tokenResponse nulo/indefinido
        if (!tokenResponse) {
            console.error('Tokenización devolvió null/undefined. Verifica SDK, CORS o la llamada al backend.');
            // Mostrar UI al usuario en lugar de seguir
            // p.ej.: setError('No se pudo generar el token de la tarjeta. Intente nuevamente.');
            return;
        }

        // Normalizar posibles campos devueltos por distintas implementaciones
        const tokenId = tokenResponse.id || tokenResponse.token || (tokenResponse.card && tokenResponse.card.id) || null;
        if (!tokenId) {
            console.error('Respuesta de token no contiene id/token:', tokenResponse);
            return;
        }

        // Continúa con flujo seguro
        await sendTokenToBackend(tokenId);
    } catch (err) {
        // Manejo explícito de errores de red (ProgressEvent suele indicar CORS/network)
        if (err instanceof ProgressEvent) {
            console.error('Error de red/CORS durante tokenización:', err);
        } else {
            console.error('Error en handleTokenCreation:', err);
        }
        // Opcional: mostrar mensaje al usuario
    }
}