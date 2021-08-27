import { OrderCancelledPublisher } from './../publishers/orderCancelled.publisher';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  OrderStatus,
} from '@tixit/common';
import { Order } from '../../models/order';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const { orderId } = data;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.CANCELLED,
    });
    await order.save();

    console.log(order)

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
