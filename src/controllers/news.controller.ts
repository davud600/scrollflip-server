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
      let { limit, page, search_query }: any = req.query;

      if (typeof limit !== typeof 'str') {
        limit = 0;
      }
      if (typeof page !== typeof 'str') {
        page = 0;
      }
      if (typeof search_query !== typeof 'str') {
        search_query = '';
      }

      const findAllArticlesData = await this.newsService.getArticlesFromDb(
        parseInt(limit as unknown as string),
        parseInt(page as unknown as string),
        search_query
      );

      res.status(200).json({ data: findAllArticlesData });
    } catch (error) {
      next(error);
    }
  };
}
