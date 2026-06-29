import type { GameState } from '@shared/types/game.js';
import { describe, expect, it } from 'vitest';
import { createSeededRng } from '../../src/game/rng.js';
import { GameSession } from '../../src/services/gameSession.js';
import { makePlayers } from '../helpers.js';

/** Index de la première cellule cachée, sinon la première cellule présente. */
function pickCardIndex(state: GameState, playerIndex: number): number {
  const cells = state.players[playerIndex]?.board.cells ?? [];
  const hidden = cells.findIndex((cell) => cell !== null && !cell.faceUp);
  if (hidden !== -1) {
    return hidden;
  }
  return cells.findIndex((cell) => cell !== null);
}

/** Joue une partie complète de bout en bout avec une stratégie simple et déterministe. */
describe('partie complète (intégration)', () => {
  it('se déroule jusqu’à la désignation d’un vainqueur', () => {
    const session = new GameSession(makePlayers(2), createSeededRng(2024));

    let guard = 0;
    const maxIterations = 100_000;

    while (session.phase !== 'gameOver' && guard < maxIterations) {
      guard++;
      const state = session.getState();

      if (state.phase === 'initialReveal') {
        state.players.forEach((player, index) => {
          const cells = session.getState().players[index]?.board.cells ?? [];
          const faceUp = cells.filter((cell) => cell !== null && cell.faceUp).length;
          for (let n = faceUp; n < 2; n++) {
            const idx = pickCardIndex(session.getState(), index);
            session.dispatch(player.id, { type: 'REVEAL_INITIAL', cardIndex: idx });
          }
        });
        continue;
      }

      if (state.phase === 'roundOver') {
        session.nextRound();
        continue;
      }

      const currentId = session.currentPlayerId();
      if (currentId === null) {
        break;
      }
      const currentIndex = session.getState().currentPlayerIndex;
      const turnPhase = session.getState().turnPhase;

      if (turnPhase === 'chooseSource') {
        session.dispatch(currentId, { type: 'DRAW_FROM_PILE' });
      } else if (turnPhase === 'resolveDraw' || turnPhase === 'resolveTake') {
        session.dispatch(currentId, {
          type: 'REPLACE_CARD',
          cardIndex: pickCardIndex(session.getState(), currentIndex),
        });
      } else if (turnPhase === 'flip') {
        session.dispatch(currentId, {
          type: 'FLIP_CARD',
          cardIndex: pickCardIndex(session.getState(), currentIndex),
        });
      }
    }

    expect(session.phase).toBe('gameOver');
    const standings = session.getStandings();
    expect(standings).not.toBeNull();
    expect(standings?.winnerId).not.toBe('');
    expect(standings?.players).toHaveLength(2);
  });
});
