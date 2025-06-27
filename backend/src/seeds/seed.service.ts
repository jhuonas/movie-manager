import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { Actor } from '../entities/actor.entity';
import { Rating } from '../entities/rating.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @InjectRepository(Actor)
    private actorsRepository: Repository<Actor>,
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
    private entityManager: EntityManager,
  ) { }

  async seed() {
    await this.entityManager.query('TRUNCATE TABLE "rating" CASCADE');
    await this.entityManager.query('TRUNCATE TABLE "movie_actors" CASCADE');
    await this.entityManager.query('TRUNCATE TABLE "movie" CASCADE');
    await this.entityManager.query('TRUNCATE TABLE "actor" CASCADE');

    const actors = await this.actorsRepository.save([
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

    const movies = await this.moviesRepository.save([
      {
        title: 'Forrest Gump',
        description: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
        releaseYear: 1994,
        genre: 'Drama',
        actors: [actors[0]],
      },
      {
        title: 'Titanic',
        description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
        releaseYear: 1997,
        genre: 'Romance',
        actors: [actors[1]],
      },
      {
        title: 'The Devil Wears Prada',
        description: 'A smart but sensible new graduate lands a job as an assistant to Miranda Priestly, the demanding editor-in-chief of a high fashion magazine.',
        releaseYear: 2006,
        genre: 'Comedy',
        actors: [actors[2]],
      },
      {
        title: 'Fight Club',
        description: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.',
        releaseYear: 1999,
        genre: 'Drama',
        actors: [actors[3]],
      },
      {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        description: 'An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world.',
        releaseYear: 2001,
        genre: 'Fantasy',
        actors: [actors[4]],
      },
    ]);

    await this.ratingsRepository.save([
      {
        score: 4.5,
        comment: 'Amazing performance by Tom Hanks!',
        reviewerName: 'MovieFan1',
        movie: movies[0],
      },
      {
        score: 4.0,
        comment: 'Great story and acting.',
        reviewerName: 'CinemaLover',
        movie: movies[0],
      },
      {
        score: 5.0,
        comment: 'Epic love story!',
        reviewerName: 'RomanceFan',
        movie: movies[1],
      },
      {
        score: 4.5,
        comment: 'Meryl Streep is brilliant!',
        reviewerName: 'DramaQueen',
        movie: movies[2],
      },
      {
        score: 4.8,
        comment: 'Mind-blowing plot twist!',
        reviewerName: 'ThrillerGuy',
        movie: movies[3],
      },
      {
        score: 4.2,
        comment: 'Magical adventure for all ages.',
        reviewerName: 'FantasyLover',
        movie: movies[4],
      },
    ]);

    console.log('Database seeded successfully!');
  }
} 