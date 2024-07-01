import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'top-secret-key',
      resave: false,
      saveUninitialized: false
    })
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // NOTE whitelist - убирает поля которые не описаны в DTO

  await app.listen(3000);
}

bootstrap();
