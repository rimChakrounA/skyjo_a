import { describe, expect, it } from 'vitest';
import { applyInitialReveal } from '../src/game/startRound.js';
import { buildBoard, makeGameState, makePlayerState } from './helpers.js';

const allHidden = Array.from({ length: 12 }, () => false);

describe('applyInitialReveal', () => {
  it("reste en révélation initiale tant que les joueurs n'ont pas révélé 2 cartes", () => {
    const state = makeGameState({
      phase: 'initialReveal',
      players: [
        makePlayerState('p1', buildBoard([5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], allHidden)),
        makePlayerState('p2', buildBoard([2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], allHidden)),
      ],
    });

    const next = applyInitialReveal(state, 0, 0);
    expect(next.phase).toBe('initialReveal');
  });

  it('passe en phase de jeu et désigne le joueur à la plus haute somme', () => {
    let state = makeGameState({
      phase: 'initialReveal',
      players: [
        makePlayerState('p1', buildBoard([5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], allHidden)),
        makePlayerState('p2', buildBoard([2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], allHidden)),
      ],
    });

    state = applyInitialReveal(state, 0, 0);
    state = applyInitialReveal(state, 0, 1);
    state = applyInitialReveal(state, 1, 0);
    state = applyInitialReveal(state, 1, 1);

    expect(state.phase).toBe('playing');
    expect(state.turnPhase).toBe('chooseSource');
    expect(state.currentPlayerIndex).toBe(0);
  });
});
