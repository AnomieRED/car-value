import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {
  }

  createTypeOrmOptions() {
    const config: TypeOrmModuleOptions = {
      type: 'sqlite',
      synchronize: false,
      database: this.configService.get<string>('DB_NAME'),
      migrations: ['src/database/migrations/*{.ts,.js}'],
      entities: [join(__dirname + '/**/*.entity{.ts,.js}')],
      autoLoadEntities: true,
      logging: true
    };

    switch (process.env.NODE_ENV) {
      case 'test':
        Object.assign(config, {
          migrationsRun: true,
          logging: false
        });
        break;
      case 'production':
        break;
      default:
        throw new Error('[Orm config] Unknown environment');
    }

    return config;
  }
}