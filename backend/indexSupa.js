require('dotenv').config();
const { supabase } = require('./supabaseClient');
const express = require('express');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

// Función que obtiene y muestra los productos en consola
async function fetchAndLogProductos() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*');
        if (error) {
            console.error('Error al obtener productos desde Supabase:', error);
            return;
        }
        console.log('Productos desde Supabase:', data);
    } catch (err) {
        console.error('Error interno al obtener productos:', err);
    }
}

// Llamada inicial para mostrar datos al arrancar
//fetchAndLogProductos();

// refrescar cada 30 segundos mientras el servidor está en marcha
//const REFRESH_MS = 50_000;
//setInterval(fetchAndLogProductos, REFRESH_MS);


app.get('/productos', async (req, res) => {
    try {

        const { categoria } = req.query;

        let query = supabase.from('products').select('*');

        if (categoria) {
            query = query.eq('category_id', categoria);
        }



        const { data, error } = await query;
        if (error) {
            console.error('Error al obtener productos en GET /productos:', error);
            return res.status(500).json({ error: 'Error al obtener productos' });
        }
        //console.log('GET /productos ->', data);
        res.json(data);
    } catch (err) {
        console.error('Error al obtener productos desde Supabase:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/categorias', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*');

        if (error) {
            console.error("Error al obtener categorías:", error);
            return res.status(500).json({ error });
        }

        res.json(data);

    } catch (err) {
        console.error("Error en /categorias:", err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/profile/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error al obtener perfil:", error);
            return res.status(500).json({ error: error.message });
        }

        if (!data) {
            return res.status(404).json({ error: 'Perfil no encontrado' });
        }

        res.json(data);
    } catch (err) {
        console.error("Error en /profile/:id:", err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor conectado a Supabase escuchando en puerto ${PORT}`);
});


