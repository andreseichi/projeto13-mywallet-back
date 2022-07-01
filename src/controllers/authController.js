import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

import db from '../databases/mongo.js';

import { createUserSchema } from '../schemas/createUserSchema.js';
import { loginUserSchema } from '../schemas/loginUserSchema.js';

export async function createUser(req, res) {
  const user = req.body;
  const { password } = user;

  const { error } = createUserSchema.validate(user);
  if (error) {
    const errorsMessageArray = error.details.map((error) => error.message);
    return res.status(422).send(errorsMessageArray);
  }

  const passwordEncrypted = bcrypt.hashSync(password, 10);

  try {
    // await mongoClient.connect();
    // const db = mongoClient.db('myWallet');
    const usersCollection = db.collection('users');

    const userDB = await usersCollection.findOne({ email: user.email });
    if (userDB) {
      return res.status(409).send('Conta já cadastrada');
    }

    await usersCollection.insertOne({ ...user, password: passwordEncrypted });

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function loginUser(req, res) {
  const user = req.body;
  const { password } = user;

  const { error } = loginUserSchema.validate(user);
  if (error) {
    const errorsMessageArray = error.details.map((error) => error.message);
    return res.status(422).send(errorsMessageArray);
  }

  try {
    const usersCollection = db.collection('users');
    const userDB = await usersCollection.findOne({ email: user.email });

    if (userDB && bcrypt.compareSync(password, userDB.password)) {
      const sessionsCollection = db.collection('sessions');
      const sessionUserDB = await sessionsCollection.findOne({
        userId: new ObjectId(userDB._id),
      });

      if (sessionUserDB) {
        await sessionsCollection.deleteOne({
          _id: new ObjectId(sessionUserDB._id),
        });
      }

      const token = uuid();
      const sessionUser = {
        userId: userDB._id,
        token,
      };
      await sessionsCollection.insertOne(sessionUser);

      return res.send({ token });
    } else {
      return res.status(404).send('E-mail ou senha incorretas');
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function logoutUser(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const sessionsCollection = db.collection('sessions');
    await sessionsCollection.deleteOne({ token });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
