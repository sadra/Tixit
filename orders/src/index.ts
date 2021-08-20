import { natsWrapper } from './nats.wrapper';
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
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID is not provided!');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL is not provided!');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID is not provided!');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

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
