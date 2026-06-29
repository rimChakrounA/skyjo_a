import type { PublicPlayer } from '@shared/types/game.js';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Scoreboard } from '@/components/Scoreboard';

const players: PublicPlayer[] = [
  { id: 'p1', name: 'Alice', connected: true, cells: [], totalScore: 25, roundScore: 10 },
  { id: 'p2', name: 'Bob', connected: true, cells: [], totalScore: 40, roundScore: 18 },
];

describe('Scoreboard', () => {
  it('affiche les joueurs et leurs totaux', () => {
    render(<Scoreboard players={players} roundEnderId="p1" />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
  });
});
