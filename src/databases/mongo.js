import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// const mongoClient = new MongoClient(process.env.MONGO_URI);
// let db;

// mongoClient.connect(() => {
//   db = mongoClient.db('myWallet');
// });

/** @type {mongodb.Db} */
let db;
try {
  const mongoClient = new MongoClient(process.env.MONGO_URL);
  await mongoClient.connect();
  db = mongoClient.db('myWallet');
} catch (e) {
  console.log('error ao se conectar ao banco', e);
}

export default db;
