import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queueGroupName';
import { Listener, OrderCreatedEvent, Subjects } from '@tixit/common';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    msg.ack();
  }
}
