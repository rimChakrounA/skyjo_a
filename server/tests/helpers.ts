import type { Board, BoardCell, CardValue, GameState, PlayerGameState } from '@shared/types/game.js';
import type { NewPlayer } from '../src/game/game.js';

/** Construit une grille à partir de valeurs et d'un masque de cartes révélées. */
export function buildBoard(values: ReadonlyArray<CardValue | null>, faceUp: readonly boolean[]): Board {
  const cells: (BoardCell | null)[] = values.map((value, index) => {
    if (value === null) {
      return null;
    }
    return { value, faceUp: faceUp[index] ?? false };
  });
  return { cells };
}

/** Crée une liste de joueurs simples pour les tests. */
export function makePlayers(count: number): NewPlayer[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `p${index + 1}`,
    name: `Joueur ${index + 1}`,
    connected: true,
  }));
}

/** Construit un état de joueur de test. */
export function makePlayerState(
  id: string,
  board: Board,
  totalScore = 0,
): PlayerGameState {
  return { id, name: id, connected: true, board, totalScore, roundScore: null };
}

/** Construit un état de partie minimal et personnalisable pour les tests. */
export function makeGameState(overrides: Partial<GameState> & { players: PlayerGameState[] }): GameState {
  return {
    deck: [],
    discard: [0],
    currentPlayerIndex: 0,
    phase: 'playing',
    turnPhase: 'chooseSource',
    drawnCard: null,
    roundEnderId: null,
    pendingFinalTurns: 0,
    round: 1,
    winnerId: null,
    ...overrides,
  };
}
