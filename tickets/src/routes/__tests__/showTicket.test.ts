import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

describe('Show Ticket', () => {
  it('should returns 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app).get(`/api/tickets/${id}`).send().expect(404);
  });

  it('should returns ticket if found', async () => {
    const title = 'title oh yeah';
    const price = 20;

    const ticket = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title,
        price,
      });

    const response = await request(app)
      .get(`/api/tickets/${ticket.body.id}`)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.title).toEqual(title);
    expect(response.body.price).toEqual(price);
  });
});
