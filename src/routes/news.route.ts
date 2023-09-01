import { Router } from 'express';
import { type Route } from '../interfaces/routes.interface.js';
import NewsController from '../controllers/news.controller.js';

export default class NewsRoute implements Route {
  public path = '/news';
  public router = Router();
  public newsController = new NewsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.newsController.getArticles);
    this.router.post(
      `${this.path}/like`,
      this.newsController.updateLikedArticle
    );
  }
}
