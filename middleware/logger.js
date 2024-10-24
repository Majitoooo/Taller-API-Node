import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';

// Middleware 
export const accessLogger = (req, res, next) => {
    const currentDateTime = dayjs().format('HH:mm DD-MM-YYYY');
    
    const logLine = `${currentDateTime} - ${req.method} ${req.originalUrl}\n`;
    
    fs.appendFile(path.join(__dirname, 'access_log.txt'), logLine, (err) => {
        if (err) {
            console.error('Error al escribir en el archivo de log:', err);
        }
    });

    next(); 
};