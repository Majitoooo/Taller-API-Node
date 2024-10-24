import dayjs from "dayjs";

//Middleware
export const addRegistro = (req, res, next) => {
    const currentDataTime = dayjs().format('HH:mm DD-MM-YYYY');

    req.body.ip = req.ip;
    if(req.method === 'POST') {
        req.body.created_at = currentDataTime;
    } else if (req.method === 'PUT') {
        req.body.updated_at = currentDataTime;
    }

    next();
}

