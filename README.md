# Movie Manager

Complete movie, actor, and rating management system built with NestJS (backend) and Next.js (frontend).

## 🏗️ Architecture

- **Backend**: NestJS + TypeScript + TypeORM + PostgreSQL
- **Frontend**: Next.js + TypeScript + TailwindCSS
- **Database**: PostgreSQL (Docker)
- **Documentation**: Swagger/OpenAPI

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- Git

### 1. Clone and setup
```bash
git clone git@github.com:jhuonas/movie-manager.git
cd movie-manager
```

### 2. Start the environment
```bash
# Start all services
docker-compose up -d
```

### 3. Access the application
- **API**: http://localhost:3001/api
- **Frontend**: http://localhost:3000

## 📁 Project Structure

```
movie-manager/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── entities/        # TypeORM entities
│   │   ├── movies/          # Movies module
│   │   ├── actors/          # Actors module
│   │   ├── ratings/         # Ratings module
│   │   └── seeds/           # Sample data
├── frontend/                # Next.js application
└── docker-compose.yml       # Docker configuration
```

## 🔧 Useful Commands

### Development
```bash
# Backend
cd backend
npm run start:dev          # Development mode
npm run seed               # Populate database with data

# Docker
docker-compose up -d       # Start services
docker-compose down        # Stop services
docker-compose logs -f     # View logs
```

## 🔐 Authentication

Default token for modification operations:
```
your-secret-token-here
```

Usage example:
```bash
curl -X POST http://localhost:3001/movies \
  -H "Authorization: Bearer your-secret-token-here" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Movie","description":"Description","releaseYear":2024,"genre":"Action"}'
```

## 📚 Main Endpoints

### Movies
- `GET /movies` - List movies
- `GET /movies/:id` - Get movie by ID
- `POST /movies` - Create movie (authenticated)
- `PATCH /movies/:id` - Update movie (authenticated)
- `DELETE /movies/:id` - Delete movie (authenticated)

### Actors
- `GET /actors` - List actors
- `GET /actors/:id` - Get actor by ID
- `POST /actors` - Create actor (authenticated)
- `PATCH /actors/:id` - Update actor (authenticated)
- `DELETE /actors/:id` - Delete actor (authenticated)

### Ratings
- `GET /ratings` - List ratings
- `GET /ratings/movie/:movieId` - Get ratings for a movie
- `POST /ratings` - Create rating (authenticated)
- `PATCH /ratings/:id` - Update rating (authenticated)
- `DELETE /ratings/:id` - Delete rating (authenticated)

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3001
API_SECRET=your-secret-token-here
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=moviesdb
```

## 🧪 Testing

```bash
cd backend
npm run test              # Unit tests
npm run test:e2e          # End-to-end tests
```

## 🚀 Next Steps

1. ✅ Complete Backend API
2. ✅ Next.js Frontend
3. ✅ Automated Tests
4. 🔄 CI/CD Pipeline
5. 🔄 Production Deployment

## 🚀 Future Features Ideas

### User Management & Authentication
- User registration and login system
- Role-based access control (Admin, User, Moderator)
- JWT token authentication
- Password reset functionality
- User profiles with watchlists

### Enhanced Features
- Movie recommendations and advanced search
- User reviews and social features
- Real-time notifications
- Mobile app support
- Multi-language support

## 📄 License

This project was developed as a technical test. 