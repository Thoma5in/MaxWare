const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const pool = require('./db');

app.use(cors());
app.use(express.json());

app.get('/productos' , async (req, res) => {
    try {
        const resultados =  await pool.query('SELECT * FROM productos');
        res.json(resultados.rows);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/', (req, res) => {
    res.send('Servidor Backend funcionando correctamente');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`));