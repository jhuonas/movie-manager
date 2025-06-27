import { render, screen } from '@testing-library/react';
import ActorTab from './ActorTab';

describe('ActorTab', () => {
  it('renderiza o título da aba de atores', () => {
    render(
      <ActorTab
        actors={[]}
        setActors={jest.fn()}
        loading={false}
        setError={jest.fn()}
        currentPage={1}
        setSelectedActor={jest.fn()}
        isFormOpen={false}
        onFormClose={jest.fn()}
        onActorDelete={jest.fn()}
        onActorSelect={jest.fn()}
        onPageChange={jest.fn()}
        itemsPerPage={10}
        searchTerm=""
        onActorFormOpen={jest.fn()}
      />
    );
    expect(screen.getByText(/actors/i)).toBeInTheDocument();
  });
}); 