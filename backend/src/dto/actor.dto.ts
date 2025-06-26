import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateActorDto {
  @ApiProperty({
    description: 'The full name of the actor',
    example: 'Morgan Freeman',
    minLength: 1,
    maxLength: 255
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief biography of the actor',
    example: 'Morgan Freeman is an American actor, film director, and narrator. He is known for his distinctive deep voice and various roles in a wide variety of film genres.',
    minLength: 10,
    maxLength: 2000
  })
  @IsString()
  biography: string;

  @ApiProperty({
    description: 'The birth date of the actor in ISO format (YYYY-MM-DD)',
    example: '1937-06-01',
    format: 'date'
  })
  @IsDateString()
  birthDate: string;

  @ApiProperty({
    description: 'The nationality of the actor',
    example: 'American',
    minLength: 1,
    maxLength: 100
  })
  @IsString()
  nationality: string;
}

export class UpdateActorDto {
  @ApiPropertyOptional({
    description: 'The full name of the actor',
    example: 'Morgan Freeman',
    minLength: 1,
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'A brief biography of the actor',
    example: 'Morgan Freeman is an American actor, film director, and narrator. He is known for his distinctive deep voice and various roles in a wide variety of film genres.',
    minLength: 10,
    maxLength: 2000
  })
  @IsOptional()
  @IsString()
  biography?: string;

  @ApiPropertyOptional({
    description: 'The birth date of the actor in ISO format (YYYY-MM-DD)',
    example: '1937-06-01',
    format: 'date'
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({
    description: 'The nationality of the actor',
    example: 'American',
    minLength: 1,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  nationality?: string;
}

export class SearchActorDto {
  @ApiPropertyOptional({
    description: 'Search actors by name (partial match)',
    example: 'Morgan'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Search actors by nationality (exact match)',
    example: 'American'
  })
  @IsOptional()
  @IsString()
  nationality?: string;
} 