import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Cross Origin Resource Sharing (CORS) is a security feature implemented by web browsers to restrict web pages from making requests to a different domain than the one that served the web page. Enabling CORS allows your NestJS application to accept requests from different origins, which is especially useful when you have a frontend application hosted on a different domain than your backend API.
  app.enableCors({
    origin: 'http://localhost:5000',
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();