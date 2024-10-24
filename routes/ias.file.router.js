import express from 'express';
import {read, write} from '../src/utils/files.js';
import { generarPDF } from '../funcTaller/pdf.js';
import { iaEsquema } from '../funcTaller/validaciones.js';
import { addRegistro } from '../middleware/middleware.js';
import dayjs from 'dayjs';

export const iasFileRouter = express.Router();

iasFileRouter.use(addRegistro);

//GET: Ruta para entregar todo el listado de IA's almacenados en el archivo JSON.
//En esta, agregamos los query params
iasFileRouter.get('/',(req, res) => {
    let ias = read();

    const {dato, valor, limit } = req.query;

    //Filtramos
    if (dato && valor){
        ias = ias.filter(ia => ia[dato] && ia[dato].toString().toLowerCase() === valor.toLowerCase());
    }

    if(limit){
        ias = ias.slice(0, parseInt(limit));
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(ias));
})  

//GET: Ruta para entregar la información de la IA con el ID recibido por parámetro.
iasFileRouter.get('/:id', (req, res) => {
    const ias = read();
    const ia = ias.find(ia => ia.id === parseInt(req.params.id));
    if(ia){
        res.json(ia);
    }else{
        res.status(404).end();
    }
})

//POST: Ruta para agregar una nueva IA al archivo JSON.
iasFileRouter.post('/', (req, res) => {
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

// PUT: Para cambiar un campo específico de todos los registros
iasFileRouter.put('/actualizar-todos', (req, res) => {
    const ias = read(); 

    const { field, value } = req.body; 

    if (!field || value === undefined) {
        return res.status(400).json({ message: 'El campo y el valor son requeridos.' });
    }

    if (!Array.isArray(ias) || ias.length === 0) {
        return res.status(404).json({ message: 'No se encontraron registros para actualizar.' });
    }

    ias.forEach(ia => {
        ia[field] = value; // Cambiar el campo al nuevo valor
        ia.updated_at = dayjs().format('HH:mm DD-MM-YYYY'); // Actualizar la fecha
    });

    try {
        write(ias); 
        res.json({ message: 'Todos los registros han sido actualizados', updatedRecords: ias }); // Enviar los registros actualizados como respuesta
    } catch (error) {
        console.error('Error al escribir el archivo:', error);
        res.status(500).json({ message: 'Error al guardar los registros.' });
    }
});


//PUT: Ruta para actualizar la información de una IA (El que tenga el ID de la ruta).
iasFileRouter.put('/:id', (req, res) => {
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
iasFileRouter.delete('/:id', (req, res) => {
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


