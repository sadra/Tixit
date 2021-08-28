import { natsWrapper } from '../nats.wrapper';
import express, { Request, Response } from 'express';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  RequireAuthMiddleware,
  ValidationRequestMiddleware,
} from '@tixit/common';
import { body } from 'express-validator';
import { Order } from '../models/order.model';
import { stripe } from '../stripe';

const router = express.Router();

router.post(
  '/api/payments',
  RequireAuthMiddleware,
  [
    body('token').not().isEmpty().withMessage('Token is required'),
    body('orderId').not().isEmpty().withMessage('orderId is required'),
  ],
  ValidationRequestMiddleware,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.user!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestError('Cannot pay for an cancelled order');
    }

    await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    res.status(201).send({ success: true });
  }
);

export { router as createChargeRouter };
