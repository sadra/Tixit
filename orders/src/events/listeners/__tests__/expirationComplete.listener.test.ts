import { natsWrapper } from './../../../nats.wrapper';
import { ExpirationCompleteListener } from './../expirationComplete.listener';
import { Message } from 'node-nats-streaming';
import { ExpirationCompleteEvent, OrderStatus } from '@tixit/common';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
  });
  await ticket.save();

  const order = Order.build({
    userId: "lkfjwefk",
    status: OrderStatus.CREATED,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, order, msg };
};

describe('Expiration Complete Listener', () => {
  it('should update the order status to cancelled', async () => {
    const { listener, data, order, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    console.log(order.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.CANCELLED);
  });

  it('should emit OrderCancelled event', async () => {
    const { listener, data, order, msg } = await setup();

    await listener.onMessage(data, msg);

    const eventData = JSON.parse(
      (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(order.id).toEqual(eventData.id);
  });

  it('should acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
