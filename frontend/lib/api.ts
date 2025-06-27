import axios from 'axios';
import { getAuthToken, isTokenConfigured } from './auth';

const API_BASE_URL = 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (isTokenConfigured()) {
      config.headers.Authorization = `Bearer your-secret-token-here`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);

    if (error.response?.status === 401) {
      console.error('Erro de autenticação: Token inválido ou ausente');
    }

    return Promise.reject(error);
  }
);

export interface Movie {
  id: number;
  title: string;
  description: string;
  releaseYear: number;
  genre: string;
  averageRating: string;
  actors: Actor[];
  ratings: Rating[];
  createdAt: string;
  updatedAt: string;
}

export interface Actor {
  id: number;
  name: string;
  biography: string;
  birthDate: string;
  nationality: string;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: number;
  score: string;
  comment: string;
  reviewerName: string;
  movieId?: number;
  movieTitle?: string;
  movieReleaseYear?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMovieDto {
  title: string;
  description: string;
  releaseYear: number;
  genre: string;
  actorIds?: number[];
}

export interface UpdateMovieDto {
  title?: string;
  description?: string;
  releaseYear?: number;
  genre?: string;
  actorIds?: number[];
}

export interface CreateActorDto {
  name: string;
  biography: string;
  birthDate: string;
  nationality: string;
}

export interface UpdateActorDto {
  name?: string;
  biography?: string;
  birthDate?: string;
  nationality?: string;
}

export interface CreateRatingDto {
  score: number;
  comment: string;
  reviewerName: string;
  movieId: number;
}

export interface UpdateRatingDto {
  score: number;
  comment: string;
  reviewerName: string;
}

export const moviesApi = {
  getAll: () => api.get<Movie[]>('/movies'),
  getById: (id: number) => api.get<Movie>(`/movies/${id}`),
  search: (params: { title?: string; genre?: string }) =>
    api.get<Movie[]>('/movies/search', { params }),
  create: (data: CreateMovieDto) => api.post<Movie>('/movies', data),
  update: (id: number, data: UpdateMovieDto) => api.patch<Movie>(`/movies/${id}`, data),
  delete: (id: number) => api.delete(`/movies/${id}`),
  getActors: (id: number) => api.get<Actor[]>(`/movies/${id}/actors`),
};

export const actorsApi = {
  getAll: () => api.get<Actor[]>('/actors'),
  getById: (id: number) => api.get<Actor>(`/actors/${id}`),
  search: (params: { name?: string; nationality?: string }) =>
    api.get<Actor[]>('/actors/search', { params }),
  create: (data: CreateActorDto) => api.post<Actor>('/actors', data),
  update: (id: number, data: UpdateActorDto) => api.patch<Actor>(`/actors/${id}`, data),
  delete: (id: number) => api.delete(`/actors/${id}`),
  getMovies: (id: number) => api.get<Movie[]>(`/actors/${id}/movies`),
};

export const ratingsApi = {
  getAll: () => api.get<Rating[]>('/ratings'),
  getById: (id: number) => api.get<Rating>(`/ratings/${id}`),
  getByMovie: (movieId: number) => api.get<Rating[]>(`/ratings/movie/${movieId}`),
  create: (data: CreateRatingDto) => api.post<Rating>('/ratings', data),
  update: (id: number, data: UpdateRatingDto) => api.patch<Rating>(`/ratings/${id}`, data),
  delete: (id: number) => api.delete(`/ratings/${id}`),
}; 