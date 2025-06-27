import { IsString, IsNumber, Min, Max, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({
    description: 'The rating score (0.5 to 5.0)',
    example: 4.5,
    minimum: 0.5,
    maximum: 5.0
  })
  @IsNumber()
  @Min(0.5)
  @Max(5.0)
  score: number;

  @ApiProperty({
    description: 'A review comment about the movie',
    example: 'Excellent movie with outstanding performances and compelling storyline.',
    minLength: 1,
    maxLength: 1000
  })
  @IsString()
  comment: string;

  @ApiProperty({
    description: 'The name of the person who wrote the review',
    example: 'John Doe',
    minLength: 1,
    maxLength: 255
  })
  @IsString()
  reviewerName: string;

  @ApiProperty({
    description: 'The ID of the movie being rated',
    example: 1,
    minimum: 1
  })
  @IsInt()
  movieId: number;
}

export class UpdateRatingDto {
  @ApiProperty({
    description: 'The rating score (0.5 to 5.0)',
    example: 4.5,
    minimum: 0.5,
    maximum: 5.0
  })
  @IsNumber()
  @Min(0.5)
  @Max(5.0)
  score: number;

  @ApiProperty({
    description: 'A review comment about the movie',
    example: 'Excellent movie with outstanding performances and compelling storyline.',
    minLength: 1,
    maxLength: 1000
  })
  @IsString()
  comment: string;

  @ApiProperty({
    description: 'The name of the person who wrote the review',
    example: 'John Doe',
    minLength: 1,
    maxLength: 255
  })
  @IsString()
  reviewerName: string;
}

export class RatingResponseDto {
  @ApiProperty({
    description: 'The rating ID',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'The rating score',
    example: 4.5
  })
  score: number;

  @ApiProperty({
    description: 'The review comment',
    example: 'Excellent movie with outstanding performances and compelling storyline.'
  })
  comment: string;

  @ApiProperty({
    description: 'The name of the reviewer',
    example: 'John Doe'
  })
  reviewerName: string;

  @ApiProperty({
    description: 'The movie ID',
    example: 1
  })
  movieId: number;

  @ApiProperty({
    description: 'The movie title',
    example: 'The Shawshank Redemption'
  })
  movieTitle: string;

  @ApiProperty({
    description: 'The movie release year',
    example: 1994
  })
  movieReleaseYear: number;

  @ApiProperty({
    description: 'When the rating was created',
    example: '2024-01-01T00:00:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the rating was last updated',
    example: '2024-01-01T00:00:00.000Z'
  })
  updatedAt: Date;
} 