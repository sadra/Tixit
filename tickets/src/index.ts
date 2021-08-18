import 'express-async-errors';
import mongoose from 'mongoose';
import {app} from './app'

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWt Key is not provided!');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-cip-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () =>
    console.log('Auth microservice is listening on port 3000!')
  );
};

start();
