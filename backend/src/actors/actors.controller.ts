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
import { ActorsService } from './actors.service';
import { CreateActorDto, UpdateActorDto, SearchActorDto } from '../dto/actor.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('actors')
@Controller('actors')
export class ActorsController {
  constructor(private readonly actorsService: ActorsService) { }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new actor',
    description: 'Creates a new actor with the provided information. Requires authentication.'
  })
  @ApiResponse({
    status: 201,
    description: 'Actor created successfully',
    schema: {
      example: {
        id: 1,
        name: 'Morgan Freeman',
        biography: 'Morgan Freeman is an American actor, film director, and narrator...',
        birthDate: '1937-06-01',
        nationality: 'American',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data provided' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  create(@Body() createActorDto: CreateActorDto) {
    return this.actorsService.create(createActorDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all actors',
    description: 'Retrieves a list of all actors in the database'
  })
  @ApiResponse({
    status: 200,
    description: 'Return all actors',
    schema: {
      example: [
        {
          id: 1,
          name: 'Morgan Freeman',
          biography: 'Morgan Freeman is an American actor, film director, and narrator...',
          birthDate: '1937-06-01',
          nationality: 'American',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      ]
    }
  })
  findAll() {
    return this.actorsService.findAll();
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search actors by name or nationality',
    description: 'Search for actors using name (partial match) or nationality (exact match)'
  })
  @ApiQuery({ name: 'name', required: false, description: 'Search by actor name (partial match)' })
  @ApiQuery({ name: 'nationality', required: false, description: 'Search by actor nationality (exact match)' })
  @ApiResponse({
    status: 200,
    description: 'Return filtered actors',
    schema: {
      example: [
        {
          id: 1,
          name: 'Morgan Freeman',
          biography: 'Morgan Freeman is an American actor, film director, and narrator...',
          birthDate: '1937-06-01',
          nationality: 'American',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      ]
    }
  })
  search(@Query() searchDto: SearchActorDto) {
    return this.actorsService.search(searchDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get an actor by id',
    description: 'Retrieves a specific actor by their unique identifier'
  })
  @ApiParam({ name: 'id', description: 'Actor ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Return the actor',
    schema: {
      example: {
        id: 1,
        name: 'Morgan Freeman',
        biography: 'Morgan Freeman is an American actor, film director, and narrator...',
        birthDate: '1937-06-01',
        nationality: 'American',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Actor not found' })
  findOne(@Param('id') id: string) {
    return this.actorsService.findOne(+id);
  }

  @Get(':id/movies')
  @ApiOperation({
    summary: 'Get all movies an actor has been in',
    description: 'Retrieves all movies where a specific actor has appeared'
  })
  @ApiParam({ name: 'id', description: 'Actor ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Return all movies the actor appeared in',
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
  @ApiResponse({ status: 404, description: 'Actor not found' })
  getMoviesByActor(@Param('id') id: string) {
    return this.actorsService.getMoviesByActor(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update an actor',
    description: 'Updates an existing actor with new information. Requires authentication.'
  })
  @ApiParam({ name: 'id', description: 'Actor ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Actor updated successfully',
    schema: {
      example: {
        id: 1,
        name: 'Morgan Freeman (Updated)',
        biography: 'Updated biography...',
        birthDate: '1937-06-01',
        nationality: 'American',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data provided' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 404, description: 'Actor not found' })
  update(@Param('id') id: string, @Body() updateActorDto: UpdateActorDto) {
    return this.actorsService.update(+id, updateActorDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete an actor',
    description: 'Permanently deletes an actor from the database. Requires authentication.'
  })
  @ApiParam({ name: 'id', description: 'Actor ID', example: 1 })
  @ApiResponse({ status: 204, description: 'Actor deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 404, description: 'Actor not found' })
  remove(@Param('id') id: string) {
    return this.actorsService.remove(+id);
  }
} 