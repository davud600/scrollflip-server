import { Router } from 'express';
import { type Route } from '../interfaces/routes.interface.js';
import UsersController from '../controllers/users.controller.js';

export default class UsersRoute implements Route {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.usersController.getUser);
    this.router.get(
      `${this.path}/liked-articles`,
      this.usersController.getUsersLikedArticles
    );
  }
}
