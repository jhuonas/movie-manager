import { render, screen, fireEvent } from '@testing-library/react';
import ActorForm from './ActorForm';

describe('ActorForm', () => {
  it('renderiza o formulário e o botão de submit', () => {
    render(
      <ActorForm
        onClose={jest.fn()}
        setActors={jest.fn()}
        actors={[]}
        setError={jest.fn()}
      />
    );
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add actor/i })).toBeInTheDocument();
  });

  it('chama onClose ao clicar em cancelar', () => {
    const onClose = jest.fn();
    render(
      <ActorForm
        onClose={onClose}
        setActors={jest.fn()}
        actors={[]}
        setError={jest.fn()}
      />
    );
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);
    expect(onClose).toHaveBeenCalled();
  });
}); 