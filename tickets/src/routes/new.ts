import express, { Request, Response } from 'express';
import {
  RequireAuthMiddleware,
  ValidationRequestMiddleware,
} from '@tixit/common';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/api/tickets',
  RequireAuthMiddleware,
  [
    body('title').trim().not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({
        gt: 0,
      })
      .withMessage('Price must be grater than 0.'),
  ],
  ValidationRequestMiddleware,
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

export { router as createTicketRouter };
