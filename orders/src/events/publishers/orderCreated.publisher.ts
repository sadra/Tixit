import { Publisher, Subjects, OrderCreatedEvent } from '@tixit/common';

export class ORderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
