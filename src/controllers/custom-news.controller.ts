import { type NextFunction, type Request, type Response } from 'express';
import CustomNewsService from '../services/custom-news.service.js';

export default class CustomNewsController {
  public customNewsService = new CustomNewsService();

  public getRandomArticle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const findAllArticlesData =
        await this.customNewsService.getRandomArticle();

      res.status(200).json({ data: findAllArticlesData });
    } catch (error) {
      next(error);
    }
  };

  public getArticles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let { limit, page, search_query, category }: any = req.query;

      if (typeof limit !== typeof 'str') {
        limit = 0;
      }
      if (typeof page !== typeof 'str') {
        page = 0;
      }
      if (typeof search_query !== typeof 'str') {
        search_query = '';
      }
      if (typeof category !== typeof 'str') {
        category = '';
      }

      const findAllArticlesData =
        await this.customNewsService.getArticlesFromDb(
          parseInt(limit as unknown as string),
          parseInt(page as unknown as string),
          search_query,
          category
        );

      res.status(200).json({ data: findAllArticlesData });
    } catch (error) {
      next(error);
    }
  };

  public postArticle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { articleData } = req.body;

    try {
      await this.customNewsService.postArticle({ articleData });

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };

  public putArticle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { articleData } = req.body;
    const { id } = req.params;

    try {
      await this.customNewsService.putArticle({ articleData, articleId: id });

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };

  public getArticle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;

    try {
      const article = await this.customNewsService.getArticle({
        articleId: id,
      });

      if (!!!article) {
        res.sendStatus(400);
        return;
      }

      res.status(200).json({ data: article });
    } catch (error) {
      next(error);
    }
  };
  public deleteArticle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;

    try {
      await this.customNewsService.deleteArticle({
        articleId: id,
      });

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
}
