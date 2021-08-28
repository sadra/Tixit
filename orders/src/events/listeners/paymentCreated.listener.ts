import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import {
  Listener,
  Subjects,
  PaymentCreatedEvent,
  OrderStatus,
} from '@tixit/common';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const { id, orderId, stripeId } = data;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.COMPLETED,
    });
    await order.save();

    msg.ack();
  }
}
