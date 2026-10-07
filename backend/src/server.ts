import { Server } from 'http';
import app from './app';
import { config } from './config';
import prisma from './config/prisma';

let server: Server;

async function bootstrap() {
  try {
    server = app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
    });
  } catch (error) {
    process.exit(1);
  }
}

const exitHandler = () => {
  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('uncaughtException', exitHandler);
process.on('unhandledRejection', exitHandler);
process.on('SIGTERM', exitHandler);
process.on('SIGINT', exitHandler);

bootstrap();
