import Joi from 'joi';

const iaSchema = Joi.object({
    nombre: Joi.string().min(3).max(100).required(), 
    creador: Joi.string().min(3).max(100).required(), 
    descripcion: Joi.string().min(10).max(500).required(), 
    activo: Joi.boolean().required(), 
    version: Joi.string().pattern(/^[0-9]+\.[0-9]+$/).required(), 
    cursos: Joi.array().items(Joi.string().min(3)).min(1).required(), 
    fechaLanzamiento: Joi.date().iso().required() 
});

export default iaSchema;
