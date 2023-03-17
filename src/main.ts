import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify/adapters';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { contentParser } from 'fastify-multer/lib';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const logger = new Logger('bootstrap');

  app.register(contentParser);

  await app.listen(process.env.PORT, process.env.HOST);
  logger.log(`servidor corriendo por el puerto ${process.env.PORT}`);
}
bootstrap();
