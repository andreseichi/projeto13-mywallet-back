import { createTransactionSchema } from '../schemas/createTransactionSchema.js';
import { ObjectId } from 'mongodb';

import db from '../databases/mongo.js';

export async function getTransactions(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const session = await db.collection('sessions').findOne({ token });
    if (!session) {
      return res.sendStatus(401);
    }

    const user = await db.collection('users').findOne({ _id: session.userId });
    if (!user) {
      return res.sendStatus(401);
    }
    delete user.password;

    const userId = new ObjectId(user._id);

    const transactionsCollection = db.collection('transactions');
    const transactionsArray = await transactionsCollection
      .find({ userId })
      .toArray();

    return res.send(transactionsArray);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function createTransaction(req, res) {
  const transaction = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');
  if (!token) {
    return res.sendStatus(401);
  }

  const { error } = createTransactionSchema.validate(transaction);
  if (error) {
    const errorsMessageArray = error.details.map((error) => error.message);
    return res.status(422).send(errorsMessageArray);
  }

  try {
    const session = await db.collection('sessions').findOne({ token });
    if (!session) {
      return res.sendStatus(401);
    }

    const user = await db.collection('users').findOne({ _id: session.userId });
    if (!user) {
      return res.sendStatus(401);
    }
    delete user.password;

    const transactionObject = {
      ...transaction,
      userId: user._id,
      date: new Date(),
    };

    const transactionsCollection = db.collection('transactions');
    await transactionsCollection.insertOne(transactionObject);

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
