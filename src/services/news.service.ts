import pkg from 'rss-to-json';
const { parse } = pkg;

export default class NewsService {
  private rssUrl: string = 'https://www.buzzfeed.com/';

  constructor() {}

  public async findAllArticles() {
    try {
      const res = await parse(`${this.rssUrl}/index.xml`);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  }
}
