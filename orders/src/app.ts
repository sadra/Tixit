import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError, UserMiddleware } from '@tixit/common';
import cookieSession from 'cookie-session';
import { indexOrdersRouter } from './routes/index';
import { showOrderRouter } from './routes/show';
import { createNewOrderRouter } from './routes/new';
import { deleteOrderRouter } from './routes/delete';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(UserMiddleware);
app.use(indexOrdersRouter);
app.use(showOrderRouter);
app.use(createNewOrderRouter);
app.use(deleteOrderRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
