import { MONGODB_URI } from '../env.js';
import mongoose from 'mongoose';

export default abstract class MongoDbClient {
  public static async connect() {
    try {
      await mongoose.connect(MONGODB_URI as unknown as string);
    } catch (error) {
      console.error(error);
    }
  }
}
