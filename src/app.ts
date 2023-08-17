import express, { type Express } from 'express';
import { CORS_ORIGIN, PORT } from './env.js';
import { Route } from './interfaces/routes.interface.js';
import { AppConstructorParams } from './interfaces/app.interface.js';
import MongoDbClient from './db/mongodb.js';
import cron from 'node-cron';
import NewsService from './services/news.service.js';
import cors from 'cors';

export default class App {
  private app: Express;
  private port: number = PORT as unknown as number | 3000;

  private routes: Route[];

  private newsService: NewsService;

  public constructor({ routes }: AppConstructorParams) {
    this.app = express();
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: CORS_ORIGIN,
      })
    );
    this.routes = routes;
    this.newsService = new NewsService();
  }

  public async init() {
    this.app.listen(this.port, () => {
      console.log(`Listening on port: ${this.port}`);
    });

    this.initRoutes();
    this.connectToMondoDb();
    // this.startSavingArticlesCronJob();
    // this.startDeletingArticlesCronJob();
  }

  private initRoutes() {
    this.routes.forEach(route => {
      this.app.use('/api', route.router);
    });
  }

  private connectToMondoDb() {
    MongoDbClient.connect();
  }

  private startSavingArticlesCronJob() {
    cron.schedule('* * * * *', () => {
      console.log('running every minute');
      this.newsService.saveArticlesToDb();
    });
  }

  private startDeletingArticlesCronJob() {
    cron.schedule('* * * * *', () => {
      console.log('running every minute');
      this.newsService.deleteArticlesFromDb();
    });
  }
}
