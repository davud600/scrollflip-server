import { ObjectId } from 'mongodb';
import {
  CustomArticle,
  CustomArticleUpdateData,
} from '../interfaces/custom-articles.interface.js';
import { CustomArticle as CustomArticleModel } from '../models/custom-article.model.js';

export default class CustomNewsService {
  public async getRandomArticle(): Promise<CustomArticle[]> {
    let articles: CustomArticle[] = [];
    let filter = {};

    try {
      const cursor = await CustomArticleModel.aggregate([
        { $match: filter },
        { $sample: { size: 1 } },
      ]);

      for await (const doc of cursor) {
        articles.push(doc as unknown as CustomArticle);
      }
    } catch (error) {
      console.error(error);
    }

    return articles;
  }

  public async getArticlesFromDb(
    limit: number = 0,
    page: number = 0,
    search_query: string = '',
    category: string = ''
  ): Promise<CustomArticle[]> {
    let articles: CustomArticle[] = [];
    let filter = {};

    if (!!search_query) {
      filter = {
        ...filter,
        $or: [
          { title: { $regex: search_query, $options: 'i' } },
          { description: { $regex: search_query, $options: 'i' } },
        ],
      };
    }

    if (!!category) {
      filter = {
        ...filter,
        category,
      };
    }

    try {
      if (limit === 0) {
        articles = await CustomArticleModel.find();
      } else {
        const cursor = await CustomArticleModel.find(filter)
          .sort({ datefield: -1 })
          .limit(limit)
          .skip(limit * page);

        for await (const doc of cursor) {
          articles.push(doc as unknown as CustomArticle);
        }
      }
    } catch (error) {
      console.error(error);
    }

    return articles;
  }

  public async getArticleById(
    id: string
  ): Promise<CustomArticle | undefined | null> {
    try {
      const article = await CustomArticleModel.findById(id);
      return article as unknown as CustomArticle;
    } catch (error) {
      console.error(error);
    }
  }

  public async postArticle({
    articleData,
  }: {
    articleData: CustomArticle;
  }): Promise<void> {
    try {
      const customArticleModel = new CustomArticleModel({
        ...articleData,
        created: Date.now(),
      });

      await customArticleModel.save();
    } catch (error) {
      console.error(error);
    }
  }

  public async putArticle({
    articleData,
    articleId,
  }: {
    articleData: CustomArticleUpdateData;
    articleId: string;
  }): Promise<void> {
    try {
      await CustomArticleModel.updateOne(
        { _id: new ObjectId(articleId) },
        {
          ...articleData,
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  public async getArticle({
    articleId,
  }: {
    articleId: string;
  }): Promise<CustomArticle | undefined | null> {
    try {
      const article = await CustomArticleModel.findById(articleId);

      return article;
    } catch (error) {
      console.error(error);
    }
  }

  public async deleteArticle({
    articleId,
  }: {
    articleId: string;
  }): Promise<void> {
    try {
      const article = await CustomArticleModel.findById(articleId);

      await article?.deleteOne();
    } catch (error) {
      console.error(error);
    }
  }
}
