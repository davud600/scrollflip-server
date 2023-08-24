export interface CustomArticle {
  title: string;
  description: string;
  content: string;
  author?: string;
  created?: number;
  category?: string;
}

export interface CustomArticleUpdateData {
  title?: string;
  description?: string;
  content?: string;
  author?: string;
  created?: number;
  category?: string;
}
