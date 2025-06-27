import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entities/rating.entity';
import { Movie } from '../entities/movie.entity';
import { CreateRatingDto, UpdateRatingDto, RatingResponseDto } from '../dto/rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) { }

  private transformRatingToResponse(rating: Rating): RatingResponseDto {
    return {
      id: rating.id,
      score: rating.score,
      comment: rating.comment,
      reviewerName: rating.reviewerName,
      movieId: rating.movie.id,
      movieTitle: rating.movie.title,
      movieReleaseYear: rating.movie.releaseYear,
      createdAt: rating.createdAt,
      updatedAt: rating.updatedAt,
    };
  }

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

    await this.updateMovieAverageRating(movie.id);

    return savedRating;
  }

  async findAll(): Promise<RatingResponseDto[]> {
    const ratings = await this.ratingsRepository.find({
      relations: ['movie'],
    });
    return ratings.map(rating => this.transformRatingToResponse(rating));
  }

  async findOne(id: number): Promise<RatingResponseDto> {
    const rating = await this.ratingsRepository.findOne({
      where: { id },
      relations: ['movie'],
    });

    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }

    return this.transformRatingToResponse(rating);
  }

  async findByMovie(movieId: number): Promise<RatingResponseDto[]> {
    const ratings = await this.ratingsRepository.find({
      where: { movie: { id: movieId } },
      relations: ['movie'],
    });
    return ratings.map(rating => this.transformRatingToResponse(rating));
  }

  async update(id: number, updateRatingDto: UpdateRatingDto): Promise<RatingResponseDto> {
    const originalRating = await this.ratingsRepository.findOne({
      where: { id },
      relations: ['movie'],
    });

    if (!originalRating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }

    Object.assign(originalRating, updateRatingDto);

    const updatedRating = await this.ratingsRepository.save(originalRating);

    await this.updateMovieAverageRating(updatedRating.movie.id);

    return this.transformRatingToResponse(updatedRating);
  }

  async remove(id: number): Promise<void> {
    const rating = await this.ratingsRepository.findOne({
      where: { id },
      relations: ['movie'],
    });

    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }

    const movieId = rating.movie.id;

    await this.ratingsRepository.remove(rating);

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