import express from 'express';
import publicRoutes from './routes/public.js';
import privateRoutes from './routes/private.js';
import auth from './middlewares/auth.js';
import cors from 'cors';

const PORT = parseInt(process.env.PORT, 10);
const app = express();
app.use(express.json());
app.use(cors());

app.use('/', publicRoutes);

app.use('/', auth, privateRoutes);

app.listen(PORT, () => console.log('Servido iniciado!'));
