import { describe, expect, it } from 'vitest';
import { finalizeRound } from '../src/game/scoring.js';
import { buildBoard, makeGameState, makePlayerState } from './helpers.js';

const hidden = Array.from({ length: 12 }, () => false);

function boardSumming(total: number) {
  const values = Array(12).fill(0);
  values[0] = total;
  return buildBoard(values, hidden);
}

describe('finalizeRound', () => {
  it('double le score du joueur qui clôture sans avoir le plus petit total', () => {
    const state = makeGameState({
      phase: 'lastRound',
      roundEnderId: 'p1',
      players: [
        makePlayerState('p1', boardSumming(10)),
        makePlayerState('p2', boardSumming(5)),
      ],
    });

    const result = finalizeRound(state);
    expect(result.players[0]?.roundScore).toBe(20);
    expect(result.players[0]?.totalScore).toBe(20);
    expect(result.players[1]?.roundScore).toBe(5);
    expect(result.phase).toBe('roundOver');
  });

  it('ne double pas le score du joueur qui clôture avec le plus petit total', () => {
    const state = makeGameState({
      phase: 'lastRound',
      roundEnderId: 'p1',
      players: [
        makePlayerState('p1', boardSumming(3)),
        makePlayerState('p2', boardSumming(8)),
      ],
    });

    const result = finalizeRound(state);
    expect(result.players[0]?.roundScore).toBe(3);
  });

  it('termine la partie et désigne le vainqueur lorsqu’un joueur atteint 100', () => {
    const state = makeGameState({
      phase: 'lastRound',
      roundEnderId: 'p2',
      players: [
        makePlayerState('p1', boardSumming(5), 10),
        makePlayerState('p2', boardSumming(5), 98),
      ],
    });

    const result = finalizeRound(state);
    expect(result.phase).toBe('gameOver');
    expect(result.winnerId).toBe('p1');
  });
});
