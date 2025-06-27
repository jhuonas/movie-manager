import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { SeedService } from './seed.service';
import { Movie } from '../entities/movie.entity';
import { Actor } from '../entities/actor.entity';
import { Rating } from '../entities/rating.entity';

describe('SeedService', () => {
  let service: SeedService;
  let moviesRepository: Repository<Movie>;
  let actorsRepository: Repository<Actor>;
  let ratingsRepository: Repository<Rating>;
  let entityManager: EntityManager;

  const mockMoviesRepository = {
    save: jest.fn(),
  };

  const mockActorsRepository = {
    save: jest.fn(),
  };

  const mockRatingsRepository = {
    save: jest.fn(),
  };

  const mockEntityManager = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMoviesRepository,
        },
        {
          provide: getRepositoryToken(Actor),
          useValue: mockActorsRepository,
        },
        {
          provide: getRepositoryToken(Rating),
          useValue: mockRatingsRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
    moviesRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    actorsRepository = module.get<Repository<Actor>>(getRepositoryToken(Actor));
    ratingsRepository = module.get<Repository<Rating>>(getRepositoryToken(Rating));
    entityManager = module.get<EntityManager>(EntityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('seed', () => {
    it('should seed the database with sample data', async () => {
      const mockActors = [
        {
          id: 1,
          name: 'Tom Hanks',
          biography: 'American actor and filmmaker known for both his comedic and dramatic roles.',
          birthDate: new Date('1956-07-09'),
          nationality: 'American',
        },
        {
          id: 2,
          name: 'Leonardo DiCaprio',
          biography: 'American actor, film producer, and environmentalist.',
          birthDate: new Date('1974-11-11'),
          nationality: 'American',
        },
        {
          id: 3,
          name: 'Meryl Streep',
          biography: 'American actress often described as the best actress of her generation.',
          birthDate: new Date('1949-06-22'),
          nationality: 'American',
        },
        {
          id: 4,
          name: 'Brad Pitt',
          biography: 'American actor and film producer.',
          birthDate: new Date('1963-12-18'),
          nationality: 'American',
        },
        {
          id: 5,
          name: 'Emma Watson',
          biography: 'English actress, model, and activist.',
          birthDate: new Date('1990-04-15'),
          nationality: 'British',
        },
      ];

      const mockMovies = [
        {
          id: 1,
          title: 'Forrest Gump',
          description: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
          releaseYear: 1994,
          genre: 'Drama',
          actors: [mockActors[0]],
        },
        {
          id: 2,
          title: 'Titanic',
          description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
          releaseYear: 1997,
          genre: 'Romance',
          actors: [mockActors[1]],
        },
        {
          id: 3,
          title: 'The Devil Wears Prada',
          description: 'A smart but sensible new graduate lands a job as an assistant to Miranda Priestly, the demanding editor-in-chief of a high fashion magazine.',
          releaseYear: 2006,
          genre: 'Comedy',
          actors: [mockActors[2]],
        },
        {
          id: 4,
          title: 'Fight Club',
          description: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.',
          releaseYear: 1999,
          genre: 'Drama',
          actors: [mockActors[3]],
        },
        {
          id: 5,
          title: 'Harry Potter and the Sorcerer\'s Stone',
          description: 'An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world.',
          releaseYear: 2001,
          genre: 'Fantasy',
          actors: [mockActors[4]],
        },
      ];

      const mockRatings = [
        {
          id: 1,
          score: 4.5,
          comment: 'Amazing performance by Tom Hanks!',
          reviewerName: 'MovieFan1',
          movie: mockMovies[0],
        },
        {
          id: 2,
          score: 4.0,
          comment: 'Great story and acting.',
          reviewerName: 'CinemaLover',
          movie: mockMovies[0],
        },
        {
          id: 3,
          score: 5.0,
          comment: 'Epic love story!',
          reviewerName: 'RomanceFan',
          movie: mockMovies[1],
        },
        {
          id: 4,
          score: 4.5,
          comment: 'Meryl Streep is brilliant!',
          reviewerName: 'DramaQueen',
          movie: mockMovies[2],
        },
        {
          id: 5,
          score: 4.8,
          comment: 'Mind-blowing plot twist!',
          reviewerName: 'ThrillerGuy',
          movie: mockMovies[3],
        },
        {
          id: 6,
          score: 4.2,
          comment: 'Magical adventure for all ages.',
          reviewerName: 'FantasyLover',
          movie: mockMovies[4],
        },
      ];

      mockEntityManager.query.mockResolvedValue([]);
      mockActorsRepository.save.mockResolvedValue(mockActors);
      mockMoviesRepository.save.mockResolvedValue(mockMovies);
      mockRatingsRepository.save.mockResolvedValue(mockRatings);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.seed();

      expect(mockEntityManager.query).toHaveBeenCalledWith('TRUNCATE TABLE "rating" CASCADE');
      expect(mockEntityManager.query).toHaveBeenCalledWith('TRUNCATE TABLE "movie_actors" CASCADE');
      expect(mockEntityManager.query).toHaveBeenCalledWith('TRUNCATE TABLE "movie" CASCADE');
      expect(mockEntityManager.query).toHaveBeenCalledWith('TRUNCATE TABLE "actor" CASCADE');

      expect(mockActorsRepository.save).toHaveBeenCalledWith([
        {
          name: 'Tom Hanks',
          biography: 'American actor and filmmaker known for both his comedic and dramatic roles.',
          birthDate: new Date('1956-07-09'),
          nationality: 'American',
        },
        {
          name: 'Leonardo DiCaprio',
          biography: 'American actor, film producer, and environmentalist.',
          birthDate: new Date('1974-11-11'),
          nationality: 'American',
        },
        {
          name: 'Meryl Streep',
          biography: 'American actress often described as the best actress of her generation.',
          birthDate: new Date('1949-06-22'),
          nationality: 'American',
        },
        {
          name: 'Brad Pitt',
          biography: 'American actor and film producer.',
          birthDate: new Date('1963-12-18'),
          nationality: 'American',
        },
        {
          name: 'Emma Watson',
          biography: 'English actress, model, and activist.',
          birthDate: new Date('1990-04-15'),
          nationality: 'British',
        },
      ]);

      expect(mockMoviesRepository.save).toHaveBeenCalledWith([
        {
          title: 'Forrest Gump',
          description: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
          releaseYear: 1994,
          genre: 'Drama',
          actors: [mockActors[0]],
        },
        {
          title: 'Titanic',
          description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
          releaseYear: 1997,
          genre: 'Romance',
          actors: [mockActors[1]],
        },
        {
          title: 'The Devil Wears Prada',
          description: 'A smart but sensible new graduate lands a job as an assistant to Miranda Priestly, the demanding editor-in-chief of a high fashion magazine.',
          releaseYear: 2006,
          genre: 'Comedy',
          actors: [mockActors[2]],
        },
        {
          title: 'Fight Club',
          description: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.',
          releaseYear: 1999,
          genre: 'Drama',
          actors: [mockActors[3]],
        },
        {
          title: 'Harry Potter and the Sorcerer\'s Stone',
          description: 'An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world.',
          releaseYear: 2001,
          genre: 'Fantasy',
          actors: [mockActors[4]],
        },
      ]);

      expect(mockRatingsRepository.save).toHaveBeenCalledWith([
        {
          score: 4.5,
          comment: 'Amazing performance by Tom Hanks!',
          reviewerName: 'MovieFan1',
          movie: mockMovies[0],
        },
        {
          score: 4.0,
          comment: 'Great story and acting.',
          reviewerName: 'CinemaLover',
          movie: mockMovies[0],
        },
        {
          score: 5.0,
          comment: 'Epic love story!',
          reviewerName: 'RomanceFan',
          movie: mockMovies[1],
        },
        {
          score: 4.5,
          comment: 'Meryl Streep is brilliant!',
          reviewerName: 'DramaQueen',
          movie: mockMovies[2],
        },
        {
          score: 4.8,
          comment: 'Mind-blowing plot twist!',
          reviewerName: 'ThrillerGuy',
          movie: mockMovies[3],
        },
        {
          score: 4.2,
          comment: 'Magical adventure for all ages.',
          reviewerName: 'FantasyLover',
          movie: mockMovies[4],
        },
      ]);

      expect(consoleSpy).toHaveBeenCalledWith('Database seeded successfully!');

      consoleSpy.mockRestore();
    });

    it('should handle errors during seeding', async () => {
      const error = new Error('Database connection failed');
      mockEntityManager.query.mockRejectedValue(error);

      await expect(service.seed()).rejects.toThrow('Database connection failed');
    });
  });
}); 