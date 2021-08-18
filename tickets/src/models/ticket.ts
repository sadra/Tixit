import mongoose, { Document, Model, Schema, model } from 'mongoose';

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends Document {
  title: string;
  price: number;
  userId: string;
}

interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new Schema<TicketDoc>(
  {
    title: {
      type: String,
      requires: true,
    },
    price: {
      type: Number,
      requires: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
