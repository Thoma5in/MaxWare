const express = require('express');
const paypal = require('@paypal/checkout-server-sdk'); 
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();
console.log("PAYPAL_CLIENT_ID:", process.env.PAYPAL_CLIENT_ID);
console.log("PAYPAL_CLIENT_SECRET:", process.env.PAYPAL_CLIENT_SECRET);

const app = express();
const PORT = 3001; 

app.use(cors({ origin: 'https://max-ware.vercel.app' })); 
app.use(bodyParser.json());

if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    console.error("❌ ERROR: Claves de PayPal no definidas.");
    process.exit(1); 
}

//Configurar el entorno
let environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID, 
    process.env.PAYPAL_CLIENT_SECRET
);
//Creacion de la instancia del cliente
let client = new paypal.core.PayPalHttpClient(environment);


app.post('/create-order', async (req, res) => {
    const { items } = req.body;
    
    // Calcular el total
    const totalAmount = items.reduce((total, item) => 
        total + (parseFloat(item.unit_price) * item.quantity), 0
    ).toFixed(2); 

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD', 
                value: totalAmount,

                breakdown: {
                    item_total: {
                        currency_code: 'USD',
                        value: totalAmount
                    }
                }
            },
            items: items.map(item => ({
                name: item.title,
                unit_amount: {
                    currency_code: 'USD',
                    value: parseFloat(item.unit_price).toFixed(2)
                },
                quantity: item.quantity.toString(),
            })),
        }],
        application_context: {
            brand_name: 'MaxWare',
            landing_page: 'BILLING',
            return_url: 'https://max-ware.vercel.app/success',
            cancel_url: 'https://max-ware.vercel.app/failure', 
        }
    });

    try {
        const order = await client.execute(request);
        res.status(201).json({ 
            orderID: order.result.id,
            links: order.result.links
        });
    } catch (err) {
        console.error("Error al crear la orden de PayPal:", err.message);
        res.status(500).send({ error: "Error al crear la orden de PayPal." });
    }
});


app.listen(PORT, () => console.log(`Servidor de Pagos (PayPal Sandbox) corriendo en http://localhost:${PORT}`));
