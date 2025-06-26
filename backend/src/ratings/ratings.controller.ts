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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('ratings')
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new rating' })
  @ApiResponse({ status: 201, description: 'Rating created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  create(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.create(createRatingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ratings' })
  @ApiResponse({ status: 200, description: 'Return all ratings' })
  findAll() {
    return this.ratingsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a rating by id' })
  @ApiResponse({ status: 200, description: 'Return the rating' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  findOne(@Param('id') id: string) {
    return this.ratingsService.findOne(+id);
  }

  @Get('movie/:movieId')
  @ApiOperation({ summary: 'Get all ratings for a specific movie' })
  @ApiResponse({ status: 200, description: 'Return all ratings for the movie' })
  findByMovie(@Param('movieId') movieId: string) {
    return this.ratingsService.findByMovie(+movieId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a rating' })
  @ApiResponse({ status: 200, description: 'Rating updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  update(@Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto) {
    return this.ratingsService.update(+id, updateRatingDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a rating' })
  @ApiResponse({ status: 204, description: 'Rating deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  remove(@Param('id') id: string) {
    return this.ratingsService.remove(+id);
  }
} 