import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CardView } from '@/components/CardView';

describe('CardView', () => {
  it('déclenche onClick sur une carte cliquable', () => {
    const onClick = vi.fn();
    render(
      <CardView cell={{ faceUp: false }} clickable ariaLabel="Piocher une carte" onClick={onClick} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Piocher une carte' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('n’affiche pas de bouton quand la carte n’est pas cliquable', () => {
    render(<CardView cell={{ faceUp: false }} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applique le style caché sur une carte pioche cliquable', () => {
    render(<CardView cell={{ faceUp: false }} clickable ariaLabel="Piocher une carte" />);
    const card = screen.getByRole('button', { name: 'Piocher une carte' });
    expect(card.className).toMatch(/hidden/);
  });
});
