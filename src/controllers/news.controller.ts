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
      const findAllArticlesData = await this.newsService.findAllArticles();

      const savePromises = findAllArticlesData.map(article => {
        const articleModel = new Article({
          ...article
        })

        return articleModel.save()
      });

      await Promise.all(savePromises);

      res.status(200).json({ message: 'Saved Articles to database' });
    } catch (error) {
      next(error);
    }
  };
}
