import { render, screen } from '@testing-library/react';
import MovieTab from './MovieTab';

describe('MovieTab', () => {
  it('renderiza o título da aba de filmes e lista de filmes', () => {
    const movies = [
      {
        id: 1,
        title: 'Filme 1',
        description: 'Desc 1',
        releaseYear: 2020,
        genre: 'Ação',
        actors: [],
        ratings: [],
        averageRating: 4.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: 'Filme 2',
        description: 'Desc 2',
        releaseYear: 2021,
        genre: 'Drama',
        actors: [],
        ratings: [],
        averageRating: 4.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    render(
      <MovieTab
        movies={movies}
        setMovies={jest.fn()}
        loading={false}
        setError={jest.fn()}
        currentPage={1}
        setSelectedMovie={jest.fn()}
        isFormOpen={false}
        onFormClose={jest.fn()}
        onMovieDelete={jest.fn()}
        onMovieSelect={jest.fn()}
        onPageChange={jest.fn()}
        itemsPerPage={10}
        searchTerm=""
        onMovieFormOpen={jest.fn()}
      />
    );
    expect(screen.getByText(/movies/i)).toBeInTheDocument();
    expect(screen.getByText('Filme 1')).toBeInTheDocument();
    expect(screen.getByText('Filme 2')).toBeInTheDocument();
  });
}); 