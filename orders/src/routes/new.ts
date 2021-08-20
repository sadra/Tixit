import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/orders', async (req: Request, res: Response) => {
  res.status(200).send();
});

export { router as createNewOrderRouter };
