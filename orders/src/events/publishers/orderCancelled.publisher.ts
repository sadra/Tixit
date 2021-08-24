import { Publisher, Subjects, OrderCancelledEvent } from '@tixit/common';

export class ORderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
