import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto, UpdateMovieDto, SearchMovieDto } from '../dto/movie.dto';
import { NotFoundException } from '@nestjs/common';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const mockMoviesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    search: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getActorsByMovie: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a movie', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'Test Movie',
        description: 'Test Description',
        releaseYear: 2023,
        genre: 'Action',
      };

      const mockMovie = {
        id: 1,
        ...createMovieDto,
        actors: [],
        ratings: [],
        averageRating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMoviesService.create.mockResolvedValue(mockMovie);

      const result = await controller.create(createMovieDto);

      expect(service.create).toHaveBeenCalledWith(createMovieDto);
      expect(result).toEqual(mockMovie);
    });
  });

  describe('findAll', () => {
    it('should return all movies', async () => {
      const mockMovies = [
        {
          id: 1,
          title: 'Movie 1',
          description: 'Description 1',
          releaseYear: 2023,
          genre: 'Action',
          actors: [],
          ratings: [],
          averageRating: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Movie 2',
          description: 'Description 2',
          releaseYear: 2022,
          genre: 'Drama',
          actors: [],
          ratings: [],
          averageRating: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockMoviesService.findAll.mockResolvedValue(mockMovies);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockMovies);
    });
  });

  describe('search', () => {
    it('should search movies by title', async () => {
      const searchDto: SearchMovieDto = { title: 'Test' };
      const mockMovies = [
        {
          id: 1,
          title: 'Test Movie',
          description: 'Test Description',
          releaseYear: 2023,
          genre: 'Action',
          actors: [],
          ratings: [],
          averageRating: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockMoviesService.search.mockResolvedValue(mockMovies);

      const result = await controller.search(searchDto);

      expect(service.search).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual(mockMovies);
    });

    it('should search movies by genre', async () => {
      const searchDto: SearchMovieDto = { genre: 'Action' };
      const mockMovies = [
        {
          id: 1,
          title: 'Test Movie',
          description: 'Test Description',
          releaseYear: 2023,
          genre: 'Action',
          actors: [],
          ratings: [],
          averageRating: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockMoviesService.search.mockResolvedValue(mockMovies);

      const result = await controller.search(searchDto);

      expect(service.search).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual(mockMovies);
    });
  });

  describe('findOne', () => {
    it('should return a movie by id', async () => {
      const mockMovie = {
        id: 1,
        title: 'Test Movie',
        description: 'Test Description',
        releaseYear: 2023,
        genre: 'Action',
        actors: [],
        ratings: [],
        averageRating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMoviesService.findOne.mockResolvedValue(mockMovie);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMovie);
    });

    it('should throw NotFoundException when movie not found', async () => {
      mockMoviesService.findOne.mockRejectedValue(new NotFoundException('Movie with ID 999 not found'));

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('getActorsByMovie', () => {
    it('should return actors for a movie', async () => {
      const mockActors = [
        {
          id: 1,
          name: 'Actor 1',
          birthDate: new Date('1990-01-01'),
          nationality: 'American',
          biography: 'Test biography',
          movies: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Actor 2',
          birthDate: new Date('1985-05-15'),
          nationality: 'British',
          biography: 'Test biography 2',
          movies: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockMoviesService.getActorsByMovie.mockResolvedValue(mockActors);

      const result = await controller.getActorsByMovie('1');

      expect(service.getActorsByMovie).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockActors);
    });

    it('should throw NotFoundException when movie not found', async () => {
      mockMoviesService.getActorsByMovie.mockRejectedValue(new NotFoundException('Movie with ID 999 not found'));

      await expect(controller.getActorsByMovie('999')).rejects.toThrow(NotFoundException);
      expect(service.getActorsByMovie).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const updateMovieDto: UpdateMovieDto = {
        title: 'Updated Movie',
        description: 'Updated Description',
      };

      const mockMovie = {
        id: 1,
        title: 'Updated Movie',
        description: 'Updated Description',
        releaseYear: 2023,
        genre: 'Action',
        actors: [],
        ratings: [],
        averageRating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMoviesService.update.mockResolvedValue(mockMovie);

      const result = await controller.update('1', updateMovieDto);

      expect(service.update).toHaveBeenCalledWith(1, updateMovieDto);
      expect(result).toEqual(mockMovie);
    });

    it('should throw NotFoundException when movie not found', async () => {
      const updateMovieDto: UpdateMovieDto = { title: 'Updated Movie' };

      mockMoviesService.update.mockRejectedValue(new NotFoundException('Movie with ID 999 not found'));

      await expect(controller.update('999', updateMovieDto)).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(999, updateMovieDto);
    });
  });

  describe('remove', () => {
    it('should remove a movie', async () => {
      mockMoviesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when movie not found', async () => {
      mockMoviesService.remove.mockRejectedValue(new NotFoundException('Movie with ID 999 not found'));

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(999);
    });
  });
}); 