import express, { Request, Response } from 'express';
import {
  NotAuthorizedError,
  RequireAuthMiddleware,
  UserMiddleware,
  ValidationRequestMiddleware,
} from '@tixit/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

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
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.user!.id,
    });

    await ticket.save();

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
