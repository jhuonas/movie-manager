import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto, UpdateRatingDto } from '../dto/rating.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('ratings')
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) { }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new rating',
    description: 'Creates a new rating for a movie. Requires authentication.'
  })
  @ApiResponse({
    status: 201,
    description: 'Rating created successfully',
    schema: {
      example: {
        id: 1,
        score: 4.5,
        comment: 'Excellent movie with outstanding performances and compelling storyline.',
        reviewerName: 'John Doe',
        movieId: 1,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data provided' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  create(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.create(createRatingDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all ratings',
    description: 'Retrieves a list of all ratings in the database'
  })
  @ApiResponse({
    status: 200,
    description: 'Return all ratings',
    schema: {
      example: [
        {
          id: 1,
          score: 4.5,
          comment: 'Excellent movie with outstanding performances and compelling storyline.',
          reviewerName: 'John Doe',
          movieId: 1,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      ]
    }
  })
  findAll() {
    return this.ratingsService.findAll();
  }

  @Get('movie/:movieId')
  @ApiOperation({
    summary: 'Get all ratings for a specific movie',
    description: 'Retrieves all ratings for a specific movie by movie ID'
  })
  @ApiParam({ name: 'movieId', description: 'Movie ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Return all ratings for the movie',
    schema: {
      example: [
        {
          id: 1,
          score: 4.5,
          comment: 'Excellent movie with outstanding performances and compelling storyline.',
          reviewerName: 'John Doe',
          movieId: 1,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      ]
    }
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  findByMovie(@Param('movieId') movieId: string) {
    return this.ratingsService.findByMovie(+movieId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a rating by id',
    description: 'Retrieves a specific rating by its unique identifier'
  })
  @ApiParam({ name: 'id', description: 'Rating ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Return the rating',
    schema: {
      example: {
        id: 1,
        score: 4.5,
        comment: 'Excellent movie with outstanding performances and compelling storyline.',
        reviewerName: 'John Doe',
        movieId: 1,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  findOne(@Param('id') id: string) {
    return this.ratingsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a rating',
    description: 'Updates an existing rating with new information. Requires authentication.'
  })
  @ApiParam({ name: 'id', description: 'Rating ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Rating updated successfully',
    schema: {
      example: {
        id: 1,
        score: 5.0,
        comment: 'Updated comment - This movie is absolutely fantastic!',
        reviewerName: 'John Doe',
        movieId: 1,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data provided' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  update(@Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto) {
    return this.ratingsService.update(+id, updateRatingDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a rating',
    description: 'Permanently deletes a rating from the database. Requires authentication.'
  })
  @ApiParam({ name: 'id', description: 'Rating ID', example: 1 })
  @ApiResponse({ status: 204, description: 'Rating deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  remove(@Param('id') id: string) {
    return this.ratingsService.remove(+id);
  }
} 