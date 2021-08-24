import express, { Request, Response } from "express";
import { RequireAuthMiddleware } from "@tixit/common";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders",
  RequireAuthMiddleware,
  async (req: Request, res: Response) => {
    const orders = await Order.find({
      userId: req.user!.id,
    }).populate("ticket");

    res.send(orders);
  }
);

export { router as indexOrdersRouter };
