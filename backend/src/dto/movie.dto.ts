import { IsString, IsNumber, IsOptional, IsArray, Min, Max, IsInt } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  @Min(1888)
  @Max(new Date().getFullYear())
  releaseYear: number;

  @IsString()
  genre: string;

  @IsOptional()
  @IsArray()
  actorIds?: number[];
}

export class UpdateMovieDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1888)
  @Max(new Date().getFullYear())
  releaseYear?: number;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsArray()
  actorIds?: number[];
}

export class SearchMovieDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  genre?: string;
} 