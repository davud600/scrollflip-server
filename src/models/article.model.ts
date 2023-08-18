import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
  rssId: String,
  title: String,
  description: String,
  link: String,
  author: {
    type: String,
    required: false,
  },
  published: Number,
  created: Number,
  category: {
    type: String,
    required: false,
  },
  source: {
    type: String,
    required: false,
  },
});

export const Article = mongoose.model(
  'NewsMediaDb',
  ArticleSchema,
  'NewsMediaArticles'
);
