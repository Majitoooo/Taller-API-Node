import Joi from 'joi'; 

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
    ip: Joi.string().optional(),
    created_at: Joi.string().optional(),
    updated_at: Joi.string().optional()
});

export { iaEsquema };
