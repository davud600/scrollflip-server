import { Router } from 'express';
import { type Route } from '../interfaces/routes.interface.js';
import CustomNewsController from '../controllers/custom-news.controller.js';

export default class CustomNewsRoute implements Route {
  public path = '/custom-news';
  public router = Router();
  public customNewsController = new CustomNewsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.customNewsController.getArticles);
    this.router.post(`${this.path}`, this.customNewsController.postArticle);
    this.router.get(`${this.path}/:id`, this.customNewsController.getArticle);
    this.router.put(`${this.path}/:id`, this.customNewsController.putArticle);
    this.router.delete(
      `${this.path}/:id`,
      this.customNewsController.deleteArticle
    );
  }
}
