import { describe, expect, it } from 'vitest';
import { defaultRng } from '../src/game/rng.js';
import {
  applyDiscardDrawn,
  applyDrawFromPile,
  applyFlipCard,
  applyReplaceCard,
  applyTakeFromDiscard,
} from '../src/game/turn.js';
import { buildBoard, makeGameState, makePlayerState } from './helpers.js';

const hidden = Array.from({ length: 12 }, () => false);

function playingState() {
  return makeGameState({
    deck: [3, 9],
    discard: [0, 5],
    players: [makePlayerState('p1', buildBoard(Array(12).fill(4), hidden))],
  });
}

describe('applyDrawFromPile', () => {
  it('met la carte du dessus de la pioche en main', () => {
    const next = applyDrawFromPile(playingState(), defaultRng);
    expect(next.drawnCard).toBe(9);
    expect(next.deck).toEqual([3]);
    expect(next.turnPhase).toBe('resolveDraw');
  });
});

describe('applyReplaceCard', () => {
  it('place la carte en main et défausse la carte remplacée', () => {
    const drawn = { ...playingState(), drawnCard: 9 as number, turnPhase: 'resolveDraw' as const };
    const next = applyReplaceCard(drawn, 0);
    expect(next.players[0]?.board.cells[0]).toEqual({ value: 9, faceUp: true });
    expect(next.discard.at(-1)).toBe(4);
    expect(next.drawnCard).toBeNull();
  });
});

describe('applyDiscardDrawn', () => {
  it('défausse la carte piochée et impose une révélation', () => {
    const drawn = { ...playingState(), drawnCard: 9 as number, turnPhase: 'resolveDraw' as const };
    const next = applyDiscardDrawn(drawn);
    expect(next.discard.at(-1)).toBe(9);
    expect(next.drawnCard).toBeNull();
    expect(next.turnPhase).toBe('flip');
  });
});

describe('applyTakeFromDiscard', () => {
  it('prend la carte du dessus de la défausse', () => {
    const next = applyTakeFromDiscard(playingState());
    expect(next.drawnCard).toBe(5);
    expect(next.discard).toEqual([0]);
    expect(next.turnPhase).toBe('resolveTake');
  });
});

describe('applyFlipCard', () => {
  it('révèle une carte cachée', () => {
    const flipping = { ...playingState(), turnPhase: 'flip' as const };
    const next = applyFlipCard(flipping, 2);
    expect(next.players[0]?.board.cells[2]).toEqual({ value: 4, faceUp: true });
  });
});
