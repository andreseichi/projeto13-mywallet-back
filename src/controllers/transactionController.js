import { createTransactionSchema } from '../schemas/createTransactionSchema.js';
import { ObjectId } from 'mongodb';

import db from '../databases/mongo.js';

export async function getTransactions(req, res) {
  try {
    const { user } = res.locals;

    const userId = new ObjectId(user._id);

    const transactionsCollection = db.collection('transactions');
    const transactionsArray = await transactionsCollection
      .find({ userId })
      .toArray();

    const transactionsArrayFiltered = transactionsArray.map(
      ({ userId, ...transaction }) => transaction
    );

    return res.send(transactionsArrayFiltered);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function createTransaction(req, res) {
  const transaction = req.body;

  const { error } = createTransactionSchema.validate(transaction);
  if (error) {
    const errorsMessageArray = error.details.map((error) => error.message);
    return res.status(422).send(errorsMessageArray);
  }

  try {
    const { user } = res.locals;
    const valueFormatted = Number(transaction.value.toFixed(2));

    const transactionObject = {
      ...transaction,
      value: valueFormatted,
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
