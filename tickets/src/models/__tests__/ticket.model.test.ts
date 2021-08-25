import { Ticket } from '../ticket';

describe('Concurrent Ticket Save Versionin', () => {
  it('should implements optimistic concurrency control', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 5,
      userId: '123',
    });

    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    await firstInstance!.save();

    try {
      await secondInstance!.save();
    } catch (error) {
      return;
    }

    throw new Error('There must be failed. But reached to solve!');
  });

  it('should incerement version on each save', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 5,
      userId: '123',
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);
  });
});
