import { Controller, Post, UseGuards } from '@nestjs/common';
import { SeedService } from './seed.service';
import { AuthGuard } from '../guards/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('seeds')
@Controller('seeds')
export class SeedsController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seed the database with sample data' })
  @ApiResponse({ status: 201, description: 'Database seeded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async seed() {
    await this.seedService.seed();
    return { message: 'Database seeded successfully!' };
  }
} 