const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const { supabase } = require('./supabaseClient');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

const app = express();
const PORT = 3001;

// Directorio para almacenar PDFs
const pdfsDir = path.join(__dirname, 'receipts_pdf');
if (!fs.existsSync(pdfsDir)) {
    fs.mkdirSync(pdfsDir);
}

app.use(cors());
app.use(bodyParser.json());

// Número de contacto de la empresa (configurable en .env)
const COMPANY_PHONE = process.env.COMPANY_PHONE || '+1-800-MAXWARE';
const COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'contacto@maxware.com';


// Función para generar PDF del recibo
const generateReceiptPDF = (receiptData) => {
    return new Promise((resolve, reject) => {
        try {
            const fileName = `receipt-${receiptData.receipt_number}.pdf`;
            const filePath = path.join(pdfsDir, fileName);
            const writeStream = fs.createWriteStream(filePath);

            const doc = new PDFDocument();
            doc.pipe(writeStream);

            // Encabezado
            doc.fontSize(20).font('Helvetica-Bold').text('RECIBO DE COMPRA', { align: 'center' });
            doc.fontSize(12).font('Helvetica').text('MaxWare', { align: 'center' });
            doc.text('Tienda Online de Productos', { align: 'center' });
            doc.moveDown(0.5);

            // Información del recibo
            doc.fontSize(10).font('Helvetica-Bold').text('Número de Recibo:', { continued: true });
            doc.font('Helvetica').text(` ${receiptData.receipt_number}`);
            
            doc.font('Helvetica-Bold').text('Fecha:', { continued: true });
            doc.font('Helvetica').text(` ${new Date(receiptData.created_at).toLocaleDateString('es-ES')}`);
            
            doc.font('Helvetica-Bold').text('Estado:', { continued: true });
            doc.font('Helvetica').text(` ${receiptData.status}`);
            doc.moveDown(0.5);

            // Información del cliente
            doc.fontSize(11).font('Helvetica-Bold').text('Datos del Cliente');
            doc.fontSize(10).font('Helvetica')
                .text(`Usuario: ${receiptData.user_profile?.username || '—'}`)
                .text(`Teléfono: ${receiptData.user_profile?.number || '—'}`)
                .text(`Dirección: ${receiptData.user_profile?.address || '—'}`);
            doc.moveDown(0.5);

            // Línea separadora
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
            doc.moveDown(0.3);

            // Encabezados de productos
            doc.fontSize(10).font('Helvetica-Bold');
            doc.text('Producto', 50, doc.y, { width: 250 });
            doc.text('Cantidad', 310, doc.y, { width: 80 });
            doc.text('Precio Unit.', 395, doc.y, { width: 80 });
            doc.text('Subtotal', 480, doc.y, { width: 70 });
            doc.moveDown(0.5);

            // Línea separadora
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
            doc.moveDown(0.3);

            // Productos
            doc.font('Helvetica');
            receiptData.items_details.forEach((item) => {
                const qty = item.quantity || 1;
                const price = parseFloat(item.unit_price || item.price || 0);
                const subtotal = qty * price;

                doc.fontSize(9);
                doc.text(item.title || item.name, 50, doc.y, { width: 250 });
                doc.text(qty.toString(), 310, doc.y - 15, { width: 80 });
                doc.text(`$${price.toFixed(2)}`, 395, doc.y - 15, { width: 80 });
                doc.text(`$${subtotal.toFixed(2)}`, 480, doc.y - 15, { width: 70 });
                doc.moveDown(0.7);
            });

            // Línea separadora final
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
            doc.moveDown(0.3);

            // Total
            doc.fontSize(12).font('Helvetica-Bold');
            doc.text(`TOTAL: $${parseFloat(receiptData.total_amount).toFixed(2)}`, 400, doc.y);
            doc.moveDown(1);

            // Información de contacto
            doc.fontSize(10).font('Helvetica-Bold').text('Contacto');
            doc.fontSize(9).font('Helvetica');
            doc.text(`Teléfono: ${COMPANY_PHONE}`);
            doc.text(`Email: ${COMPANY_EMAIL}`);
            doc.moveDown(0.5);

            // Pie de página
            doc.fontSize(8).font('Helvetica').text(
                'Gracias por tu compra. Este es tu recibo digital. Guárdalo para tu registro.',
                { align: 'center' }
            );

            doc.end();

            writeStream.on('finish', () => {
                resolve(filePath);
            });

            writeStream.on('error', (err) => {
                reject(err);
            });
        } catch (err) {
            reject(err);
        }
    });
};

// Endpoint para procesar la compra y generar recibo
app.post('/create-order', async (req, res) => {
    const { items, user_id, user_profile, receipt_number } = req.body;

    // Validar datos
    if (!items || items.length === 0 || !user_id) {
        return res.status(400).json({ error: 'Datos incompletos para procesar la compra' });
    }

    // Calcular el total
    const totalAmount = items.reduce((total, item) =>
        total + (parseFloat(item.unit_price) * item.quantity), 0
    ).toFixed(2);

    try {
        // Preparar datos para el recibo
        const receiptData = {
            user_id,
            total_amount: parseFloat(totalAmount),
            status: 'COMPLETADO',
            items_details: items,
            receipt_number,
            created_at: new Date().toISOString(),
            user_profile,
        };

        // Generar PDF del recibo
        const pdfPath = await generateReceiptPDF(receiptData);
        console.log('PDF generado en:', pdfPath);

        // Guardar recibo en Supabase
        const { data: receiptInsert, error: insertError } = await supabase
            .from('receipts')
            .insert([
                {
                    user_id,
                    total_amount: parseFloat(totalAmount),
                    status: 'COMPLETADO',
                    items_details: items,
                    receipt_number,
                    created_at: new Date().toISOString(),
                    pdf_url: `/receipts/${path.basename(pdfPath)}`,
                }
            ])
            .select('id')
            .single();

        if (insertError) {
            console.error('Error al guardar recibo en Supabase:', insertError);
            return res.status(500).json({ error: 'Error al guardar el recibo' });
        }

        console.log('Recibo guardado en BD:', receiptInsert);

        // Responder con éxito
        res.status(200).json({
            success: true,
            receipt_number,
            receipt_id: receiptInsert.id,
            total_amount: totalAmount,
            contact_phone: COMPANY_PHONE,
            contact_email: COMPANY_EMAIL,
            message: `Compra completada exitosamente. Recibo: ${receipt_number}. Para consultas: ${COMPANY_PHONE}`,
        });
    } catch (error) {
        console.error('Error procesando compra:', error);
        res.status(500).json({ error: 'Error al procesar la compra', details: error.message });
    }
});

// Servir archivos PDF estáticos
app.use('/receipts', express.static(pdfsDir));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`✅ Servidor de Compras corriendo en http://localhost:${PORT}`);
    console.log(`📞 Teléfono de contacto: ${COMPANY_PHONE}`);
});
