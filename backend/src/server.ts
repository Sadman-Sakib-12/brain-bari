import { Server } from 'http';
import app from './app';
import { config } from './config';
import prisma from './config/prisma';

let server: Server;

async function bootstrap() {
  try {
    // Verify database connection
    try {
      await prisma.$connect();
      console.log('✅ [NeonDB / Prisma] Connected to PostgreSQL Database successfully.');
    } catch (dbError) {
      console.warn('⚠️ [Prisma Warning] Could not connect to remote PostgreSQL database. Ensure valid DATABASE_URL is configured in .env. Server will start in standalone mode.');
    }

    server = app.listen(config.port, () => {
      console.log(`🚀 [Server] Botbari backend running on port http://localhost:${config.port}`);
      console.log(`📡 [API Base] http://localhost:${config.port}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful exit handlers
const exitHandler = () => {
  if (server) {
    server.close(async () => {
      console.log('🛑 Server closed gracefully.');
      await prisma.$disconnect();
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception detected:', error);
  exitHandler();
});

process.on('unhandledRejection', (error) => {
  console.error('💥 Unhandled Rejection detected:', error);
  exitHandler();
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received.');
  exitHandler();
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received.');
  exitHandler();
});

bootstrap();
