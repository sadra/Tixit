import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queueGroupName';
import { Listener, OrderCreatedEvent, Subjects } from '@tixit/common';
import { expirationQueue } from '../../queues/expiration.queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    await expirationQueue.add({
      orderId: data.id,
    });

    msg.ack();
  }
}
