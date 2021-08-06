import { Password } from './../common/password';
import { ValidationRequestMiddleware } from './../middlewares/validateRequest.middleware';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user.model';
import { BadRequestError } from '../errors/badRequest.error';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid!'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  ValidationRequestMiddleware,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError('Invalid credentials.');
    }

    const passwordMatched = await Password.compare(user.password, password);

    if (!passwordMatched) {
      throw new BadRequestError('Invalid credentials.');
    }

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(user);
  }
);

export { router as SignInRouter };
