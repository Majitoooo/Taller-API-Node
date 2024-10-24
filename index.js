import express from 'express';
import { routerIas } from './routes/index.js';
import { accessLogger } from './middleware/logger.js';

const app = express();

app.use(express.json());

routerIas(app);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
