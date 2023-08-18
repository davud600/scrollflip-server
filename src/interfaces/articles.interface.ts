export interface Article {
  rssId: string;
  title: string;
  description: string;
  link: string;
  author: string;
  published: number;
  created: number;
  category: string;
  source?: string;
}
