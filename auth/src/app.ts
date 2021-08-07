import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { NotFoundError } from './errors/notFound.error';
import { CurrentUserRouter } from './routes/currentUser.route';
import { SignInRouter } from './routes/signin.route';
import { SignOutRouter } from './routes/signout.route';
import { SignUpRouter } from './routes/signup.route';
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

export { app }
