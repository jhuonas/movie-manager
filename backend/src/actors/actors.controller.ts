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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('actors')
@Controller('actors')
export class ActorsController {
  constructor(private readonly actorsService: ActorsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new actor' })
  @ApiResponse({ status: 201, description: 'Actor created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createActorDto: CreateActorDto) {
    return this.actorsService.create(createActorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all actors' })
  @ApiResponse({ status: 200, description: 'Return all actors' })
  findAll() {
    return this.actorsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search actors by name or nationality' })
  @ApiResponse({ status: 200, description: 'Return filtered actors' })
  search(@Query() searchDto: SearchActorDto) {
    return this.actorsService.search(searchDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an actor by id' })
  @ApiResponse({ status: 200, description: 'Return the actor' })
  @ApiResponse({ status: 404, description: 'Actor not found' })
  findOne(@Param('id') id: string) {
    return this.actorsService.findOne(+id);
  }

  @Get(':id/movies')
  @ApiOperation({ summary: 'Get all movies an actor has been in' })
  @ApiResponse({ status: 200, description: 'Return all movies the actor appeared in' })
  @ApiResponse({ status: 404, description: 'Actor not found' })
  getMoviesByActor(@Param('id') id: string) {
    return this.actorsService.getMoviesByActor(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an actor' })
  @ApiResponse({ status: 200, description: 'Actor updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Actor not found' })
  update(@Param('id') id: string, @Body() updateActorDto: UpdateActorDto) {
    return this.actorsService.update(+id, updateActorDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an actor' })
  @ApiResponse({ status: 204, description: 'Actor deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Actor not found' })
  remove(@Param('id') id: string) {
    return this.actorsService.remove(+id);
  }
} 