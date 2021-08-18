import { UserMiddleware, RequireAuthMiddleware } from '@tixit/common';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get(
  '/api/users/current-user',
  UserMiddleware,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.user || null });
  }
);

export { router as CurrentUserRouter };
