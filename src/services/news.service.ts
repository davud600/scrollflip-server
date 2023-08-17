import pkg from 'rss-to-json';
import { Article } from '../interfaces/articles.interface.js';
import { RssSource } from '../interfaces/rss.interface.js';
import { Article as ArticleModel } from '../models/article.model.js';
const { parse } = pkg;

export default class NewsService {
  private BuzFeedRss: RssSource = {
    url: 'https://www.buzzfeed.com/',
  };

  private ArticleSources: RssSource[] = [this.BuzFeedRss];

  constructor() {}

  public async getArticlesFromDb(
    limit: number = 0,
    page: number = 0,
    search_query: string = ''
  ): Promise<Article[]> {
    let articles: Article[] = [];
    const filter = !!search_query
      ? {
          $or: [
            { title: { $regex: search_query, $options: 'i' } },
            { description: { $regex: search_query, $options: 'i' } },
          ],
        }
      : {};

    try {
      if (limit === 0) {
        articles = await ArticleModel.find();
      } else {
        const cursor = await ArticleModel.find(filter)
          .sort({ datefield: -1 })
          .limit(limit)
          .skip(limit * page);

        for await (const doc of cursor) {
          articles.push(doc as unknown as Article);
        }
      }
    } catch (error) {
      console.error(error);
    }

    return articles;
  }

  public async deleteArticlesFromDb(): Promise<void> {
    let articles: Article[] = [];

    try {
      articles = await ArticleModel.find();

      const savePromises = articles.map(article => {
        return ArticleModel.deleteOne({
          rssId: article.rssId,
        });
      });

      await Promise.all(savePromises);
    } catch (error) {
      console.error(error);
    }
  }

  public async saveArticlesToDb(): Promise<void> {
    try {
      const findAllArticlesData = await this.findAllArticles();

      const savePromises = findAllArticlesData.map(article => {
        const articleModel = new ArticleModel({
          ...article,
        });

        return articleModel.save();
      });

      await Promise.all(savePromises);
    } catch (error) {
      console.error(error);
    }
  }

  public async findArticlesBySource(
    Source: RssSource,
    category: string = ''
  ): Promise<Article[]> {
    let res: {
      title: any;
      description: any;
      link: any;
      image: any;
      category: any;
      items: any[];
    };
    const articles: Article[] = [];

    try {
      res = await parse(`${Source.url}/${category}.xml`);

      // format articles to be type of Article
      res.items.forEach(rssArticle => {
        articles.push({
          rssId: rssArticle.id,
          title: rssArticle.title,
          description: rssArticle.description,
          link: rssArticle.link,
          author: rssArticle.author,
          published: rssArticle.published,
          created: rssArticle.created,
          category: rssArticle.category,
        });
      });
    } catch (error) {
      console.error(error);
    }

    return articles;
  }

  public async findAllArticles(category: string = ''): Promise<Article[]> {
    const allArticles: Article[] = [];

    try {
      const savePromises = this.ArticleSources.map(articleSource => {
        return new Promise<void>(resolve => {
          this.findArticlesBySource(articleSource).then(articlesOfSource => {
            articlesOfSource.forEach(articleOfSource => {
              allArticles.push(articleOfSource);
            });

            resolve();
          });
        });
      });

      await Promise.all(savePromises);
    } catch (error) {
      console.error(error);
    }

    return allArticles;
  }
}
