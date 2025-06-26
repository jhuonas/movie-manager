# Movie Manager

Complete movie, actor, and rating management system built with NestJS (backend) and Next.js (frontend).

## 🏗️ Architecture

- **Backend**: NestJS + TypeScript + TypeORM + PostgreSQL
- **Frontend**: Next.js + TypeScript + TailwindCSS (to be developed)
- **Database**: PostgreSQL (Docker)
- **Documentation**: Swagger/OpenAPI

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

### 1. Clone the repository

```bash
git clone git@github.com:jhuonas/movie-manager.git
cd movie-manager
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Add API_SECRET to your .env file
```

### 3. Start development environment

#### Option A: Automated script
```bash
# From project root
./scripts/dev.sh
```

#### Option B: Manual
```bash
# Start PostgreSQL
npm run db:start

# Wait for PostgreSQL to be ready, then start backend
npm run start:dev
```

### 4. Seed the database with sample data

```bash
# After backend is running
npm run seed
```

### 5. Access API documentation

```
http://localhost:3001/api
```

## 📁 Project Structure

```
movie-manager/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── entities/        # TypeORM entities
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── movies/         # Movies module
│   │   ├── actors/         # Actors module
│   │   ├── ratings/        # Ratings module
│   │   ├── seeds/          # Sample data
│   │   └── guards/         # Authentication
│   ├── Dockerfile
│   └── package.json
├── frontend/               # Next.js application (to be developed)
├── docker-compose.yml      # Docker configuration
├── init-scripts/           # Database initialization scripts
└── scripts/                # Development scripts
```

## 🔧 Useful Scripts

### Backend

```bash
# Development
npm run start:dev          # Start in development mode
npm run build              # Build the project
npm run lint               # Code linting

# Database
npm run db:start           # Start PostgreSQL
npm run db:stop            # Stop PostgreSQL
npm run db:reset           # Complete database reset

# Data
npm run seed               # Seed database with sample data

# Docker
npm run docker:build       # Build Docker image
npm run docker:run         # Run container
```

### Docker Compose

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Complete reset
docker-compose down -v && docker-compose up -d
```

## 🔐 Authentication

The API uses a simple token to protect modification operations:

```bash
# Default token (configurable via API_SECRET)
your-secret-token-here

# Usage example
curl -X POST http://localhost:3001/movies \
  -H "Authorization: Bearer your-secret-token-here" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Movie","description":"Description","releaseYear":2024,"genre":"Action"}'
```

## 📚 API Endpoints

### Movies
- `GET /movies` - List all movies
- `GET /movies/search` - Search movies
- `GET /movies/:id` - Get movie by ID
- `GET /movies/:id/actors` - Get actors in a movie
- `POST /movies` - Create movie (authenticated)
- `PATCH /movies/:id` - Update movie (authenticated)
- `DELETE /movies/:id` - Delete movie (authenticated)

### Actors
- `GET /actors` - List all actors
- `GET /actors/search` - Search actors
- `GET /actors/:id` - Get actor by ID
- `GET /actors/:id/movies` - Get movies by actor
- `POST /actors` - Create actor (authenticated)
- `PATCH /actors/:id` - Update actor (authenticated)
- `DELETE /actors/:id` - Delete actor (authenticated)

### Ratings
- `GET /ratings` - List all ratings
- `GET /ratings/:id` - Get rating by ID
- `GET /ratings/movie/:movieId` - Get ratings for a movie
- `POST /ratings` - Create rating (authenticated)
- `PATCH /ratings/:id` - Update rating (authenticated)
- `DELETE /ratings/:id` - Delete rating (authenticated)

### Seeds
- `POST /seeds` - Seed database with sample data (authenticated)

## 🐳 Docker

### Development
```bash
# Start only PostgreSQL
docker-compose up -d postgres

# Start backend locally
npm run start:dev
```

### Production
```bash
# Build and run everything
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

## 📝 Environment Variables

Create a `.env` file in the `backend/` directory:

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

## 🚀 Next Steps

1. ✅ Complete Backend API
2. 🔄 Next.js Frontend
3. 🔄 Automated Tests
4. 🔄 CI/CD Pipeline
5. 🔄 Production Deployment

## 📄 License

This project was developed as a technical test. 