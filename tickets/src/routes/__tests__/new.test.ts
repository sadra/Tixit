import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats.wrapper';

describe('New Ticket', () => {
  it('should has a route handler to /api/ticket for post requests', async () => {
    const response = await request(app).post('/api/tickets').send({});

    expect(response.status).not.toEqual(404);
  });

  it('should be only accessed if the user is signed in', async () => {
    await request(app).post('/api/tickets').send({}).expect(401);
  });

  it('should returns status not 401 if user is signed in', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it('should returns an error if an invalid title is provided', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: '',
        price: 10,
      })
      .expect(400);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        price: 10,
      })
      .expect(400);
  });

  it('should returns and error if and invalid price is provided', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: 'title oh yeah',
        price: -10,
      })
      .expect(400);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: 'title oh yeah',
      })
      .expect(400);
  });

  it('should creates a ticket with valid input', async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: 'title oh yeah',
        price: 20,
      })
      .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].title).toEqual('title oh yeah');
    expect(tickets[0].price).toEqual(20);
  });

  it('should should publishes events', async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: 'title oh yeah',
        price: 20,
      })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
