import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { NotFoundError } from './errors/notFound.error';
import { CurrentUserRouter } from './routes/currentUser.route';
import { SignInRouter } from './routes/signin.route';
import { SignOutRouter } from './routes/signout.route';
import { SignUpRouter } from './routes/signup.route';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

const app = express();
app.settings('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(CurrentUserRouter);
app.use(SignInRouter);
app.use(SignOutRouter);
app.use(SignUpRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
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
