import { Router } from 'express';
import { type Route } from '../interfaces/routes.interface.js';
import AuthController from '../controllers/auth.controller.js';

export default class AuthRoute implements Route {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, this.authController.logIn);
    this.router.post(`${this.path}/signup`, this.authController.signUp);
  }
}
