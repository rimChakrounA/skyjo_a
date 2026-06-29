import { describe, expect, it } from 'vitest';
import { GameError } from '../src/game/errors.js';
import { createSeededRng } from '../src/game/rng.js';
import { GameSession } from '../src/services/gameSession.js';
import { makePlayers } from './helpers.js';

function startedSession(): GameSession {
  const session = new GameSession(makePlayers(2), createSeededRng(99));
  // Chaque joueur révèle deux cartes initiales.
  session.dispatch('p1', { type: 'REVEAL_INITIAL', cardIndex: 0 });
  session.dispatch('p1', { type: 'REVEAL_INITIAL', cardIndex: 1 });
  session.dispatch('p2', { type: 'REVEAL_INITIAL', cardIndex: 0 });
  session.dispatch('p2', { type: 'REVEAL_INITIAL', cardIndex: 1 });
  return session;
}

describe('GameSession', () => {
  it('démarre une partie en phase de révélation initiale', () => {
    const session = new GameSession(makePlayers(2), createSeededRng(1));
    expect(session.phase).toBe('initialReveal');
  });

  it('passe en phase de jeu une fois les révélations initiales faites', () => {
    const session = startedSession();
    expect(session.phase).toBe('playing');
    expect(session.currentPlayerId()).not.toBeNull();
  });

  it("filtre l'état selon le joueur (carte en main privée)", () => {
    const session = startedSession();
    const current = session.currentPlayerId();
    if (current === null) throw new Error('joueur courant manquant');
    session.dispatch(current, { type: 'DRAW_FROM_PILE' });

    const other = current === 'p1' ? 'p2' : 'p1';
    expect(session.publicStateFor(current).drawnCard).not.toBeNull();
    expect(session.publicStateFor(other).drawnCard).toBeNull();
  });

  it('refuse une action hors tour', () => {
    const session = startedSession();
    const current = session.currentPlayerId();
    const other = current === 'p1' ? 'p2' : 'p1';
    expect(() => session.dispatch(other, { type: 'DRAW_FROM_PILE' })).toThrow(GameError);
  });
});
