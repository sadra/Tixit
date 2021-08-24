import { Publisher, Subjects, OrderCancelledEvent } from '@tixit/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
