import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET || 'brainbari_super_secret_jwt_key_2026',
    expires_in: process.env.JWT_EXPIRES_IN || '7d',
  },
  stripe: {
    secret_key: process.env.STRIPE_SECRET_KEY || '',
  },
  cors: {
    client_url: process.env.CLIENT_URL || 'http://localhost:3000',
    admin_url: process.env.ADMIN_URL || 'http://localhost:3001',
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'lndolcud',
    api_key: process.env.CLOUDINARY_API_KEY || '591537466421493',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'e15qLNF3ToC54Td6kbtytjCJ_14',
    url: process.env.CLOUDINARY_URL || '',
  },
  google: {
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || 'bscl.com.bd@gmail.com',
    pass: process.env.SMTP_PASS || 'ucpzbdfpjqkqyulc',
  },
};

