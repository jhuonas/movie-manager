import { Test, TestingModule } from '@nestjs/testing';
import { ActorsController } from './actors.controller';
import { ActorsService } from './actors.service';
import { CreateActorDto, UpdateActorDto, SearchActorDto } from '../dto/actor.dto';
import { NotFoundException } from '@nestjs/common';

describe('ActorsController', () => {
  let controller: ActorsController;
  let service: ActorsService;

  const mockActorsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    search: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getMoviesByActor: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActorsController],
      providers: [
        {
          provide: ActorsService,
          useValue: mockActorsService,
        },
      ],
    }).compile();

    controller = module.get<ActorsController>(ActorsController);
    service = module.get<ActorsService>(ActorsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an actor', async () => {
      const createActorDto: CreateActorDto = {
        name: 'Test Actor',
        birthDate: '1990-01-01',
        nationality: 'American',
        biography: 'Test biography',
      };

      const mockActor = {
        id: 1,
        name: createActorDto.name,
        birthDate: new Date(createActorDto.birthDate),
        nationality: createActorDto.nationality,
        biography: createActorDto.biography,
        movies: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockActorsService.create.mockResolvedValue(mockActor);

      const result = await controller.create(createActorDto);

      expect(service.create).toHaveBeenCalledWith(createActorDto);
      expect(result).toEqual(mockActor);
    });
  });

  describe('findAll', () => {
    it('should return all actors', async () => {
      const mockActors = [
        {
          id: 1,
          name: 'Actor 1',
          birthDate: new Date('1990-01-01'),
          nationality: 'American',
          biography: 'Biography 1',
          movies: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Actor 2',
          birthDate: new Date('1985-05-15'),
          nationality: 'British',
          biography: 'Biography 2',
          movies: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockActorsService.findAll.mockResolvedValue(mockActors);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockActors);
    });
  });

  describe('search', () => {
    it('should search actors by name', async () => {
      const searchDto: SearchActorDto = { name: 'Test' };
      const mockActors = [
        {
          id: 1,
          name: 'Test Actor',
          birthDate: new Date('1990-01-01'),
          nationality: 'American',
          biography: 'Test biography',
          movies: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockActorsService.search.mockResolvedValue(mockActors);

      const result = await controller.search(searchDto);

      expect(service.search).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual(mockActors);
    });

    it('should search actors by nationality', async () => {
      const searchDto: SearchActorDto = { nationality: 'American' };
      const mockActors = [
        {
          id: 1,
          name: 'Test Actor',
          birthDate: new Date('1990-01-01'),
          nationality: 'American',
          biography: 'Test biography',
          movies: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockActorsService.search.mockResolvedValue(mockActors);

      const result = await controller.search(searchDto);

      expect(service.search).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual(mockActors);
    });
  });

  describe('findOne', () => {
    it('should return an actor by id', async () => {
      const mockActor = {
        id: 1,
        name: 'Test Actor',
        birthDate: new Date('1990-01-01'),
        nationality: 'American',
        biography: 'Test biography',
        movies: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockActorsService.findOne.mockResolvedValue(mockActor);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockActor);
    });

    it('should throw NotFoundException when actor not found', async () => {
      mockActorsService.findOne.mockRejectedValue(new NotFoundException('Actor with ID 999 not found'));

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('getMoviesByActor', () => {
    it('should return movies for an actor', async () => {
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

      const mockActor = {
        id: 1,
        name: 'Test Actor',
        birthDate: new Date('1990-01-01'),
        nationality: 'American',
        biography: 'Test biography',
        movies: mockMovies,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockActorsService.getMoviesByActor.mockResolvedValue(mockActor);

      const result = await controller.getMoviesByActor('1');

      expect(service.getMoviesByActor).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockActor);
    });

    it('should throw NotFoundException when actor not found', async () => {
      mockActorsService.getMoviesByActor.mockRejectedValue(new NotFoundException('Actor with ID 999 not found'));

      await expect(controller.getMoviesByActor('999')).rejects.toThrow(NotFoundException);
      expect(service.getMoviesByActor).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    it('should update an actor', async () => {
      const updateActorDto: UpdateActorDto = {
        name: 'Updated Actor',
        biography: 'Updated biography',
      };

      const mockActor = {
        id: 1,
        name: 'Updated Actor',
        birthDate: new Date('1990-01-01'),
        nationality: 'American',
        biography: 'Updated biography',
        movies: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockActorsService.update.mockResolvedValue(mockActor);

      const result = await controller.update('1', updateActorDto);

      expect(service.update).toHaveBeenCalledWith(1, updateActorDto);
      expect(result).toEqual(mockActor);
    });

    it('should throw NotFoundException when actor not found', async () => {
      const updateActorDto: UpdateActorDto = { name: 'Updated Actor' };

      mockActorsService.update.mockRejectedValue(new NotFoundException('Actor with ID 999 not found'));

      await expect(controller.update('999', updateActorDto)).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(999, updateActorDto);
    });
  });

  describe('remove', () => {
    it('should remove an actor', async () => {
      mockActorsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when actor not found', async () => {
      mockActorsService.remove.mockRejectedValue(new NotFoundException('Actor with ID 999 not found'));

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(999);
    });
  });
}); 