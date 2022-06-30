import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import transactionsRoutes from './routes/transactions.routes.js';

import { validateUserLogged } from './middlewares/validateUserLogged.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = express();
server.use(cors(), json());

// rotas
server.use(authRoutes);
server.use(validateUserLogged);
server.use(transactionsRoutes);

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
