import express from 'express';
import { iasFileRouter } from './ias.file.router.js';

const router = express.Router();

export function routerIas(app){
    app.use("/api/v1", router);
    router.use("/file/ias", iasFileRouter);
}
