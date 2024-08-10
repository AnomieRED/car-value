var dbConfig = {
  synchronize: false,
  logging: true,
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['*/**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['*/**/*.entity.ts'],
    });
    break;
  case 'production':
    break;
  default:
    throw new Error('[Orm config] Unknown environment');
}

module.exports = dbConfig;