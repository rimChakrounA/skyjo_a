import { BOARD_SIZE } from '@shared/constants/game.js';
import type { CardValue, GameState, PlayerGameState } from '@shared/types/game.js';
import { createBoard } from './board.js';
import { createDeck, shuffle } from './deck.js';
import type { Rng } from './rng.js';

/** Informations minimales d'un joueur nécessaires pour démarrer une manche. */
export interface PlayerInfo {
  id: string;
  name: string;
  connected: boolean;
  totalScore: number;
}

/** Distribue 12 cartes face cachée à chaque joueur et renvoie le paquet restant. */
export function dealBoards(
  players: readonly PlayerInfo[],
  deck: readonly CardValue[],
): { players: PlayerGameState[]; remaining: CardValue[] } {
  const needed = players.length * BOARD_SIZE;
  if (deck.length < needed + 1) {
    throw new Error('Paquet insuffisant pour distribuer les cartes.');
  }

  const remaining = [...deck];
  const gamePlayers: PlayerGameState[] = players.map((player) => {
    const cards = remaining.splice(0, BOARD_SIZE);
    return {
      id: player.id,
      name: player.name,
      connected: player.connected,
      board: createBoard(cards),
      totalScore: player.totalScore,
      roundScore: null,
    };
  });

  return { players: gamePlayers, remaining };
}

/**
 * Prépare une manche complète : paquet mélangé, distribution, première carte en défausse.
 * La manche démarre en phase de révélation initiale.
 */
export function setupRound(players: readonly PlayerInfo[], round: number, rng: Rng): GameState {
  const shuffled = shuffle(createDeck(), rng);
  const { players: gamePlayers, remaining } = dealBoards(players, shuffled);

  const firstDiscard = remaining.pop();
  if (firstDiscard === undefined) {
    throw new Error('Paquet insuffisant pour initialiser la défausse.');
  }

  return {
    players: gamePlayers,
    deck: remaining,
    discard: [firstDiscard],
    currentPlayerIndex: 0,
    phase: 'initialReveal',
    turnPhase: 'chooseSource',
    drawnCard: null,
    roundEnderId: null,
    pendingFinalTurns: 0,
    round,
    winnerId: null,
  };
}
