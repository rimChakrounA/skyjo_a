import { describe, expect, it } from 'vitest';
import { GameError } from '../src/game/errors.js';
import { validateAction } from '../src/game/validation.js';
import { buildBoard, makeGameState, makePlayerState } from './helpers.js';

const hidden = Array.from({ length: 12 }, () => false);

function twoPlayerPlaying() {
  return makeGameState({
    players: [
      makePlayerState('p1', buildBoard(Array(12).fill(4), hidden)),
      makePlayerState('p2', buildBoard(Array(12).fill(4), hidden)),
    ],
  });
}

describe('validateAction', () => {
  it('refuse toute action lorsque la partie est terminée', () => {
    const state = makeGameState({
      phase: 'gameOver',
      players: [makePlayerState('p1', buildBoard(Array(12).fill(4), hidden))],
    });
    expect(() => validateAction(state, 'p1', { type: 'DRAW_FROM_PILE' })).toThrow(GameError);
  });

  it('refuse un joueur inexistant', () => {
    const state = twoPlayerPlaying();
    expect(() => validateAction(state, 'inconnu', { type: 'DRAW_FROM_PILE' })).toThrow(
      /inexistant/i,
    );
  });

  it("refuse une action hors de son tour", () => {
    const state = twoPlayerPlaying();
    expect(() => validateAction(state, 'p2', { type: 'DRAW_FROM_PILE' })).toThrow(/tour/i);
  });

  it('refuse de prendre une défausse vide', () => {
    const state = { ...twoPlayerPlaying(), discard: [] };
    expect(() => validateAction(state, 'p1', { type: 'TAKE_FROM_DISCARD' })).toThrow(/défausse/i);
  });

  it("refuse de remplacer sans carte en main", () => {
    const state = twoPlayerPlaying();
    expect(() => validateAction(state, 'p1', { type: 'REPLACE_CARD', cardIndex: 0 })).toThrow(
      GameError,
    );
  });

  it('accepte une pioche valide et renvoie l’index du joueur', () => {
    const state = twoPlayerPlaying();
    expect(validateAction(state, 'p1', { type: 'DRAW_FROM_PILE' })).toBe(0);
  });
});
