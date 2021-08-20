import { Publisher, Subjects, TicketCreatedEvent } from '@tixit/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
