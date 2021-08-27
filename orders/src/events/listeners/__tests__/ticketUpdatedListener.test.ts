import { TicketUpdatedListener } from './../ticketUpdated.listener';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@tixit/common';
import { natsWrapper } from '../../../nats.wrapper';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
  });
  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'new concert',
    price: 99,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, msg };
};

describe('Ticket Updated Listener', () => {
  it('should find, updates and saves a ticket ', async () => {
    const { listener, data, ticket, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedticket = await Ticket.findById(ticket.id);

    expect(updatedticket!.title).toEqual(data.title);
    expect(updatedticket!.price).toEqual(data.price);
    expect(updatedticket!.version).toEqual(data.version);
  });

  it('should acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });

  it('should does not call ack if the event has a skipped version number', async () => {
    const { msg, data, listener } = await setup();

    data.version = 10;

    try {
      await listener.onMessage(data, msg);
    } catch (err) {}

    expect(msg.ack).not.toHaveBeenCalled();
  });
});
