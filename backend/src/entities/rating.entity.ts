import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Movie } from './movie.entity';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  score: number;

  @Column()
  comment: string;

  @Column()
  reviewerName: string;

  @ManyToOne(() => Movie, movie => movie.ratings)
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
} 