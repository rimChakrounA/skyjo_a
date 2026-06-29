import { INITIAL_REVEAL_COUNT } from '@shared/constants/game.js';
import type { GameState, PlayerGameState } from '@shared/types/game.js';
import { boardScore, countFaceUp, flipCell } from './board.js';

/** Indique si tous les joueurs ont révélé leurs cartes initiales. */
function allInitialRevealsDone(players: readonly PlayerGameState[]): boolean {
  return players.every((player) => countFaceUp(player.board) >= INITIAL_REVEAL_COUNT);
}

/** Détermine l'index du joueur qui commence (plus haute somme révélée, premier en cas d'égalité). */
function determineStartingPlayer(players: readonly PlayerGameState[]): number {
  let bestIndex = 0;
  let bestScore = -Infinity;
  players.forEach((player, index) => {
    const score = boardScore(player.board);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });
  return bestIndex;
}

/**
 * Applique la révélation d'une carte initiale par un joueur.
 * Lorsque tous les joueurs ont révélé leurs cartes, la manche passe en phase de jeu
 * et le premier joueur est déterminé.
 */
export function applyInitialReveal(
  state: GameState,
  playerIndex: number,
  cardIndex: number,
): GameState {
  const player = state.players[playerIndex];
  if (player === undefined) {
    return state;
  }

  const players = [...state.players];
  players[playerIndex] = { ...player, board: flipCell(player.board, cardIndex) };

  if (!allInitialRevealsDone(players)) {
    return { ...state, players };
  }

  return {
    ...state,
    players,
    phase: 'playing',
    turnPhase: 'chooseSource',
    currentPlayerIndex: determineStartingPlayer(players),
  };
}
