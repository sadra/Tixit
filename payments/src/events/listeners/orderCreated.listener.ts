import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queueGroupName';
import { Listener, OrderCreatedEvent, Subjects } from '@tixit/common';
import { Order } from '../../models/order.model';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = await Order.build({
      id: data.id,
      userId: data.userId,
      price: data.ticket.price,
      status: data.status,
      version: data.version,
    });

    await order.save();

    msg.ack();
  }
}
