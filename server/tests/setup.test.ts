import { BOARD_SIZE, DECK_SIZE } from '@shared/constants/game.js';
import { describe, expect, it } from 'vitest';
import { createSeededRng } from '../src/game/rng.js';
import { dealBoards, setupRound, type PlayerInfo } from '../src/game/setup.js';

function infos(count: number): PlayerInfo[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `p${i}`,
    name: `p${i}`,
    connected: true,
    totalScore: 0,
  }));
}

describe('dealBoards', () => {
  it('distribue 12 cartes face cachée à chaque joueur', () => {
    const deck = Array.from({ length: DECK_SIZE }, (_, i) => (i % 15) - 2);
    const { players } = dealBoards(infos(3), deck);
    expect(players).toHaveLength(3);
    for (const player of players) {
      expect(player.board.cells).toHaveLength(BOARD_SIZE);
      expect(player.board.cells.every((cell) => cell !== null && !cell.faceUp)).toBe(true);
    }
  });
});

describe('setupRound', () => {
  it('initialise la défausse, la pioche et la phase de révélation', () => {
    const state = setupRound(infos(4), 1, createSeededRng(3));
    expect(state.phase).toBe('initialReveal');
    expect(state.discard).toHaveLength(1);
    expect(state.deck).toHaveLength(DECK_SIZE - 4 * BOARD_SIZE - 1);
    expect(state.round).toBe(1);
  });
});
