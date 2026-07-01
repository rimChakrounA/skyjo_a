import type { PublicPlayer } from '@shared/types/game.js';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Board } from '@/components/Board';
import styles from '@/components/Board.module.css';

function makePlayer(): PublicPlayer {
  const cells = Array.from({ length: 12 }, (_, index) =>
    index === 0 ? ({ faceUp: true, value: 5 } as const) : ({ faceUp: false } as const),
  );
  return { id: 'p1', name: 'Alice', connected: true, cells, totalScore: 0, roundScore: null };
}

describe('Board', () => {
  it('affiche le nom et le total du joueur', () => {
    render(<Board player={makePlayer()} isSelf isCurrent={false} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText(/Total/)).toBeInTheDocument();
  });

  it('appelle onCardClick lorsqu’une carte cliquable est cliquée', () => {
    const onCardClick = vi.fn();
    render(
      <Board
        player={makePlayer()}
        isSelf
        isCurrent
        canClick={(index) => index === 0}
        onCardClick={onCardClick}
      />,
    );
    const card = screen.getByRole('button', { name: 'Remplacer la carte 5' });
    fireEvent.click(card);
    expect(onCardClick).toHaveBeenCalledWith(0);
  });

  it('gère une colonne retirée sans planter', () => {
    const player = makePlayer();
    player.cells[0] = null;
    player.cells[4] = null;
    player.cells[8] = null;
    render(<Board player={player} isSelf isCurrent canClick={() => false} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('applique la bordure joueur actif en mode compact', () => {
    const { container } = render(
      <Board player={makePlayer()} isSelf isCurrent compact canClick={() => false} />,
    );
    expect(container.firstChild).toHaveClass(styles.current);
  });
});
