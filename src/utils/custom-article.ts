import { Article } from '../interfaces/articles.interface.js';
import { CustomArticle } from '../interfaces/custom-articles.interface.js';

interface CustomArticleDocument extends CustomArticle {
  toObject?: any;
}

export function convertCustomArticleToStandard(
  customArticle: CustomArticleDocument
): Article {
  const article = { ...customArticle.toObject() };

  return {
    ...article,
    rssId: 'custom-article',
    link: customArticle.thumbnailLink,
    published: 0,
    source: customArticle.author,
  };
}
