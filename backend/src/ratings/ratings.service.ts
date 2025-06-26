import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entities/rating.entity';
import { Movie } from '../entities/movie.entity';
import { CreateRatingDto, UpdateRatingDto } from '../dto/rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async create(createRatingDto: CreateRatingDto): Promise<Rating> {
    const movie = await this.moviesRepository.findOne({
      where: { id: createRatingDto.movieId },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${createRatingDto.movieId} not found`);
    }

    const rating = this.ratingsRepository.create({
      score: createRatingDto.score,
      comment: createRatingDto.comment,
      reviewerName: createRatingDto.reviewerName,
      movie,
    });

    const savedRating = await this.ratingsRepository.save(rating);
    
    // Update movie average rating
    await this.updateMovieAverageRating(movie.id);
    
    return savedRating;
  }

  async findAll(): Promise<Rating[]> {
    return this.ratingsRepository.find({
      relations: ['movie'],
    });
  }

  async findOne(id: number): Promise<Rating> {
    const rating = await this.ratingsRepository.findOne({
      where: { id },
      relations: ['movie'],
    });

    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }

    return rating;
  }

  async findByMovie(movieId: number): Promise<Rating[]> {
    return this.ratingsRepository.find({
      where: { movie: { id: movieId } },
      relations: ['movie'],
    });
  }

  async update(id: number, updateRatingDto: UpdateRatingDto): Promise<Rating> {
    const rating = await this.findOne(id);
    Object.assign(rating, updateRatingDto);
    
    const updatedRating = await this.ratingsRepository.save(rating);
    
    // Update movie average rating
    await this.updateMovieAverageRating(rating.movie.id);
    
    return updatedRating;
  }

  async remove(id: number): Promise<void> {
    const rating = await this.findOne(id);
    const movieId = rating.movie.id;
    
    await this.ratingsRepository.remove(rating);
    
    // Update movie average rating
    await this.updateMovieAverageRating(movieId);
  }

  private async updateMovieAverageRating(movieId: number): Promise<void> {
    const ratings = await this.ratingsRepository.find({
      where: { movie: { id: movieId } },
    });

    if (ratings.length > 0) {
      const averageRating = ratings.reduce((sum, rating) => sum + rating.score, 0) / ratings.length;
      
      await this.moviesRepository.update(movieId, {
        averageRating: Math.round(averageRating * 10) / 10,
      });
    } else {
      await this.moviesRepository.update(movieId, { averageRating: 0 });
    }
  }
} 