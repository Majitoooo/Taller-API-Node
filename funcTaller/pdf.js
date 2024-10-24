import express from 'express';
import PDFDocument from 'pdfkit';
import fs from 'fs';

const generarPDF = (ia) => {
    const doc = new PDFDocument();
    const filePath = `./pdfs/${ia.nombre}_IA.pdf`;

    // Crear carpeta si no existe
    if (!fs.existsSync('./pdfs')) {
        fs.mkdirSync('./pdfs');
    }

    // Crear el archivo PDF
    doc.pipe(fs.createWriteStream(filePath));

    // Contenido del PDF
    doc.fontSize(20).text('Nueva IA agregada', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Nombre: ${ia.nombre}`);
    doc.text(`Creador: ${ia.creador}`);
    doc.text(`Descripción: ${ia.descripcion}`);
    doc.text(`Año: ${ia.año}`);
    doc.text(`Tipo: ${ia.tipo}`);

    doc.end();
};

export { generarPDF };
