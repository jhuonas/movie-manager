import { Test, TestingModule } from '@nestjs/testing';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { CreateRatingDto, UpdateRatingDto, RatingResponseDto } from '../dto/rating.dto';
import { NotFoundException } from '@nestjs/common';

describe('RatingsController', () => {
  let controller: RatingsController;
  let service: RatingsService;

  const mockRatingsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByMovie: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingsController],
      providers: [
        {
          provide: RatingsService,
          useValue: mockRatingsService,
        },
      ],
    }).compile();

    controller = module.get<RatingsController>(RatingsController);
    service = module.get<RatingsService>(RatingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a rating', async () => {
      const createRatingDto: CreateRatingDto = {
        score: 8.5,
        comment: 'Great movie!',
        reviewerName: 'John Doe',
        movieId: 1,
      };

      const mockRating = {
        id: 1,
        score: createRatingDto.score,
        comment: createRatingDto.comment,
        reviewerName: createRatingDto.reviewerName,
        movie: {
          id: createRatingDto.movieId,
          title: 'Test Movie',
          releaseYear: 2023,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRatingsService.create.mockResolvedValue(mockRating);

      const result = await controller.create(createRatingDto);

      expect(service.create).toHaveBeenCalledWith(createRatingDto);
      expect(result).toEqual(mockRating);
    });
  });

  describe('findAll', () => {
    it('should return all ratings', async () => {
      const mockRatings: RatingResponseDto[] = [
        {
          id: 1,
          score: 8.5,
          comment: 'Great movie!',
          reviewerName: 'John Doe',
          movieId: 1,
          movieTitle: 'Test Movie',
          movieReleaseYear: 2023,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
        {
          id: 2,
          score: 7.0,
          comment: 'Good movie',
          reviewerName: 'Jane Smith',
          movieId: 1,
          movieTitle: 'Test Movie',
          movieReleaseYear: 2023,
          createdAt: new Date('2023-01-02'),
          updatedAt: new Date('2023-01-02'),
        },
      ];

      mockRatingsService.findAll.mockResolvedValue(mockRatings);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockRatings);
    });
  });

  describe('findByMovie', () => {
    it('should return ratings for a specific movie', async () => {
      const mockRatings: RatingResponseDto[] = [
        {
          id: 1,
          score: 8.5,
          comment: 'Great movie!',
          reviewerName: 'John Doe',
          movieId: 1,
          movieTitle: 'Test Movie',
          movieReleaseYear: 2023,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
      ];

      mockRatingsService.findByMovie.mockResolvedValue(mockRatings);

      const result = await controller.findByMovie('1');

      expect(service.findByMovie).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockRatings);
    });
  });

  describe('findOne', () => {
    it('should return a rating by id', async () => {
      const mockRating: RatingResponseDto = {
        id: 1,
        score: 8.5,
        comment: 'Great movie!',
        reviewerName: 'John Doe',
        movieId: 1,
        movieTitle: 'Test Movie',
        movieReleaseYear: 2023,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      };

      mockRatingsService.findOne.mockResolvedValue(mockRating);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockRating);
    });

    it('should throw NotFoundException when rating not found', async () => {
      mockRatingsService.findOne.mockRejectedValue(new NotFoundException('Rating with ID 999 not found'));

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    it('should update a rating', async () => {
      const updateRatingDto: UpdateRatingDto = {
        score: 9.0,
        comment: 'Updated comment',
        reviewerName: 'Updated Reviewer',
      };

      const mockRating: RatingResponseDto = {
        id: 1,
        score: 9.0,
        comment: 'Updated comment',
        reviewerName: 'Updated Reviewer',
        movieId: 1,
        movieTitle: 'Test Movie',
        movieReleaseYear: 2023,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      };

      mockRatingsService.update.mockResolvedValue(mockRating);

      const result = await controller.update('1', updateRatingDto);

      expect(service.update).toHaveBeenCalledWith(1, updateRatingDto);
      expect(result).toEqual(mockRating);
    });

    it('should throw NotFoundException when rating not found', async () => {
      const updateRatingDto: UpdateRatingDto = {
        score: 9.0,
        comment: 'Updated comment',
        reviewerName: 'Updated Reviewer',
      };

      mockRatingsService.update.mockRejectedValue(new NotFoundException('Rating with ID 999 not found'));

      await expect(controller.update('999', updateRatingDto)).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(999, updateRatingDto);
    });
  });

  describe('remove', () => {
    it('should remove a rating', async () => {
      mockRatingsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when rating not found', async () => {
      mockRatingsService.remove.mockRejectedValue(new NotFoundException('Rating with ID 999 not found'));

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(999);
    });
  });
}); 