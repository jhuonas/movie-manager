import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedsController } from './seeds.controller';
import { Movie } from '../entities/movie.entity';
import { Actor } from '../entities/actor.entity';
import { Rating } from '../entities/rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Actor, Rating])],
  controllers: [SeedsController],
  providers: [SeedService],
})
export class SeedsModule {} 