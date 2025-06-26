import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateActorDto {
  @IsString()
  name: string;

  @IsString()
  biography: string;

  @IsDateString()
  birthDate: string;

  @IsString()
  nationality: string;
}

export class UpdateActorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  nationality?: string;
}

export class SearchActorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  nationality?: string;
} 