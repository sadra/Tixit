import request from 'supertest'
import {app} from '../../app'
import {Ticket} from '../../models/ticket'
import {OrderStatus} from '../../models/order'

const buildTicket= async () => {
    const ticket = Ticket.build({
        title: 'Concert',
        price: 20
    })
    await ticket.save()
  
    return ticket
}

describe('Delete/Cancel an Order', () => {
  it('should delete/cancel the order', async () => {
    const ticket = await buildTicket();

    const user = global.signin();

    const {body:order} = await request(app)
        .post("/api/orders")
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    const fetchedOrder = await Order.findById(order.id)
    
    expect(fetchedOrder!.status).toEqual(OrderStatus.CANCELLED);
  });

  it.todo('emitt an event on cancel order')
});