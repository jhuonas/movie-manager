import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from '../entities/movie.entity';
import { Actor } from '../entities/actor.entity';
import { CreateMovieDto, UpdateMovieDto, SearchMovieDto } from '../dto/movie.dto';

describe('MoviesService', () => {
  let service: MoviesService;
  let moviesRepository: Repository<Movie>;
  let actorsRepository: Repository<Actor>;

  const mockMoviesRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockActorsRepository = {
    findBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMoviesRepository,
        },
        {
          provide: getRepositoryToken(Actor),
          useValue: mockActorsRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    moviesRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    actorsRepository = module.get<Repository<Actor>>(getRepositoryToken(Actor));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a movie without actors', async () => {
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

      mockMoviesRepository.create.mockReturnValue(mockMovie);
      mockMoviesRepository.save.mockResolvedValue(mockMovie);

      const result = await service.create(createMovieDto);

      expect(mockMoviesRepository.create).toHaveBeenCalledWith(createMovieDto);
      expect(mockMoviesRepository.save).toHaveBeenCalledWith(mockMovie);
      expect(result).toEqual(mockMovie);
    });

    it('should create a movie with actors', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'Test Movie',
        description: 'Test Description',
        releaseYear: 2023,
        genre: 'Action',
        actorIds: [1, 2],
      };

      const mockActors = [
        { id: 1, name: 'Actor 1' },
        { id: 2, name: 'Actor 2' },
      ];

      const mockMovie = {
        id: 1,
        title: createMovieDto.title,
        description: createMovieDto.description,
        releaseYear: createMovieDto.releaseYear,
        genre: createMovieDto.genre,
        actors: mockActors,
        ratings: [],
        averageRating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMoviesRepository.create.mockReturnValue(mockMovie);
      mockMoviesRepository.save.mockResolvedValue(mockMovie);
      mockActorsRepository.findBy.mockResolvedValue(mockActors);

      const result = await service.create(createMovieDto);

      expect(mockActorsRepository.findBy).toHaveBeenCalledWith({ id: In([1, 2]) });
      expect(mockMoviesRepository.create).toHaveBeenCalledWith(createMovieDto);
      expect(mockMoviesRepository.save).toHaveBeenCalledWith(mockMovie);
      expect(result).toEqual(mockMovie);
    });
  });

  describe('findAll', () => {
    it('should return all movies with relations', async () => {
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

      mockMoviesRepository.find.mockResolvedValue(mockMovies);

      const result = await service.findAll();

      expect(mockMoviesRepository.find).toHaveBeenCalledWith({
        relations: ['actors', 'ratings'],
      });
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

      mockMoviesRepository.findOne.mockResolvedValue(mockMovie);

      const result = await service.findOne(1);

      expect(mockMoviesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['actors', 'ratings'],
      });
      expect(result).toEqual(mockMovie);
    });

    it('should throw NotFoundException when movie not found', async () => {
      mockMoviesRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockMoviesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['actors', 'ratings'],
      });
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

      mockMoviesRepository.find.mockResolvedValue(mockMovies);

      const result = await service.search(searchDto);

      expect(mockMoviesRepository.find).toHaveBeenCalledWith({
        where: { title: expect.any(Object) },
        relations: ['actors', 'ratings'],
      });
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

      mockMoviesRepository.find.mockResolvedValue(mockMovies);

      const result = await service.search(searchDto);

      expect(mockMoviesRepository.find).toHaveBeenCalledWith({
        where: { genre: expect.any(Object) },
        relations: ['actors', 'ratings'],
      });
      expect(result).toEqual(mockMovies);
    });

    it('should search movies by both title and genre', async () => {
      const searchDto: SearchMovieDto = { title: 'Test', genre: 'Action' };
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

      mockMoviesRepository.find.mockResolvedValue(mockMovies);

      const result = await service.search(searchDto);

      expect(mockMoviesRepository.find).toHaveBeenCalledWith({
        where: { title: expect.any(Object), genre: expect.any(Object) },
        relations: ['actors', 'ratings'],
      });
      expect(result).toEqual(mockMovies);
    });

    it('should return all movies when no search criteria provided', async () => {
      const searchDto: SearchMovieDto = {};
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

      mockMoviesRepository.find.mockResolvedValue(mockMovies);

      const result = await service.search(searchDto);

      expect(mockMoviesRepository.find).toHaveBeenCalledWith({
        where: {},
        relations: ['actors', 'ratings'],
      });
      expect(result).toEqual(mockMovies);
    });
  });

  describe('update', () => {
    it('should update a movie without actors', async () => {
      const updateMovieDto: UpdateMovieDto = {
        title: 'Updated Movie',
        description: 'Updated Description',
      };

      const existingMovie = {
        id: 1,
        title: 'Original Movie',
        description: 'Original Description',
        releaseYear: 2023,
        genre: 'Action',
        actors: [],
        ratings: [],
        averageRating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedMovie = {
        ...existingMovie,
        ...updateMovieDto,
      };

      mockMoviesRepository.findOne.mockResolvedValue(existingMovie);
      mockMoviesRepository.save.mockResolvedValue(updatedMovie);

      const result = await service.update(1, updateMovieDto);

      expect(mockMoviesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['actors', 'ratings'],
      });
      expect(mockMoviesRepository.save).toHaveBeenCalledWith(updatedMovie);
      expect(result).toEqual(updatedMovie);
    });

    it('should update a movie with actors', async () => {
      const updateMovieDto: UpdateMovieDto = {
        title: 'Updated Movie',
        actorIds: [1, 2],
      };

      const existingMovie = {
        id: 1,
        title: 'Original Movie',
        description: 'Original Description',
        releaseYear: 2023,
        genre: 'Action',
        actors: [],
        ratings: [],
        averageRating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockActors = [
        { id: 1, name: 'Actor 1' },
        { id: 2, name: 'Actor 2' },
      ];

      const updatedMovie = {
        ...existingMovie,
        title: updateMovieDto.title,
        actors: mockActors,
        actorIds: updateMovieDto.actorIds,
      };

      mockMoviesRepository.findOne.mockResolvedValue(existingMovie);
      mockMoviesRepository.save.mockResolvedValue(updatedMovie);
      mockActorsRepository.findBy.mockResolvedValue(mockActors);

      const result = await service.update(1, updateMovieDto);

      expect(mockActorsRepository.findBy).toHaveBeenCalledWith({ id: In([1, 2]) });
      expect(mockMoviesRepository.save).toHaveBeenCalledWith(updatedMovie);
      expect(result).toEqual(updatedMovie);
    });

    it('should throw NotFoundException when movie not found', async () => {
      const updateMovieDto: UpdateMovieDto = { title: 'Updated Movie' };

      mockMoviesRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateMovieDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a movie', async () => {
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

      mockMoviesRepository.findOne.mockResolvedValue(mockMovie);
      mockMoviesRepository.remove.mockResolvedValue(mockMovie);

      await service.remove(1);

      expect(mockMoviesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['actors', 'ratings'],
      });
      expect(mockMoviesRepository.remove).toHaveBeenCalledWith(mockMovie);
    });

    it('should throw NotFoundException when movie not found', async () => {
      mockMoviesRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getActorsByMovie', () => {
    it('should return actors for a movie', async () => {
      const mockActors = [
        { id: 1, name: 'Actor 1' },
        { id: 2, name: 'Actor 2' },
      ];

      const mockMovie = {
        id: 1,
        title: 'Test Movie',
        description: 'Test Description',
        releaseYear: 2023,
        genre: 'Action',
        actors: mockActors,
        ratings: [],
        averageRating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMoviesRepository.findOne.mockResolvedValue(mockMovie);

      const result = await service.getActorsByMovie(1);

      expect(mockMoviesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['actors', 'ratings'],
      });
      expect(result).toEqual(mockActors);
    });

    it('should throw NotFoundException when movie not found', async () => {
      mockMoviesRepository.findOne.mockResolvedValue(null);

      await expect(service.getActorsByMovie(999)).rejects.toThrow(NotFoundException);
    });
  });
}); 