import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto, UpdateMovieDto, SearchMovieDto } from '../dto/movie.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new movie',
    description: 'Creates a new movie with the provided information. Requires authentication.'
  })
  @ApiResponse({
    status: 201,
    description: 'Movie created successfully',
    schema: {
      example: {
        id: 1,
        title: 'The Shawshank Redemption',
        description: 'Two imprisoned men bond over a number of years...',
        releaseYear: 1994,
        genre: 'Drama',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data provided' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all movies',
    description: 'Retrieves a list of all movies in the database'
  })
  @ApiResponse({
    status: 200,
    description: 'Return all movies',
    schema: {
      example: [
        {
          id: 1,
          title: 'The Shawshank Redemption',
          description: 'Two imprisoned men bond over a number of years...',
          releaseYear: 1994,
          genre: 'Drama',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      ]
    }
  })
  findAll() {
    return this.moviesService.findAll();
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search movies by title or genre',
    description: 'Search for movies using title (partial match) or genre (exact match)'
  })
  @ApiQuery({ name: 'title', required: false, description: 'Search by movie title (partial match)' })
  @ApiQuery({ name: 'genre', required: false, description: 'Search by movie genre (exact match)' })
  @ApiResponse({
    status: 200,
    description: 'Return filtered movies',
    schema: {
      example: [
        {
          id: 1,
          title: 'The Shawshank Redemption',
          description: 'Two imprisoned men bond over a number of years...',
          releaseYear: 1994,
          genre: 'Drama',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      ]
    }
  })
  search(@Query() searchDto: SearchMovieDto) {
    return this.moviesService.search(searchDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a movie by id',
    description: 'Retrieves a specific movie by its unique identifier'
  })
  @ApiParam({ name: 'id', description: 'Movie ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Return the movie',
    schema: {
      example: {
        id: 1,
        title: 'The Shawshank Redemption',
        description: 'Two imprisoned men bond over a number of years...',
        releaseYear: 1994,
        genre: 'Drama',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(+id);
  }

  @Get(':id/actors')
  @ApiOperation({
    summary: 'Get all actors in a movie',
    description: 'Retrieves all actors who appeared in a specific movie'
  })
  @ApiParam({ name: 'id', description: 'Movie ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Return all actors in the movie',
    schema: {
      example: [
        {
          id: 1,
          name: 'Morgan Freeman',
          biography: 'Morgan Freeman is an American actor...',
          birthDate: '1937-06-01',
          nationality: 'American',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      ]
    }
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  getActorsByMovie(@Param('id') id: string) {
    return this.moviesService.getActorsByMovie(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a movie',
    description: 'Updates an existing movie with new information. Requires authentication.'
  })
  @ApiParam({ name: 'id', description: 'Movie ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Movie updated successfully',
    schema: {
      example: {
        id: 1,
        title: 'The Shawshank Redemption (Updated)',
        description: 'Updated description...',
        releaseYear: 1994,
        genre: 'Drama',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data provided' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a movie',
    description: 'Permanently deletes a movie from the database. Requires authentication.'
  })
  @ApiParam({ name: 'id', description: 'Movie ID', example: 1 })
  @ApiResponse({ status: 204, description: 'Movie deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  remove(@Param('id') id: string) {
    return this.moviesService.remove(+id);
  }
} 