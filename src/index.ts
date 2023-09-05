import App from './app.js';
import AuthRoute from './routes/auth.route.js';
import CustomNewsRoute from './routes/custom-news.route.js';
import NewsRoute from './routes/news.route.js';
import UsersRoute from './routes/users.route.js';

const app = new App({
  routes: [
    new NewsRoute(),
    new CustomNewsRoute(),
    new AuthRoute(),
    new UsersRoute(),
  ],
});

(async function () {
  await app.init();
})();
