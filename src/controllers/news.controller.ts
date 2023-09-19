import { type NextFunction, type Request, type Response } from 'express';
import CustomNewsService from '../services/custom-news.service.js';
import NewsService from '../services/news.service.js';
import UserService from '../services/user.service.js';
import { convertCustomArticleToStandard } from '../utils/custom-article.js';

export default class NewsController {
  private newsService = new NewsService();
  private customNewsService = new CustomNewsService();
  private usersService = new UserService();

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

      const findAllArticlesData = await this.newsService.getArticlesFromDb(
        parseInt(limit as unknown as string),
        parseInt(page as unknown as string),
        search_query,
        category
      );
      const findCustomArticleData =
        await this.customNewsService.getRandomArticle();

      if (findCustomArticleData[0]) {
        const randomIndex = Math.floor(
          Math.random() * (findAllArticlesData.length - 1)
        );

        findAllArticlesData.splice(
          randomIndex,
          0,
          convertCustomArticleToStandard(findCustomArticleData[0])
        );
      }

      res.status(200).json({ data: findAllArticlesData });
    } catch (error) {
      next(error);
    }
  };

  public updateLikedArticle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { userId, likedArticle, articleId }: any = req.body;

    try {
      const message = await this.usersService.updateLikedStatusOfArticleInUser({
        userId,
        likedArticle,
        articleId,
      });

      if (message) {
        res.status(400).json({ message });
        return;
      }

      res.status(200).json({ message: "Article added to user's likes!" });
    } catch (error) {
      next(error);
    }
  };
}
