import { IsString, IsNumber, IsOptional, IsArray, Min, Max, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({
    description: 'The title of the movie',
    example: 'The Shawshank Redemption',
    minLength: 1,
    maxLength: 255
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'A brief description of the movie plot',
    example: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    minLength: 10,
    maxLength: 1000
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The year the movie was released',
    example: 1994,
    minimum: 1888,
    maximum: 2024
  })
  @IsInt()
  @Min(1888)
  @Max(new Date().getFullYear())
  releaseYear: number;

  @ApiProperty({
    description: 'The genre of the movie',
    example: 'Drama',
    minLength: 1,
    maxLength: 100
  })
  @IsString()
  genre: string;

  @ApiPropertyOptional({
    description: 'Array of actor IDs to associate with this movie',
    example: [1, 2, 3],
    type: [Number]
  })
  @IsOptional()
  @IsArray()
  actorIds?: number[];
}

export class UpdateMovieDto {
  @ApiPropertyOptional({
    description: 'The title of the movie',
    example: 'The Shawshank Redemption',
    minLength: 1,
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'A brief description of the movie plot',
    example: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    minLength: 10,
    maxLength: 1000
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'The year the movie was released',
    example: 1994,
    minimum: 1888,
    maximum: 2024
  })
  @IsOptional()
  @IsInt()
  @Min(1888)
  @Max(new Date().getFullYear())
  releaseYear?: number;

  @ApiPropertyOptional({
    description: 'The genre of the movie',
    example: 'Drama',
    minLength: 1,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({
    description: 'Array of actor IDs to associate with this movie',
    example: [1, 2, 3],
    type: [Number]
  })
  @IsOptional()
  @IsArray()
  actorIds?: number[];
}

export class SearchMovieDto {
  @ApiPropertyOptional({
    description: 'Search movies by title (partial match)',
    example: 'Shawshank'
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Search movies by genre (exact match)',
    example: 'Drama'
  })
  @IsOptional()
  @IsString()
  genre?: string;
} 