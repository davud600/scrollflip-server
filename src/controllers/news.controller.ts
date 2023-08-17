import { type NextFunction, type Request, type Response } from 'express';
import NewsService from '../services/news.service.js';

export default class NewsController {
  public newsService = new NewsService();

  public getArticles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let { limit, page }: any = req.query;

      if (typeof limit !== typeof 'str') {
        limit = 0;
      }
      if (typeof page !== typeof 'str') {
        page = 0;
      }

      const findAllArticlesData = await this.newsService.getArticlesFromDb(
        parseInt(limit as unknown as string),
        parseInt(page as unknown as string)
      );

      res.status(200).json({ data: findAllArticlesData });
    } catch (error) {
      next(error);
    }
  };
}
