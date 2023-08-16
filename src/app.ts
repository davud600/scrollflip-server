import express, { type Express } from 'express';
import { PORT } from './env.js';
import { Route } from './interfaces/routes.interface.js';
import { AppConstructorParams } from './interfaces/app.interface.js';
import MongoDbClient from './db/mongodb.js';

export default class App {
  private app: Express;
  private port: number = PORT as unknown as number | 3000;

  private routes: Route[];

  public constructor({ routes }: AppConstructorParams) {
    this.app = express();
    this.app.use(express.json());
    this.routes = routes;
  }

  public async init() {
    this.app.listen(this.port, () => {
      console.log(`Listening on port: ${this.port}`);
    });

    this.initRoutes();
    this.connectToMondoDb();
  }

  private initRoutes() {
    this.routes.forEach(route => {
      this.app.use('/api', route.router);
    });
  }

  private connectToMondoDb() {
    MongoDbClient.connect();
  }
}
