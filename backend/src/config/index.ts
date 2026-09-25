import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET || 'botbari_super_secret_jwt_key_2026',
    expires_in: process.env.JWT_EXPIRES_IN || '7d',
  },
  stripe: {
    secret_key: process.env.STRIPE_SECRET_KEY || '',
  },
  cors: {
    client_url: process.env.CLIENT_URL || 'http://localhost:5173',
    admin_url: process.env.ADMIN_URL || 'http://localhost:3000',
  },
};
