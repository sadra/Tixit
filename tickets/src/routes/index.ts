import express, { Request, Response } from 'express';
import { NotFoundError } from '@tixit/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  const ticket = await Ticket.find({});

  res.status(200).send(ticket);
});

export { router as showAllTickets };