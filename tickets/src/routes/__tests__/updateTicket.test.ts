import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

describe('Update Ticket', () => {
  it('should returns 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', global.signin())
      .send({
        title: 'title 1',
        price: 10,
      })
      .expect(404);
  });

  it('should returns 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`/api/tickets/${id}`)
      .send({
        title: 'title 1',
        price: 10,
      })
      .expect(401);
  });

  it('should returns 401 if the user does not own the ticket', async () => {
    const ticket = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: 'dlkjsdlkjs',
        price: 20,
      });

    await request(app)
      .put(`/api/tickets/${ticket.body.id}`)
      .set('Cookie', global.signin())
      .send({
        title: 'title 1',
        price: 10,
      })
      .expect(401);
  });

  it('should returns 400 if the user provided an invalid inputs', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', global.signin())
      .send({
        title: '',
        price: 10,
      })
      .expect(400);

    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', global.signin())
      .send({
        title: 'efwef',
        price: -10,
      })
      .expect(400);
  });

  it('should update the tickets if provided valid inputs', async () => {
    const userSession = global.signin();

    const ticket = await request(app)
      .post('/api/tickets')
      .set('Cookie', userSession)
      .send({
        title: 'dlkjsdlkjs',
        price: 20,
      });

    const response = await request(app)
      .put(`/api/tickets/${ticket.body.id}`)
      .set('Cookie', userSession)
      .send({
        title: 'title 1',
        price: 10,
      });

    expect(response.status).toEqual(200);
    expect(response.body.title).toEqual('title 1');
    expect(response.body.price).toEqual(10);
  });
});
