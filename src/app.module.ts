import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { APP_PIPE } from '@nestjs/core';
import * as session from 'express-session';
import * as process from 'node:process';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.NODE_ENV === 'test' ? 'test.sqlite' : 'db.sqlite',
      entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true
    }),
    UsersModule,
    ReportsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { // Добавив в кор модуль, позволит использовать ValidationPipe во всем приложении, при каждом запросе.
      provide: APP_PIPE, // NOTE whitelist - убирает поля которые не описаны в DTO
      useValue: new ValidationPipe({
        whitelist: true
      })
    }
  ],
})
export class AppModule {
  // C помощью метода configure можно добавить middleware в корневой модуль.
  // Это позволит использовать middleware во всем приложении, при каждом запросе.
  // В данном случае добавляем middleware для работы с сессиями.
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      session({ // NOTE Добавив в кор модуль, позволит использовать сессии во всем приложении, при каждом запросе.
        secret: 'top-secret-key',
        resave: false,
        saveUninitialized: false
      })
    ).forRoutes('*');
  }
}
