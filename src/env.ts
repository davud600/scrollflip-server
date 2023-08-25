import dotenv from 'dotenv';

dotenv.config();

export const { PORT, MONGODB_URI, CORS_ORIGIN, JWT_SECRET } = process.env;
