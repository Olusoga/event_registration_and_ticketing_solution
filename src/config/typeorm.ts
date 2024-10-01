import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });
const isProduction = process.env.NODE_ENV === 'production';

const config = {
  type: 'postgres',
  host: `${process.env.DATABASE_HOST}`,
  port: `${process.env.DATABASE_PORT}`,
  username: `${process.env.DATABASE_USERNAME}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE_NAME}`,
  entities: [
    isProduction
      ? join(__dirname, '../dist/**/*.entity{.js,.ts}')
      : join(__dirname, '../**/*.entity{.ts,.js}'),
  ],
  migrations: [
    isProduction
      ? join(__dirname, '../dist/database/migrations/*{.js,.ts}')
      : join(__dirname, '../database/migrations/*{.ts,.js}'),
  ],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  autoLoadEntities: true,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
