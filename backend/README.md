# Movie Manager Backend

NestJS backend API for managing movies, actors, and ratings with TypeScript, TypeORM, and PostgreSQL.

## 🏗️ Architecture

- **Framework**: NestJS with TypeScript
- **ORM**: TypeORM with PostgreSQL
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Authentication**: Custom token-based guard
- **Database**: PostgreSQL (Docker)

## 📁 Project Structure

### Modules Created

1. **Movies Module** (`/src/movies/`)
   - Entity: `Movie`
   - Controller: `MoviesController`
   - Service: `MoviesService`
   - DTOs: `CreateMovieDto`, `UpdateMovieDto`, `SearchMovieDto`

2. **Actors Module** (`/src/actors/`)
   - Entity: `Actor`
   - Controller: `ActorsController`
   - Service: `ActorsService`
   - DTOs: `CreateActorDto`, `UpdateActorDto`, `SearchActorDto`

3. **Ratings Module** (`/src/ratings/`)
   - Entity: `Rating`
   - Controller: `RatingsController`
   - Service: `RatingsService`
   - DTOs: `CreateRatingDto`, `UpdateRatingDto`

4. **Seeds Module** (`/src/seeds/`)
   - Service: `SeedService`
   - Controller: `SeedsController`

### Entities

#### Movie
- `id`: Unique movie ID
- `title`: Movie title
- `description`: Movie description
- `releaseYear`: Release year
- `genre`: Movie genre
- `averageRating`: Average rating (auto-calculated)
- `actors`: Many-to-many relationship with Actor
- `ratings`: One-to-many relationship with Rating
- `createdAt`: Creation timestamp
- `updatedAt`: Update timestamp

#### Actor
- `id`: Unique actor ID
- `name`: Actor name
- `biography`: Actor biography
- `birthDate`: Birth date
- `nationality`: Nationality
- `movies`: Many-to-many relationship with Movie
- `createdAt`: Creation timestamp
- `updatedAt`: Update timestamp

#### Rating
- `id`: Unique rating ID
- `score`: Rating score (0.5 to 5.0)
- `comment`: Rating comment
- `reviewerName`: Reviewer name
- `movie`: Many-to-one relationship with Movie
- `createdAt`: Creation timestamp
- `updatedAt`: Update timestamp

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL (Docker or local)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Configure environment variables
# Add API_SECRET to your .env file

# Start development server
npm run start:dev
```

### Database Setup

```bash
# Start PostgreSQL (if using Docker)
npm run db:start

# Wait for database to be ready, then start the application
npm run start:dev
```

### Seed Database

```bash
# After application is running
npm run seed
```

## 📚 API Endpoints

### Movies
- `GET /movies` - List all movies
- `GET /movies/search` - Search movies by title or genre
- `GET /movies/:id` - Get movie by ID
- `GET /movies/:id/actors` - Get actors in a movie
- `POST /movies` - Create new movie (authenticated)
- `PATCH /movies/:id` - Update movie (authenticated)
- `DELETE /movies/:id` - Delete movie (authenticated)

### Actors
- `GET /actors` - List all actors
- `GET /actors/search` - Search actors by name or nationality
- `GET /actors/:id` - Get actor by ID
- `GET /actors/:id/movies` - Get movies by actor
- `POST /actors` - Create new actor (authenticated)
- `PATCH /actors/:id` - Update actor (authenticated)
- `DELETE /actors/:id` - Delete actor (authenticated)

### Ratings
- `GET /ratings` - List all ratings
- `GET /ratings/:id` - Get rating by ID
- `GET /ratings/movie/:movieId` - Get ratings for a movie
- `POST /ratings` - Create new rating (authenticated)
- `PATCH /ratings/:id` - Update rating (authenticated)
- `DELETE /ratings/:id` - Delete rating (authenticated)

### Seeds
- `POST /seeds` - Seed database with sample data (authenticated)

## 🔐 Authentication

The API uses a simple token-based authentication for modification operations. The token must be sent in the `Authorization` header as `Bearer <token>`.

Default token: `your-secret-token-here`

### Example Usage

```bash
curl -X POST http://localhost:3001/movies \
  -H "Authorization: Bearer your-secret-token-here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Matrix",
    "description": "A computer hacker learns from mysterious rebels about the true nature of his reality.",
    "releaseYear": 1999,
    "genre": "Sci-Fi"
  }'
```

## 🔧 Available Scripts

```bash
# Development
npm run start:dev          # Start in development mode
npm run start:debug        # Start in debug mode
npm run build              # Build the project
npm run start:prod         # Start in production mode

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:e2e           # Run end-to-end tests

# Database
npm run db:start           # Start PostgreSQL
npm run db:stop            # Stop PostgreSQL
npm run db:reset           # Reset database

# Data
npm run seed               # Seed database with sample data

# Docker
npm run docker:build       # Build Docker image
npm run docker:run         # Run Docker container
```

## 📝 Environment Variables

Create a `.env` file in the backend directory:

```env
# API Configuration
PORT=3001
API_SECRET=your-secret-token-here

# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=moviesdb
```

## 🐳 Docker

### Development
```bash
# Build image
docker build -t movie-manager-backend .

# Run container
docker run -p 3001:3001 --env-file .env movie-manager-backend
```

### Production
```bash
# Use docker-compose for full stack
docker-compose up -d
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# Tests with coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## 📊 API Documentation

Once the application is running, access the Swagger documentation at:

```
http://localhost:3001/api
```

## 🔍 Features Implemented

✅ Complete CRUD operations for Movies, Actors, and Ratings
✅ Search functionality for Movies and Actors
✅ Entity relationships (Movie ↔ Actor, Movie ↔ Rating)
✅ Endpoint to get actors in a movie
✅ Endpoint to get movies by actor
✅ Token-based authentication for modification operations
✅ Data validation with class-validator
✅ API documentation with Swagger
✅ Database seeding with sample data
✅ Automatic average rating calculation
✅ Error handling and proper HTTP status codes
✅ CORS enabled
✅ TypeScript with strict typing
✅ Docker support

## 🚀 Next Steps

1. ✅ Backend API complete
2. 🔄 Frontend development
3. 🔄 Unit and integration tests
4. 🔄 CI/CD pipeline
5. 🔄 Performance optimization
6. 🔄 Production deployment

## 📄 License

This project was developed as a technical test.
