export interface LikedArticle {
  _id: string;
  articleId: string;
}

export interface User {
  _id?: any;
  username: string;
  email: string;
  // likedArticles?: LikedArticle[];
  password: string;
  created?: Number;
}

export interface UserUpdateData {
  username?: string;
  email?: string;
  password?: string;
  created?: Number;
}
