import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
    rssId: String,
    title: String,
    description: String,
    link: String,
    author: String,
    published: Number,
    created: Number,
    category: String,
});

export const Article = mongoose.model('NewsMediaArticles', ArticleSchema, 'NewsMediaDb');
