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