import { describe, expect, it } from 'vitest';
import { applyAction, createGame, finalizeTurn, startNextRound } from '../src/game/game.js';
import { createSeededRng, defaultRng } from '../src/game/rng.js';
import { buildBoard, makeGameState, makePlayerState } from './helpers.js';

const hidden = Array.from({ length: 12 }, () => false);
const revealed = Array.from({ length: 12 }, () => true);

describe('createGame', () => {
  it('démarre une partie en phase de révélation initiale', () => {
    const state = createGame(
      [
        { id: 'p1', name: 'A', connected: true },
        { id: 'p2', name: 'B', connected: true },
        { id: 'p3', name: 'C', connected: true },
      ],
      createSeededRng(1),
    );
    expect(state.phase).toBe('initialReveal');
    expect(state.players).toHaveLength(3);
    expect(state.round).toBe(1);
  });
});

describe('applyAction', () => {
  it('passe au joueur suivant après une pioche puis un remplacement', () => {
    let state = makeGameState({
      deck: [1, 8],
      discard: [0, 5],
      players: [
        makePlayerState('p1', buildBoard(Array(12).fill(4), hidden)),
        makePlayerState('p2', buildBoard(Array(12).fill(4), hidden)),
      ],
    });

    state = applyAction(state, 'p1', { type: 'DRAW_FROM_PILE' }, defaultRng);
    expect(state.turnPhase).toBe('resolveDraw');
    state = applyAction(state, 'p1', { type: 'REPLACE_CARD', cardIndex: 0 }, defaultRng);
    expect(state.currentPlayerIndex).toBe(1);
    expect(state.turnPhase).toBe('chooseSource');
  });
});

describe('finalizeTurn', () => {
  it('déclenche le dernier tour quand un joueur a tout révélé', () => {
    const state = makeGameState({
      phase: 'playing',
      players: [
        makePlayerState('p1', buildBoard(Array(12).fill(2), revealed)),
        makePlayerState('p2', buildBoard(Array(12).fill(4), hidden)),
      ],
    });

    const next = finalizeTurn(state);
    expect(next.phase).toBe('lastRound');
    expect(next.roundEnderId).toBe('p1');
    expect(next.currentPlayerIndex).toBe(1);
    expect(next.pendingFinalTurns).toBe(1);
  });

  it('clôture la manche après le dernier tour des adversaires', () => {
    const state = makeGameState({
      phase: 'lastRound',
      roundEnderId: 'p1',
      pendingFinalTurns: 1,
      currentPlayerIndex: 1,
      players: [
        makePlayerState('p1', buildBoard(Array(12).fill(2), revealed)),
        makePlayerState('p2', buildBoard(Array(12).fill(4), revealed)),
      ],
    });

    const next = finalizeTurn(state);
    expect(['roundOver', 'gameOver']).toContain(next.phase);
    expect(next.players[0]?.roundScore).not.toBeNull();
  });
});

describe('startNextRound', () => {
  it('démarre une nouvelle manche en conservant les totaux', () => {
    const state = makeGameState({
      phase: 'roundOver',
      round: 2,
      players: [
        makePlayerState('p1', buildBoard(Array(12).fill(2), revealed), 30),
        makePlayerState('p2', buildBoard(Array(12).fill(4), revealed), 12),
      ],
    });

    const next = startNextRound(state, createSeededRng(5));
    expect(next.round).toBe(3);
    expect(next.phase).toBe('initialReveal');
    expect(next.players[0]?.totalScore).toBe(30);
    expect(next.players[1]?.totalScore).toBe(12);
  });
});
