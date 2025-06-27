import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ActorsService } from './actors.service';
import { Actor } from '../entities/actor.entity';
import { CreateActorDto, UpdateActorDto, SearchActorDto } from '../dto/actor.dto';

describe('ActorsService', () => {
  let service: ActorsService;
  let actorsRepository: Repository<Actor>;

  const mockActorsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActorsService,
        {
          provide: getRepositoryToken(Actor),
          useValue: mockActorsRepository,
        },
      ],
    }).compile();

    service = module.get<ActorsService>(ActorsService);
    actorsRepository = module.get<Repository<Actor>>(getRepositoryToken(Actor));
  });

  afterEach(() => {
    jest.clearAllMocks();
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

      mockActorsRepository.create.mockReturnValue(mockActor);
      mockActorsRepository.save.mockResolvedValue(mockActor);

      const result = await service.create(createActorDto);

      expect(mockActorsRepository.create).toHaveBeenCalledWith({
        ...createActorDto,
        birthDate: new Date(createActorDto.birthDate),
      });
      expect(mockActorsRepository.save).toHaveBeenCalledWith(mockActor);
      expect(result).toEqual(mockActor);
    });
  });

  describe('findAll', () => {
    it('should return all actors with relations', async () => {
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

      mockActorsRepository.find.mockResolvedValue(mockActors);

      const result = await service.findAll();

      expect(mockActorsRepository.find).toHaveBeenCalledWith({
        relations: ['movies'],
      });
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

      mockActorsRepository.findOne.mockResolvedValue(mockActor);

      const result = await service.findOne(1);

      expect(mockActorsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['movies'],
      });
      expect(result).toEqual(mockActor);
    });

    it('should throw NotFoundException when actor not found', async () => {
      mockActorsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockActorsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['movies'],
      });
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

      mockActorsRepository.find.mockResolvedValue(mockActors);

      const result = await service.search(searchDto);

      expect(mockActorsRepository.find).toHaveBeenCalledWith({
        where: { name: expect.any(Object) },
        relations: ['movies'],
      });
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

      mockActorsRepository.find.mockResolvedValue(mockActors);

      const result = await service.search(searchDto);

      expect(mockActorsRepository.find).toHaveBeenCalledWith({
        where: { nationality: expect.any(Object) },
        relations: ['movies'],
      });
      expect(result).toEqual(mockActors);
    });

    it('should search actors by both name and nationality', async () => {
      const searchDto: SearchActorDto = { name: 'Test', nationality: 'American' };
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

      mockActorsRepository.find.mockResolvedValue(mockActors);

      const result = await service.search(searchDto);

      expect(mockActorsRepository.find).toHaveBeenCalledWith({
        where: { name: expect.any(Object), nationality: expect.any(Object) },
        relations: ['movies'],
      });
      expect(result).toEqual(mockActors);
    });

    it('should return all actors when no search criteria provided', async () => {
      const searchDto: SearchActorDto = {};
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

      mockActorsRepository.find.mockResolvedValue(mockActors);

      const result = await service.search(searchDto);

      expect(mockActorsRepository.find).toHaveBeenCalledWith({
        where: {},
        relations: ['movies'],
      });
      expect(result).toEqual(mockActors);
    });
  });

  describe('update', () => {
    it('should update an actor without birthDate', async () => {
      const updateActorDto: UpdateActorDto = {
        name: 'Updated Actor',
        biography: 'Updated biography',
      };

      const existingActor = {
        id: 1,
        name: 'Original Actor',
        birthDate: new Date('1990-01-01'),
        nationality: 'American',
        biography: 'Original biography',
        movies: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedActor = {
        ...existingActor,
        ...updateActorDto,
      };

      mockActorsRepository.findOne.mockResolvedValue(existingActor);
      mockActorsRepository.save.mockResolvedValue(updatedActor);

      const result = await service.update(1, updateActorDto);

      expect(mockActorsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['movies'],
      });
      expect(mockActorsRepository.save).toHaveBeenCalledWith(updatedActor);
      expect(result).toEqual(updatedActor);
    });

    it('should update an actor with birthDate', async () => {
      const updateActorDto: UpdateActorDto = {
        name: 'Updated Actor',
        birthDate: '1985-05-15',
      };

      const existingActor = {
        id: 1,
        name: 'Original Actor',
        birthDate: new Date('1990-01-01'),
        nationality: 'American',
        biography: 'Original biography',
        movies: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedActor = {
        ...existingActor,
        name: updateActorDto.name,
        birthDate: updateActorDto.birthDate ? new Date(updateActorDto.birthDate) : existingActor.birthDate,
      };

      mockActorsRepository.findOne.mockResolvedValue(existingActor);
      mockActorsRepository.save.mockResolvedValue(updatedActor);

      const result = await service.update(1, updateActorDto);

      expect(mockActorsRepository.save).toHaveBeenCalledWith(updatedActor);
      expect(result).toEqual(updatedActor);
    });

    it('should throw NotFoundException when actor not found', async () => {
      const updateActorDto: UpdateActorDto = { name: 'Updated Actor' };

      mockActorsRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateActorDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an actor', async () => {
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

      mockActorsRepository.findOne.mockResolvedValue(mockActor);
      mockActorsRepository.remove.mockResolvedValue(mockActor);

      await service.remove(1);

      expect(mockActorsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['movies'],
      });
      expect(mockActorsRepository.remove).toHaveBeenCalledWith(mockActor);
    });

    it('should throw NotFoundException when actor not found', async () => {
      mockActorsRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getMoviesByActor', () => {
    it('should return actor with movies', async () => {
      const mockMovies = [
        { id: 1, title: 'Movie 1' },
        { id: 2, title: 'Movie 2' },
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

      mockActorsRepository.findOne.mockResolvedValue(mockActor);

      const result = await service.getMoviesByActor(1);

      expect(mockActorsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['movies'],
      });
      expect(result).toEqual(mockActor);
    });

    it('should throw NotFoundException when actor not found', async () => {
      mockActorsRepository.findOne.mockResolvedValue(null);

      await expect(service.getMoviesByActor(999)).rejects.toThrow(NotFoundException);
    });
  });
}); 