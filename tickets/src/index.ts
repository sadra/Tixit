import { natsWrapper } from './../wrappers/nats.wrapper';
import 'express-async-errors';
import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT Key is not provided!');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not provided!');
  }

  try {
    await natsWrapper.connect('ticketing', 'ljsdf', 'http://nats-cip-srv:4222');

    natsWrapper.client!.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () =>
    console.log('Ticket microservice is listening on port 3000!')
  );
};

start();
