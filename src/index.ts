import App from './app.js';
import CustomNewsRoute from './routes/custom-news.route.js';
import NewsRoute from './routes/news.route.js';

const app = new App({
  routes: [new NewsRoute(), new CustomNewsRoute()],
});

(async function () {
  await app.init();
})();
