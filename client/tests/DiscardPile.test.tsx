import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DiscardPile } from '@/components/DiscardPile';

describe('DiscardPile', () => {
  it('appelle onDraw via le bouton Piocher en mode compact', () => {
    const onDraw = vi.fn();
    render(
      <DiscardPile
        compact
        discardTop={5}
        deckCount={42}
        drawnCard={null}
        canDraw
        canTake={false}
        canDiscardDrawn={false}
        onDraw={onDraw}
        onTake={vi.fn()}
        onDiscardDrawn={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Piocher' }));
    expect(onDraw).toHaveBeenCalledOnce();
  });

  it('appelle onDiscardDrawn via le bouton Défausser', () => {
    const onDiscardDrawn = vi.fn();
    render(
      <DiscardPile
        compact
        discardTop={5}
        deckCount={42}
        drawnCard={3}
        canDraw={false}
        canTake={false}
        canDiscardDrawn
        onDraw={vi.fn()}
        onTake={vi.fn()}
        onDiscardDrawn={onDiscardDrawn}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Défausser' }));
    expect(onDiscardDrawn).toHaveBeenCalledOnce();
  });
});
