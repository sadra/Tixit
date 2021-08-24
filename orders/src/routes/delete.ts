import { OrderCancelledPublisher } from './../events/publishers/orderCancelled.publisher';
import express, { Request, Response } from 'express';
import {
  NotAuthorizedError,
  NotFoundError,
  RequireAuthMiddleware,
} from '@tixit/common';
import { Order, OrderStatus } from '../models/order';
import { natsWrapper } from '../nats.wrapper';

const router = express.Router();

router.delete(
  '/api/orders/:id',
  RequireAuthMiddleware,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.user!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.CANCELLED;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send();
  }
);

export { router as deleteOrderRouter };
