import { Publisher, Subjects, OrderCreatedEvent } from '@tixit/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
