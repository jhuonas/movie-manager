import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { ActorsModule } from './actors/actors.module';
import { RatingsModule } from './ratings/ratings.module';
import { SeedsModule } from './seeds/seeds.module';
import { Movie } from './entities/movie.entity';
import { Actor } from './entities/actor.entity';
import { Rating } from './entities/rating.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'moviesdb',
      entities: [Movie, Actor, Rating],
      autoLoadEntities: true,
      synchronize: true,
    }),
    MoviesModule,
    ActorsModule,
    RatingsModule,
    SeedsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
