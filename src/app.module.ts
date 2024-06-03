import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-store';
import { AuthModule } from './auth/auth.module';
import config from './config/config';
import { typeorm } from './config/typeorm.config';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (config: ConfigService) => ({
        store: (await redisStore({
          ttl: config.get('CACHE_TTL'),
          socket: {
            host: config.get('REDIS_HOST'),
            port: +config.get('REDIS_PORT'),
          },
        })) as unknown as CacheStore,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRoot(typeorm),
    UserModule,
    AuthModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
