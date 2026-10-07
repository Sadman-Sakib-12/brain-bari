import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes';
import globalErrorHandler from './middlewares/errorHandler';
import { config } from './config';

const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: [
      config.cors.client_url,
      config.cors.admin_url,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5174',
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root Health Check Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '🤖 brain-bari Enterprise AI Backend Server is live and healthy!',
    timestamp: new Date().toISOString(),
    environment: config.env,
    database: 'NeonDB PostgreSQL (Prisma)',
  });
});

// Central API Routes
app.use('/api', routes);

// 404 Not Found Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `API endpoint '${req.originalUrl}' not found on this server.`,
  });
});

// Centralized Global Error Handler
app.use(globalErrorHandler);

export default app;
