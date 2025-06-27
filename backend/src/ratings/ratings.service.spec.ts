import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { Rating } from '../entities/rating.entity';
import { Movie } from '../entities/movie.entity';
import { CreateRatingDto, UpdateRatingDto, RatingResponseDto } from '../dto/rating.dto';

describe('RatingsService', () => {
  let service: RatingsService;
  let ratingsRepository: Repository<Rating>;
  let moviesRepository: Repository<Movie>;

  const mockRatingsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockMoviesRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingsService,
        {
          provide: getRepositoryToken(Rating),
          useValue: mockRatingsRepository,
        },
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMoviesRepository,
        },
      ],
    }).compile();

    service = module.get<RatingsService>(RatingsService);
    ratingsRepository = module.get<Repository<Rating>>(getRepositoryToken(Rating));
    moviesRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a rating', async () => {
      const createRatingDto: CreateRatingDto = {
        score: 8.5,
        comment: 'Great movie!',
        reviewerName: 'John Doe',
        movieId: 1,
      };

      const mockMovie = {
        id: 1,
        title: 'Test Movie',
        releaseYear: 2023,
        averageRating: 0,
      };

      const mockRating = {
        id: 1,
        score: createRatingDto.score,
        comment: createRatingDto.comment,
        reviewerName: createRatingDto.reviewerName,
        movie: mockMovie,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMoviesRepository.findOne.mockResolvedValue(mockMovie);
      mockRatingsRepository.create.mockReturnValue(mockRating);
      mockRatingsRepository.save.mockResolvedValue(mockRating);
      mockRatingsRepository.find.mockResolvedValue([mockRating]);
      mockMoviesRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.create(createRatingDto);

      expect(mockMoviesRepository.findOne).toHaveBeenCalledWith({
        where: { id: createRatingDto.movieId },
      });
      expect(mockRatingsRepository.create).toHaveBeenCalledWith({
        score: createRatingDto.score,
        comment: createRatingDto.comment,
        reviewerName: createRatingDto.reviewerName,
        movie: mockMovie,
      });
      expect(mockRatingsRepository.save).toHaveBeenCalledWith(mockRating);
      expect(result).toEqual(mockRating);
    });

    it('should throw NotFoundException when movie not found', async () => {
      const createRatingDto: CreateRatingDto = {
        score: 8.5,
        comment: 'Great movie!',
        reviewerName: 'John Doe',
        movieId: 999,
      };

      mockMoviesRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createRatingDto)).rejects.toThrow(NotFoundException);
      expect(mockMoviesRepository.findOne).toHaveBeenCalledWith({
        where: { id: createRatingDto.movieId },
      });
    });
  });

  describe('findAll', () => {
    it('should return all ratings with transformed response', async () => {
      const mockMovie = {
        id: 1,
        title: 'Test Movie',
        releaseYear: 2023,
      };

      const mockRatings = [
        {
          id: 1,
          score: 8.5,
          comment: 'Great movie!',
          reviewerName: 'John Doe',
          movie: mockMovie,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
        {
          id: 2,
          score: 7.0,
          comment: 'Good movie',
          reviewerName: 'Jane Smith',
          movie: mockMovie,
          createdAt: new Date('2023-01-02'),
          updatedAt: new Date('2023-01-02'),
        },
      ];

      const expectedResponse: RatingResponseDto[] = [
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

      mockRatingsRepository.find.mockResolvedValue(mockRatings);

      const result = await service.findAll();

      expect(mockRatingsRepository.find).toHaveBeenCalledWith({
        relations: ['movie'],
      });
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findOne', () => {
    it('should return a rating by id with transformed response', async () => {
      const mockMovie = {
        id: 1,
        title: 'Test Movie',
        releaseYear: 2023,
      };

      const mockRating = {
        id: 1,
        score: 8.5,
        comment: 'Great movie!',
        reviewerName: 'John Doe',
        movie: mockMovie,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      };

      const expectedResponse: RatingResponseDto = {
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

      mockRatingsRepository.findOne.mockResolvedValue(mockRating);

      const result = await service.findOne(1);

      expect(mockRatingsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['movie'],
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should throw NotFoundException when rating not found', async () => {
      mockRatingsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockRatingsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['movie'],
      });
    });
  });

  describe('findByMovie', () => {
    it('should return ratings for a specific movie', async () => {
      const mockMovie = {
        id: 1,
        title: 'Test Movie',
        releaseYear: 2023,
      };

      const mockRatings = [
        {
          id: 1,
          score: 8.5,
          comment: 'Great movie!',
          reviewerName: 'John Doe',
          movie: mockMovie,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
      ];

      const expectedResponse: RatingResponseDto[] = [
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

      mockRatingsRepository.find.mockResolvedValue(mockRatings);

      const result = await service.findByMovie(1);

      expect(mockRatingsRepository.find).toHaveBeenCalledWith({
        where: { movie: { id: 1 } },
        relations: ['movie'],
      });
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('update', () => {
    it('should update a rating', async () => {
      const updateRatingDto: UpdateRatingDto = {
        score: 9.0,
        comment: 'Updated comment',
        reviewerName: 'Updated Reviewer',
      };

      const mockMovie = {
        id: 1,
        title: 'Test Movie',
        releaseYear: 2023,
      };

      const originalRating = {
        id: 1,
        score: 8.5,
        comment: 'Original comment',
        reviewerName: 'John Doe',
        movie: mockMovie,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      };

      const updatedRating = {
        ...originalRating,
        ...updateRatingDto,
      };

      const expectedResponse: RatingResponseDto = {
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

      mockRatingsRepository.findOne.mockResolvedValue(originalRating);
      mockRatingsRepository.save.mockResolvedValue(updatedRating);
      mockRatingsRepository.find.mockResolvedValue([updatedRating]);
      mockMoviesRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, updateRatingDto);

      expect(mockRatingsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['movie'],
      });
      expect(mockRatingsRepository.save).toHaveBeenCalledWith(updatedRating);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw NotFoundException when rating not found', async () => {
      const updateRatingDto: UpdateRatingDto = {
        score: 9.0,
        comment: 'Updated comment',
        reviewerName: 'Updated Reviewer',
      };

      mockRatingsRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateRatingDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a rating', async () => {
      const mockMovie = {
        id: 1,
        title: 'Test Movie',
        releaseYear: 2023,
      };

      const mockRating = {
        id: 1,
        score: 8.5,
        comment: 'Great movie!',
        reviewerName: 'John Doe',
        movie: mockMovie,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      };

      mockRatingsRepository.findOne.mockResolvedValue(mockRating);
      mockRatingsRepository.remove.mockResolvedValue(mockRating);
      mockRatingsRepository.find.mockResolvedValue([]);
      mockMoviesRepository.update.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockRatingsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['movie'],
      });
      expect(mockRatingsRepository.remove).toHaveBeenCalledWith(mockRating);
    });

    it('should throw NotFoundException when rating not found', async () => {
      mockRatingsRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateMovieAverageRating', () => {
    it('should update movie average rating when ratings exist', async () => {
      const mockRatings = [
        { score: 8.0 },
        { score: 9.0 },
        { score: 7.0 },
      ];

      mockRatingsRepository.find.mockResolvedValue(mockRatings);
      mockMoviesRepository.update.mockResolvedValue({ affected: 1 });

      const createRatingDto: CreateRatingDto = {
        score: 8.5,
        comment: 'Great movie!',
        reviewerName: 'John Doe',
        movieId: 1,
      };

      const mockMovie = {
        id: 1,
        title: 'Test Movie',
        releaseYear: 2023,
        averageRating: 0,
      };

      const mockRating = {
        id: 1,
        score: createRatingDto.score,
        comment: createRatingDto.comment,
        reviewerName: createRatingDto.reviewerName,
        movie: mockMovie,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMoviesRepository.findOne.mockResolvedValue(mockMovie);
      mockRatingsRepository.create.mockReturnValue(mockRating);
      mockRatingsRepository.save.mockResolvedValue(mockRating);
      mockRatingsRepository.find.mockResolvedValue(mockRatings);
      mockMoviesRepository.update.mockResolvedValue({ affected: 1 });

      await service.create(createRatingDto);

      expect(mockRatingsRepository.find).toHaveBeenCalledWith({
        where: { movie: { id: 1 } },
      });
      expect(mockMoviesRepository.update).toHaveBeenCalledWith(1, {
        averageRating: 8.0, // (8.0 + 9.0 + 7.0) / 3 = 8.0
      });
    });

    it('should set average rating to 0 when no ratings exist', async () => {
      mockRatingsRepository.find.mockResolvedValue([]);
      mockMoviesRepository.update.mockResolvedValue({ affected: 1 });

      const mockMovie = {
        id: 1,
        title: 'Test Movie',
        releaseYear: 2023,
      };

      const mockRating = {
        id: 1,
        score: 8.5,
        comment: 'Great movie!',
        reviewerName: 'John Doe',
        movie: mockMovie,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      };

      mockRatingsRepository.findOne.mockResolvedValue(mockRating);
      mockRatingsRepository.remove.mockResolvedValue(mockRating);

      await service.remove(1);

      expect(mockMoviesRepository.update).toHaveBeenCalledWith(1, {
        averageRating: 0,
      });
    });
  });
}); 