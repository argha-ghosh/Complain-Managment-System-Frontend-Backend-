import * as dotenv from 'dotenv';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import session from 'express-session';

// Load environment variables first
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS — same origin for both parts
  app.enableCors({
    origin: 'http://localhost:5000',
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
  });

  // Static file serving for uploaded images (admin profile photos, NID images)
  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  // Session (used by admin part)
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'my-secret',
      resave: false,
      saveUninitialized: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
