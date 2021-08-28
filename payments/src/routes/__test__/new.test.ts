import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/order.model';
import { stripe } from '../../stripe';

jest.mock('../../stripe');

describe('', () => {
  it('should returns 404 if the order not found', async () => {
    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({
        token: 'joiwefu',
        orderId: new mongoose.Types.ObjectId().toHexString(),
      })
      .expect(404);
  });

  it('should returns 401 when purchasing and order that doesnt belong to the user', async () => {
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      price: 20,
      status: OrderStatus.CREATED,
    });
    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({
        token: 'joiwefu',
        orderId: order.id,
      })
      .expect(401);
  });

  it('should returns 400 when purchasing a cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId: userId,
      version: 0,
      price: 20,
      status: OrderStatus.CANCELLED,
    });
    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin(userId))
      .send({
        token: 'joiwefu',
        orderId: order.id,
      })
      .expect(400);
  });

  it('returns a 201 with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId: userId,
      version: 0,
      price: 20,
      status: OrderStatus.CREATED,
    });
    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin(userId))
      .send({
        token: 'tok_visa',
        orderId: order.id,
      })
      .expect(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(20 * 100);
    expect(chargeOptions.currency).toEqual('usd');
  });
});
