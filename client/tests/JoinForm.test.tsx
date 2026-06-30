import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { JoinForm } from '@/components/JoinForm';

const defaultProps = {
  minPlayers: 2,
  maxPlayers: 8,
  onMinPlayersChange: vi.fn(),
  onMaxPlayersChange: vi.fn(),
};

describe('JoinForm', () => {
  it('affiche un message d’erreur', () => {
    render(
      <JoinForm
        {...defaultProps}
        name=""
        code=""
        busy={false}
        error="Pseudo requis"
        onNameChange={vi.fn()}
        onCodeChange={vi.fn()}
        onCreate={vi.fn()}
        onJoin={vi.fn()}
      />,
    );
    expect(screen.getByText('Pseudo requis')).toBeInTheDocument();
  });

  it('déclenche la création de salle', () => {
    const onCreate = vi.fn();
    render(
      <JoinForm
        {...defaultProps}
        name="Alice"
        code=""
        busy={false}
        error={null}
        onNameChange={vi.fn()}
        onCodeChange={vi.fn()}
        onCreate={onCreate}
        onJoin={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText('Créer une salle'));
    expect(onCreate).toHaveBeenCalledOnce();
  });

  it('notifie la saisie du pseudo', () => {
    const onNameChange = vi.fn();
    render(
      <JoinForm
        {...defaultProps}
        name=""
        code=""
        busy={false}
        error={null}
        onNameChange={onNameChange}
        onCodeChange={vi.fn()}
        onCreate={vi.fn()}
        onJoin={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByPlaceholderText('Votre nom'), { target: { value: 'Bob' } });
    expect(onNameChange).toHaveBeenCalledWith('Bob');
  });
});
