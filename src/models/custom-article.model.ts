import mongoose from 'mongoose';

const CustomArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnailLink: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: false,
  },
  created: Number,
  category: {
    type: String,
    required: false,
  },
});

export const CustomArticle = mongoose.model(
  'NewsMediaCustomArticles',
  CustomArticleSchema
);
