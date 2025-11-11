const {supabase, supabaseAuth} = require('./supabaseClient');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

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
fetchAndLogProductos();

// Opcional: refrescar cada 30 segundos mientras el servidor está en marcha
const REFRESH_MS = 30_000;
setInterval(fetchAndLogProductos, REFRESH_MS);


app.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body


        //  Crear el usuario en Supabase Auth (usa anon key)
        const { data, error } = await supabaseAuth.auth.signUp({email, password});

        if (error) {
            console.error('Error en registro:', error);
            return res.status(400).json({ error: error.message });
        }

        const user = data.user


        //Insertar su perfil asociado (nombre de usuario, fecha, etc.)
        const { error: profileError} = await supabase
        .from('profiles')
        .insert([
            { id: user.id, // mismo id del usuario de auth.users
            username: username, // lo que el usuario escribió en el frontend
         created_at:new Date() 
        } 
        ]);

        if (profileError) {
            console.error('Error al crear perfil:', profileError);
            return res.status(400).json({ error: profileError.message });
        }

        
        //Enviar respuesta
        res.status(200).json({ message: 'Usuario registrado con éxito', 
            user: {id: user.id, email: user.email, username}

         });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
})

app.get('/productos', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*');
        if (error) {
            console.error('Error al obtener productos en GET /productos:', error);
            return res.status(500).json({ error: 'Error al obtener productos' });
        }
        console.log('GET /productos ->', data);
        res.json(data);
    } catch (err) {
        console.error('Error al obtener productos desde Supabase:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});




const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor conectado a Supabase escuchando en puerto ${PORT}`);
});


