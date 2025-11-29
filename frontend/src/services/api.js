import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL; 

const api = axios.create({
  baseURL: API_URL,
});

/* Añadido: helper para manejar respuestas y distinguir errores de red/CORS */
async function handleFetchResponse(res) {
    if (!res.ok) {
        const text = await res.text().catch(() => res.statusText || '');
        throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
    }
    try {
        return await res.json();
    } catch {
        return null;
    }
}

/* Añadido: función segura para crear token en backend */
export async function postCreateCardToken(body) {
    try {
        const url = `${process.env.REACT_APP_API_URL || ''}/checkout/api_integration/core_methods/create_card_token`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await handleFetchResponse(res);
        if (!data || (!data.id && !data.token)) {
            console.error('postCreateCardToken: respuesta inválida', data);
            throw new Error('Tokenización fallida: no se recibió id/token');
        }
        // normalizar si backend devuelve `token`
        return data.id ? data : { ...data, id: data.token };
    } catch (err) {
        if (err instanceof ProgressEvent) {
            console.error('Network/CORS error al llamar create_card_token', err);
            throw new Error('Network/CORS error al comunicarse con el servidor');
        }
        console.error('postCreateCardToken error', err);
        throw err;
    }
}

export default api;