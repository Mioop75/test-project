import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

const configService = new ConfigService();

export const typeorm: TypeOrmModule = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT') || 5432,
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/**'],
};

export default new DataSource(typeorm as DataSourceOptions);
