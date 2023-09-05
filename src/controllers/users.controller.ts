import { type NextFunction, type Request, type Response } from 'express';
import UserService from '../services/user.service.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../env.js';

export default class UsersController {
  private usersService = new UserService();

  public getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { email }: any = req.query;
      const { authorization: token }: any = req.headers;

      if (!!!token) {
        return res.status(401).json('Unauthorized user');
      }

      try {
        jwt.verify(
          token.replace('Bearer ', ''),
          JWT_SECRET as unknown as string
        );
      } catch (e) {
        res.status(400).json('Token not valid');
      }

      if (typeof email !== typeof 'str') {
        email = '';
      }

      const findUserData = await this.usersService.getUserByEmail({ email });

      if (!!!findUserData) {
        return res
          .status(400)
          .json({ message: 'User with the given email was not found!' });
      }

      res.status(200).json({ data: findUserData });
    } catch (error) {
      next(error);
    }
  };

  public getUsersLikedArticles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let { email }: any = req.query;
      const { authorization: token }: any = req.headers;

      if (!!!token) {
        return res.status(401).json('Unauthorized user');
      }

      try {
        jwt.verify(
          token.replace('Bearer ', ''),
          JWT_SECRET as unknown as string
        );
      } catch (e) {
        res.status(400).json('Token not valid');
      }

      if (typeof email !== typeof 'str') {
        email = '';
      }

      const findArticlesData = await this.usersService.getUsersLikedArticles({
        email,
      });

      if (!!!findArticlesData) {
        return res
          .status(400)
          .json({ message: "Could not find this user's liked articles!" });
      }

      res.status(200).json({ data: findArticlesData });
    } catch (error) {
      next(error);
    }
  };
}
