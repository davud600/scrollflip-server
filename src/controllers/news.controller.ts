import { type NextFunction, type Request, type Response } from 'express';
import { Article } from '../interfaces/articles.interface.js';
import NewsService from '../services/news.service.js';

export default class NewsController {
  public newsService = new NewsService();

  public getArticles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // const findAllArticlesData: Article[] =
      await this.newsService.findAllArticles();

      res.status(200).json({ data: [], message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };
}
