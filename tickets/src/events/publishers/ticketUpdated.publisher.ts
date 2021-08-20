import { Publisher, Subjects, TicketUpdatedEvent } from '@tixit/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
