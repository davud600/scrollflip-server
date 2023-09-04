import { ObjectId } from 'mongodb';
import { Article } from '../interfaces/articles.interface.js';
import { CustomArticle } from '../interfaces/custom-articles.interface.js';
import {
  LikedArticle,
  User,
  UserUpdateData,
} from '../interfaces/user.interface.js';
import { User as UserModel } from '../models/user.model.js';
import CustomNewsService from './custom-news.service.js';
import NewsService from './news.service.js';

export default class UserService {
  public async getUsersFromDb(
    limit: number = 0,
    page: number = 0,
    search_query: string = '',
    category: string = ''
  ): Promise<User[]> {
    let users: User[] = [];
    let filter = {};

    if (!!search_query) {
      filter = {
        ...filter,
        $or: [
          { username: { $regex: search_query, $options: 'i' } },
          { email: { $regex: search_query, $options: 'i' } },
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
        users = await UserModel.find();
      } else {
        const cursor = await UserModel.find(filter)
          .sort({ datefield: -1 })
          .limit(limit)
          .skip(limit * page);

        for await (const doc of cursor) {
          users.push(doc as unknown as User);
        }
      }
    } catch (error) {
      console.error(error);
    }

    return users;
  }

  public async postUser({ userData }: { userData: User }): Promise<void> {
    try {
      const userModel = new UserModel({
        ...userData,
        created: Date.now(),
      });

      await userModel.save();
    } catch (error) {
      console.error(error);
    }
  }

  public async putUser({
    userData,
    userId,
  }: {
    userData: UserUpdateData;
    userId: string;
  }): Promise<void> {
    try {
      await UserModel.updateOne(
        { _id: new ObjectId(userId) },
        {
          ...userData,
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  public async getUser({
    userId,
  }: {
    userId: string;
  }): Promise<User | undefined | null> {
    try {
      const user = await UserModel.findById(userId);

      return user;
    } catch (error) {
      console.error(error);
    }
  }

  public async getUserByEmail({
    email,
  }: {
    email: string;
  }): Promise<User | undefined | null> {
    try {
      const user = await UserModel.findOne({ email });

      return user;
    } catch (error) {
      console.error(error);
    }
  }

  public async getUsersLikedArticles({
    email,
  }: {
    email: string;
  }): Promise<Array<Article | CustomArticle> | undefined> {
    try {
      let likedArticles: Array<Article | CustomArticle> = [];
      const user = await UserModel.findOne({ email });
      const newsService = new NewsService();
      const customNewsService = new CustomNewsService();

      const articleIds = user?.likedArticles.map(article => article.articleId);

      if (!!!articleIds) return;

      for (let i = 0; i < articleIds?.length; i++) {
        // Fetch article from id
        if (!!!articleIds[i]) continue;

        let article: Article | null | undefined;
        let customArticle: CustomArticle | null | undefined;

        article = await newsService.getArticleById(
          articleIds[i] as unknown as string
        );

        // If none, found try custom article
        if (!!!article) {
          customArticle = await customNewsService.getArticleById(
            articleIds[i] as unknown as string
          );
        }

        // add to likedArticlesArray
        if (!!!article)
          likedArticles.push(customArticle as unknown as CustomArticle);
        else likedArticles.push(article as unknown as Article);
      }

      return likedArticles;
    } catch (error) {
      console.error(error);
    }
  }

  public async getUserByUsername({
    username,
  }: {
    username: string;
  }): Promise<User | undefined | null> {
    try {
      const user = await UserModel.findOne({ username });

      return user;
    } catch (error) {
      console.error(error);
    }
  }

  public async deleteUser({ userId }: { userId: string }): Promise<void> {
    try {
      const user = await UserModel.findById(userId);

      await user?.deleteOne();
    } catch (error) {
      console.error(error);
    }
  }

  public async updateLikedStatusOfArticleInUser({
    userId,
    likedArticle,
    articleId,
  }: {
    userId: string;
    likedArticle: boolean;
    articleId: string;
  }): Promise<void | string> {
    try {
      const user = await UserModel.findById(userId);

      if (!!!user) return 'User not found!';

      if (likedArticle) {
        await UserModel.updateOne(
          { _id: new ObjectId(userId) },
          {
            likedArticles: [
              ...user.likedArticles,
              {
                articleId,
              },
            ],
          }
        );
        return;
      }

      const updatedLikedArticles = user.likedArticles.filter(currArticle => {
        return currArticle.articleId !== articleId;
      });

      await UserModel.updateOne(
        { _id: new ObjectId(userId) },
        {
          likedArticles: [...updatedLikedArticles],
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
}
