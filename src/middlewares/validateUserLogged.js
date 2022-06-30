import db from '../databases/mongo.js';

export async function validateUserLogged(req, res, next) {
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

    res.locals.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
