import express, { Request, Response } from 'express';

const router = express.Router();

router.delete('/api/orders/:id', async (req: Request, res: Response) => {
  res.status(200).send();
});

export { router as deleteOrderRouter };
