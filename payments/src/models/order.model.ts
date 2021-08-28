import { OrderStatus, versionOCCPlugin } from '@tixit/common';
import { Document, Model, Schema, model } from 'mongoose';

export { OrderStatus };

interface OrderAttrs {
  id: string;
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
}

interface OrderDoc extends Document {
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
}

interface OrderModel extends Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new Schema<OrderDoc>(
  {
    userId: {
      type: String,
      requires: true,
    },
    status: {
      type: String,
      requires: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.CREATED,
    },
    price: {
      type: Number,
      requires: true,
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

orderSchema.set('versionKey', 'version');
orderSchema.plugin(versionOCCPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
};

const Order = model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
