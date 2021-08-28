import { PaymentCreatedPublisher } from './../events/publishers/paymentCreated.publisher';
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
import { Payment } from '../models/payment.model';

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

    const response = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: response.id,
    });
    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
