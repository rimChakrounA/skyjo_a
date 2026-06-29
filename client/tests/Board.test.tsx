import type { PublicPlayer } from '@shared/types/game.js';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Board } from '@/components/Board';

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
    const card = screen.getByRole('button', { name: '5' });
    fireEvent.click(card);
    expect(onCardClick).toHaveBeenCalledWith(0);
  });
});
