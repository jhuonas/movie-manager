import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { Actor } from '../entities/actor.entity';
import { CreateMovieDto, UpdateMovieDto, SearchMovieDto } from '../dto/movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @InjectRepository(Actor)
    private actorsRepository: Repository<Actor>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.moviesRepository.create(createMovieDto);
    
    if (createMovieDto.actorIds && createMovieDto.actorIds.length > 0) {
      const actors = await this.actorsRepository.findBy({ id: In(createMovieDto.actorIds) });
      movie.actors = actors;
    }

    return this.moviesRepository.save(movie);
  }

  async findAll(): Promise<Movie[]> {
    return this.moviesRepository.find({
      relations: ['actors', 'ratings'],
    });
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.moviesRepository.findOne({
      where: { id },
      relations: ['actors', 'ratings'],
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  async search(searchDto: SearchMovieDto): Promise<Movie[]> {
    const whereConditions: any = {};

    if (searchDto.title) {
      whereConditions.title = Like(`%${searchDto.title}%`);
    }

    if (searchDto.genre) {
      whereConditions.genre = Like(`%${searchDto.genre}%`);
    }

    return this.moviesRepository.find({
      where: whereConditions,
      relations: ['actors', 'ratings'],
    });
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.findOne(id);

    if (updateMovieDto.actorIds && updateMovieDto.actorIds.length > 0) {
      const actors = await this.actorsRepository.findBy({ id: In(updateMovieDto.actorIds) });
      movie.actors = actors;
    }

    Object.assign(movie, updateMovieDto);
    return this.moviesRepository.save(movie);
  }

  async remove(id: number): Promise<void> {
    const movie = await this.findOne(id);
    await this.moviesRepository.remove(movie);
  }

  async getActorsByMovie(id: number): Promise<Actor[]> {
    const movie = await this.findOne(id);
    return movie.actors;
  }
} 