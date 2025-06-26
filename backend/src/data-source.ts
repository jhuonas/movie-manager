import { DataSource } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { Actor } from './entities/actor.entity';
import { Rating } from './entities/rating.entity';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Movie, Actor, Rating],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
});

export default AppDataSource; 