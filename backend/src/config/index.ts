import dotenv from 'dotenv';
import { SignOptions } from 'jsonwebtoken';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiration: '24h' as string,
  expPerLevel: 100, // EXP needed per level
  env: process.env.NODE_ENV || 'development'
};
