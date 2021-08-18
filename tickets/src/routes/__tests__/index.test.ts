import request from 'supertest';
import { app } from '../../app';

describe('Get All Tickets', () => {
  it('should returns a list of tickets', async () => {
    await createTicket('title 1', 10);
    await createTicket('title 2', 20);
    await createTicket('title 3', 30);

    const response = await request(app).get(`/api/tickets/`).send();

    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(3);
  });

  const createTicket = (title: string, price: number) => {
    return request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title,
        price,
      });
  };
});
