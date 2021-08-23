import request from 'supertest'
import {app} from '../../app'
import {Ticket} from '../../models/ticket'

const buildTicket= async () => {
    const ticket = Ticket.build({
        title: 'Concert',
        price: 20
    })
    await ticket.save()
  
    return ticket
}

describe('Get an Order', () => {
  it('should fetch the order', async () => {
    const ticket = await buildTicket();

    const user = global.signin();

    const {body:order} = await request(app)
        .post("/api/orders")
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    const {body: fetchedOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);
    
    expect(fetchedOrder.id).toEqual(order.id);
  });

  it('should returns and error if one user tries to fetch another users order', async () => {
    const ticket = await buildTicket();

    const user = global.signin();

    const {body:order} = await request(app)
        .post("/api/orders")
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    const anotherUser = global.signin();

    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', anotherUser)
        .send()
        .expect(401);
  });
});