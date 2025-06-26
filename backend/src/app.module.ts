import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { ActorsModule } from './actors/actors.module';
import { RatingsModule } from './ratings/ratings.module';
import { SeedsModule } from './seeds/seeds.module';
import { AppDataSource } from './data-source';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    MoviesModule,
    ActorsModule,
    RatingsModule,
    SeedsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
