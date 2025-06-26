import { IsString, IsNumber, Min, Max, IsInt } from 'class-validator';

export class CreateRatingDto {
  @IsNumber()
  @Min(0.5)
  @Max(5.0)
  score: number;

  @IsString()
  comment: string;

  @IsString()
  reviewerName: string;

  @IsInt()
  movieId: number;
}

export class UpdateRatingDto {
  @IsNumber()
  @Min(0.5)
  @Max(5.0)
  score: number;

  @IsString()
  comment: string;

  @IsString()
  reviewerName: string;
} 