import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  likedArticles: {
    type: [
      {
        articleId: String,
      },
    ],
    default: [],
  },
  created: Number,
});

export const User = mongoose.model('NewsMediaUsers', UserSchema);
