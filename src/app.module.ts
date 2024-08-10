import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { APP_PIPE } from '@nestjs/core';
import * as session from 'express-session';
import * as process from 'node:process';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { TypeOrmConfigService } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ // NOTE Позволяет использовать переменные окружения во всем приложении
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService], // NOTE Внедряем ConfigService в провайдер
    //   useFactory: (config: ConfigService) => { // NOTE Возвращаем объект с настройками для TypeOrmModule.forRoot
    //     return {
    //       type: 'sqlite',
    //       database: config.get<string>('DB_NAME'),
    //       entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
    //       autoLoadEntities: true,
    //       synchronize: true,
    //       logging: true
    //     };
    //   },
    // }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { // Добавив в кор модуль, позволит использовать ValidationPipe во всем приложении, при каждом запросе.
      provide: APP_PIPE, // NOTE whitelist - убирает поля которые не описаны в DTO
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {

  constructor(private configService: ConfigService) {}

  // C помощью метода configure можно добавить middleware в корневой модуль.
  // Это позволит использовать middleware во всем приложении, при каждом запросе.
  // В данном случае добавляем middleware для работы с сессиями.
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      session({ // NOTE Добавив в кор модуль, позволит использовать сессии во всем приложении, при каждом запросе.
        secret: this.configService.get<string>('COOKIE_SESSION_KEY'),
        resave: false,
        saveUninitialized: false,
      })
    ).forRoutes('*');

    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
