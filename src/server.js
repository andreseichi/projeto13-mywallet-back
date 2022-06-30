import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { createUser, loginUser } from './controllers/userController.js';
import {
  createTransaction,
  getTransactions,
} from './controllers/transactionController.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = express();
server.use(cors(), json());

// rotas
server.post('/sign-up', createUser);
server.post('/sign-in', loginUser);

server.post('/transactions', createTransaction);
server.get('/transactions', getTransactions);

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
