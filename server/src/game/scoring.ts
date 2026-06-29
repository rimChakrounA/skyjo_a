import { END_SCORE } from '@shared/constants/game.js';
import type { GameState, PlayerGameState } from '@shared/types/game.js';
import { boardScore, revealAll } from './board.js';

/**
 * Détermine si le score du joueur qui a clôturé la manche doit être doublé.
 * Règle officielle : le score est doublé si ce joueur n'a pas le plus petit total
 * de la manche (à lui seul) et que son score est strictement positif.
 */
function shouldDoubleEnder(rawScores: readonly number[], enderIndex: number): boolean {
  const enderScore = rawScores[enderIndex];
  if (enderScore === undefined || enderScore <= 0) {
    return false;
  }
  const isUniqueLowest = rawScores.every(
    (score, index) => index === enderIndex || score > enderScore,
  );
  return !isUniqueLowest;
}

/** Renvoie l'id du joueur ayant le plus petit total (premier en cas d'égalité). */
export function determineWinner(players: readonly PlayerGameState[]): string | null {
  let winner: PlayerGameState | null = null;
  for (const player of players) {
    if (winner === null || player.totalScore < winner.totalScore) {
      winner = player;
    }
  }
  return winner?.id ?? null;
}

/**
 * Clôture la manche en cours : révèle toutes les cartes, calcule les scores
 * (avec doublement éventuel), met à jour les totaux et détecte la fin de partie.
 */
export function finalizeRound(state: GameState): GameState {
  const enderIndex = state.players.findIndex((player) => player.id === state.roundEnderId);

  const revealedPlayers = state.players.map((player) => ({
    ...player,
    board: revealAll(player.board),
  }));

  const rawScores = revealedPlayers.map((player) => boardScore(player.board));
  const doubleEnder = enderIndex !== -1 && shouldDoubleEnder(rawScores, enderIndex);

  const scoredPlayers: PlayerGameState[] = revealedPlayers.map((player, index) => {
    const raw = rawScores[index] ?? 0;
    const roundScore = index === enderIndex && doubleEnder ? raw * 2 : raw;
    return {
      ...player,
      roundScore,
      totalScore: player.totalScore + roundScore,
    };
  });

  const gameOver = scoredPlayers.some((player) => player.totalScore >= END_SCORE);

  return {
    ...state,
    players: scoredPlayers,
    drawnCard: null,
    turnPhase: 'chooseSource',
    pendingFinalTurns: 0,
    phase: gameOver ? 'gameOver' : 'roundOver',
    winnerId: gameOver ? determineWinner(scoredPlayers) : null,
  };
}
