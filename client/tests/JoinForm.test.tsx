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
        code=""
        busy={false}
        error="Pseudo requis"
        onCodeChange={vi.fn()}
        onCreate={vi.fn()}
        onJoin={vi.fn()}
      />,
    );
    expect(screen.getByText('Pseudo requis')).toBeInTheDocument();
  });

  it('affiche un libellé de chargement pendant la création', () => {
    render(
      <JoinForm
        {...defaultProps}
        code=""
        busy
        pendingAction="create"
        error={null}
        onCodeChange={vi.fn()}
        onCreate={vi.fn()}
        onJoin={vi.fn()}
      />,
    );
    expect(screen.getByText('Création…')).toBeInTheDocument();
  });

  it('déclenche la création de salle', () => {
    const onCreate = vi.fn();
    render(
      <JoinForm
        {...defaultProps}
        code=""
        busy={false}
        error={null}
        onCodeChange={vi.fn()}
        onCreate={onCreate}
        onJoin={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText('Créer une salle'));
    expect(onCreate).toHaveBeenCalledOnce();
  });

  it('notifie la saisie du code de salle', () => {
    const onCodeChange = vi.fn();
    render(
      <JoinForm
        {...defaultProps}
        code=""
        busy={false}
        error={null}
        onCodeChange={onCodeChange}
        onCreate={vi.fn()}
        onJoin={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByPlaceholderText('EX : ABCDE'), { target: { value: 'abcde' } });
    expect(onCodeChange).toHaveBeenCalledWith('ABCDE');
  });
});
