import express from 'express';
import {read, write} from './src/utils/files.js'
//Librería adicional
import PDFDocument from 'pdfkit';
import fs from 'fs';
import Joi from 'joi';

const app = express();
app.use(express.json());

//Esquema de Validaciòn con Joi
const iaEsquema = Joi.object({
    nombre: Joi.string().min(3).max(30).required(),
    creador: Joi.string().min(3).max(30).required(),
    descripcion: Joi.string().min(10).required(),
    año: Joi.number().integer().min(2000).max(new Date().getFullYear()).required(),
    tipo: Joi.string().required(),
    activo: Joi.boolean().required(),
    version: Joi.string().required(),
    cursos: Joi.array().items(Joi.string()).required(),
    fechaLanzamiento: Joi.date().iso().required(),
});

// Función para crear un PDF cuando se agrega una nueva IA, es decir, en el POST
const generarPDF = (ia) => {
    const doc = new PDFDocument();
    const filePath = `./pdfs/${ia.nombre}_IA.pdf`;

    // Crear carpeta si no existe, en esta voy a guardar todos los pdf
    if (!fs.existsSync('./pdfs')) {
        fs.mkdirSync('./pdfs');
    }

    // Crear el archivo PDF utilizando file system
    doc.pipe(fs.createWriteStream(filePath));

    // Contenido del PDF, que es básicamente todos los campos de nuestro post al agregar una IA
    //También, con tamaños de letras y alineaciones
    doc.fontSize(20).text('Nueva IA agregada', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Nombre: ${ia.nombre}`);
    doc.text(`Creador: ${ia.creador}`);
    doc.text(`Descripción: ${ia.descripcion}`);
    doc.text(`Año: ${ia.año}`);
    doc.text(`Tipo: ${ia.tipo}`);

    doc.end();
};

//GET: Ruta para entregar todo el listado de IA's almacenados en el archivo JSON.
app.get('/ias',(req, res) => {
    const ias = read();
    console.log('ias', ias);
    res.setHeader('Content-Type', 'aplication/json');
    res.end(JSON.stringify(ias));
})  

//GET: Ruta para entregar la información de la IA con el ID recibido por parámetro.
app.get('/ias/:id', (req, res) => {
    const ias = read();
    const ia = ias.find(ia => ia.id === parseInt(req.params.id));
    if(ia){
        res.json(ia);
    }else{
        res.status(404).end();
    }
})

//POST: Ruta para agregar una nueva IA al archivo JSON.
app.post('/ias', (req, res) => {
    //Validar los datos del cuerpo de la solicitud 
    const { error } = iaEsquema.validate(req.body);
    if (error){
        return res.status(400).json({error : error.details[0].message });
    }
    
    const ias = read();
    const ia ={
        ...req.body,
        id: ias.length + 1
    }
    ias.push(ia);
    write(ias);

    //Genera un pdf 
    generarPDF(ia);

    res.status(201).json(ias);
})

//PUT: Ruta para actualizar la información de una IA (El que tenga el ID de la ruta).
app.put('/ias/:id', (req, res) => {
    const ias = read();
    let ia = ias.find(ia => ia.id === parseInt(req.params.id));
    if (ia) {
        //Actualizar ia
        ia = {
            ...ia,
            ...req.body
        }
        //Actualizar ia en el array
        ias[
            ias.findIndex(ia => ia.id === parseInt(req.params.id)) 
        ] = ia;
        write(ias);
        res.json(ia);
    } else {
        res.status(404).end();
    }
})

//DELETE: Ruta para eliminar una IA del archivo JSON.
app.delete('/ias/:id', (req, res) => {
    const ias = read();
    const ia = ias.find(ia => ia.id === parseInt(req.params.id));
    if (ia) {
        //Eliminar ia
        ias.splice(
            ias.findIndex(ia => ia.id === parseInt(req.params.id)),
            1
        );
        write(ias);
        res.json(ia);
    }else {
        res.status(404).end();  
    }
})

app.listen(5000, () => {
    console.log('Server is running on port 5000')
});