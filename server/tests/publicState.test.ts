import { describe, expect, it } from 'vitest';
import { toPublicState } from '../src/game/publicState.js';
import { buildBoard, makeGameState, makePlayerState } from './helpers.js';

const mask = [true, false, ...Array.from({ length: 10 }, () => false)];

describe('toPublicState', () => {
  it('masque la valeur des cartes cachées', () => {
    const state = makeGameState({
      players: [makePlayerState('p1', buildBoard(Array(12).fill(7), mask))],
    });

    const view = toPublicState(state, 'p1');
    expect(view.players[0]?.cells[0]).toEqual({ faceUp: true, value: 7 });
    expect(view.players[0]?.cells[1]).toEqual({ faceUp: false });
  });

  it('ne révèle la carte en main qu’au joueur actif', () => {
    const state = makeGameState({
      drawnCard: 9,
      turnPhase: 'resolveDraw',
      players: [
        makePlayerState('p1', buildBoard(Array(12).fill(7), mask)),
        makePlayerState('p2', buildBoard(Array(12).fill(7), mask)),
      ],
    });

    expect(toPublicState(state, 'p1').drawnCard).toBe(9);
    expect(toPublicState(state, 'p2').drawnCard).toBeNull();
  });
});
