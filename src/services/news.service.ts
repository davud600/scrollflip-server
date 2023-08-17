import pkg from 'rss-to-json';
import { Article } from '../interfaces/articles.interface.js';
import { RssSource } from '../interfaces/rss.interface.js';
import { Article as ArticleModel } from '../models/article.model.js';
const { parse } = pkg;

export default class NewsService {
  private BuzFeedRss: RssSource = {
    url: 'https://www.buzzfeed.com/',
  };

  private ArticleSources: RssSource[] = [this.BuzFeedRss]

  constructor() {}

  public async getArticlesFromDb(): Promise<Article[]> {
    let articles: Article[] = []
    
    try {
      articles = await ArticleModel.find();
    } catch (error) {
      console.log(error)
    }

    return articles
  }

  public async saveArticlesToDb(): Promise<void> {
    try {
      const findAllArticlesData = await this.findAllArticles();

      const savePromises = findAllArticlesData.map(article => {
        const articleModel = new ArticleModel({
          ...article
        })

        return articleModel.save()
      });

      await Promise.all(savePromises);
    } catch (error) {
      console.error(error)
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
    const articles: Article[] = []

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
      console.error(error)
    }
    
    return articles;
  }

  public async findAllArticles(category: string = ''): Promise<Article[]> {
    const allArticles: Article[] = []
    
    try {
      const savePromises = this.ArticleSources.map(articleSource => {
        return new Promise<void>((resolve) => {
          this.findArticlesBySource(articleSource).then(articlesOfSource => {
            articlesOfSource.forEach(articleOfSource => {
              allArticles.push(articleOfSource);
            })

            resolve();
          })
        })
      })

      await Promise.all(savePromises);

      console.log({allArticles})
    } catch (error) {
      console.error(error)
    }

    return allArticles
  }
}
