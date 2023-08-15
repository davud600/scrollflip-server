import App from './app.js';
import NewsRoute from './routes/news.route.js';

const app = new App({
  routes: [new NewsRoute()],
});

app.init();
