import { Publisher, Subjects, PaymentCreatedEvent } from '@tixit/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
