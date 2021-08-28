import { OrderCancelledEvent, OrderStatus } from '@tixit/common';
import { OrderCancelledListener } from '../orderCancelled.listener';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats.wrapper';
import mongoose from 'mongoose';
import { Order } from '../../../models/order.model';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.CREATED,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    version: 0,
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, data, msg };
};

describe('Order Cancelled Listener', () => {
  it('should updates status of the order', async () => {
    const { listener, order, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.CANCELLED);
  });

  it('should ack the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
