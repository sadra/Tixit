import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/users/signout', (req: Request, res: Response) => {
  const { email, password } = req.body;

  res.send({});
});

export { router as SignOutRouter };
