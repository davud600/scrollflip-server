import { type NextFunction, type Request, type Response } from 'express';
import { User } from '../interfaces/user.interface.js';
import AuthService from '../services/auth.service.js';
import { validateEmail } from '../utils/index.js';

export default class AuthController {
  public authService = new AuthService();

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { email, password }: any = req.body;

      if (typeof email !== typeof 'str') {
        email = '';
      }
      if (typeof password !== typeof 'str') {
        password = '';
      }

      if (!!!email || !validateEmail(email)) {
        res.status(400).json({
          message: 'Invalid email provided!',
        });
        return;
      }

      if (!!!password) {
        res.status(400).json({
          message: 'Invalid password provided!',
        });
        return;
      }

      const loginRes = await this.authService.logIn({
        email,
        password,
      });

      if (typeof loginRes === typeof 'str') {
        res.status(400).json({
          message: loginRes,
        });
        return;
      }

      const { userData, token } = loginRes as unknown as {
        userData: User;
        token: string;
      };

      res.status(200).json({
        data: {
          userData,
          token,
        },
        message: 'Log in attempt was successful!',
      });
    } catch (error) {
      next(error);
    }
  };

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { username, password, confirmPassword, email }: any = req.body;

      if (typeof username !== typeof 'str') {
        username = '';
      }
      if (typeof password !== typeof 'str') {
        password = '';
      }
      if (typeof confirmPassword !== typeof 'str') {
        confirmPassword = '';
      }
      if (typeof email !== typeof 'str') {
        email = '';
      }

      if (!!!username) {
        res.status(400).json({
          message: 'Invalid username provided!',
        });
        return;
      }

      if (!!!password) {
        res.status(400).json({
          message: 'Invalid password provided!',
        });
        return;
      }

      if (!!!confirmPassword || confirmPassword !== password) {
        res.status(400).json({
          message: 'Passwords do not match!',
        });
        return;
      }

      if (!!!email || !validateEmail(email)) {
        res.status(400).json({
          message: 'Invalid email provided!',
        });
        return;
      }

      const msg = await this.authService.signUp({
        username,
        email,
        password,
      });

      if (!!msg) {
        res.status(400).json({
          message: 'Account with given email already exists!',
        });
      }

      res.status(200).json({ message: 'Account created successfully!' });
    } catch (error) {
      next(error);
    }
  };
}
