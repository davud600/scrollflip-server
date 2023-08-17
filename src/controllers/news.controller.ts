import { type NextFunction, type Request, type Response } from 'express';
import { Article } from '../models/article.model.js';
import NewsService from '../services/news.service.js';

export default class NewsController {
  public newsService = new NewsService();

  public getArticles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const findAllArticlesData = await this.newsService.getArticlesFromDb();

      res.status(200).json({ data: findAllArticlesData });
    } catch (error) {
      next(error);
    }
  };
}
