import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queueGroupName';
import {
  Listener,
  OrderCancelledEvent,
  Subjects,
  OrderStatus,
} from '@tixit/common';
import { Order } from '../../models/order.model';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error('Order not found!');
    }

    order.set({ status: OrderStatus.CANCELLED });
    await order.save();

    msg.ack();
  }
}
