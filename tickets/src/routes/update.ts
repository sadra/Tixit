import express, { Request, Response } from 'express';
import {
  NotAuthorizedError,
  NotFoundError,
  RequireAuthMiddleware,
  UserMiddleware,
  ValidationRequestMiddleware,
} from '@tixit/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.put(
  '/api/tickets/:id',
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
    const id = req.params.id;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.user!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title,
      price,
    });

    await ticket.save();

    res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
