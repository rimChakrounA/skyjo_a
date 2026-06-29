import type { GameAction } from '@shared/types/actions.js';
import type { GameState } from '@shared/types/game.js';
import { isBoardFullyResolved } from './board.js';
import { removeMatchingColumns } from './columns.js';
import type { Rng } from './rng.js';
import { finalizeRound } from './scoring.js';
import { setupRound, type PlayerInfo } from './setup.js';
import { applyInitialReveal } from './startRound.js';
import {
  applyDiscardDrawn,
  applyDrawFromPile,
  applyFlipCard,
  applyReplaceCard,
  applyTakeFromDiscard,
} from './turn.js';
import { validateAction } from './validation.js';

/** Joueur tel que fourni à la création d'une partie. */
export interface NewPlayer {
  id: string;
  name: string;
  connected: boolean;
}

/** Crée une nouvelle partie et démarre la première manche. */
export function createGame(players: readonly NewPlayer[], rng: Rng): GameState {
  const infos: PlayerInfo[] = players.map((player) => ({ ...player, totalScore: 0 }));
  return setupRound(infos, 1, rng);
}

/** Démarre la manche suivante en conservant les totaux (valide après une fin de manche). */
export function startNextRound(state: GameState, rng: Rng): GameState {
  const infos: PlayerInfo[] = state.players.map((player) => ({
    id: player.id,
    name: player.name,
    connected: player.connected,
    totalScore: player.totalScore,
  }));
  return setupRound(infos, state.round + 1, rng);
}

/** Nombre d'adversaires encore connectés (hors joueur donné). */
function countOtherConnected(state: GameState, playerId: string): number {
  return state.players.filter((player) => player.connected && player.id !== playerId).length;
}

/** Index du prochain joueur connecté après `fromIndex`. */
function nextConnectedIndex(state: GameState, fromIndex: number): number {
  const total = state.players.length;
  for (let offset = 1; offset <= total; offset++) {
    const index = (fromIndex + offset) % total;
    if (state.players[index]?.connected) {
      return index;
    }
  }
  return fromIndex;
}

/**
 * Fait progresser la partie après la fin d'un tour : détection de fin de manche,
 * passage au joueur suivant et calcul des scores le cas échéant.
 */
function advanceTurn(state: GameState, fullyResolved: boolean): GameState {
  const index = state.currentPlayerIndex;
  const current = state.players[index];
  if (current === undefined) {
    return state;
  }

  if (state.phase === 'playing') {
    if (fullyResolved) {
      const others = countOtherConnected(state, current.id);
      const triggered: GameState = {
        ...state,
        phase: 'lastRound',
        roundEnderId: current.id,
        pendingFinalTurns: others,
      };
      if (others === 0) {
        return finalizeRound(triggered);
      }
      return { ...triggered, currentPlayerIndex: nextConnectedIndex(triggered, index) };
    }
    return { ...state, currentPlayerIndex: nextConnectedIndex(state, index) };
  }

  const pending = state.pendingFinalTurns - 1;
  if (pending <= 0) {
    return finalizeRound({ ...state, pendingFinalTurns: 0 });
  }
  return {
    ...state,
    pendingFinalTurns: pending,
    currentPlayerIndex: nextConnectedIndex(state, index),
  };
}

/**
 * Conclut le tour du joueur courant : suppression des colonnes puis progression de la partie.
 */
export function finalizeTurn(state: GameState): GameState {
  const index = state.currentPlayerIndex;
  const current = state.players[index];
  if (current === undefined) {
    return state;
  }

  const { board, removed } = removeMatchingColumns(current.board);
  const players = [...state.players];
  players[index] = { ...current, board };
  const discard = removed.length > 0 ? [...state.discard, ...removed] : state.discard;
  const updated: GameState = { ...state, players, discard };

  return advanceTurn(updated, isBoardFullyResolved(board));
}

/**
 * Passe le tour si le joueur courant est déconnecté, afin que la partie ne se bloque pas.
 * Sans effet si le joueur courant est connecté ou si la partie n'est pas en cours.
 */
export function skipDisconnectedTurn(state: GameState): GameState {
  if (state.phase !== 'playing' && state.phase !== 'lastRound') {
    return state;
  }
  const current = state.players[state.currentPlayerIndex];
  if (current === undefined || current.connected) {
    return state;
  }
  const reset: GameState = { ...state, drawnCard: null, turnPhase: 'chooseSource' };
  return advanceTurn(reset, isBoardFullyResolved(current.board));
}

/**
 * Valide puis applique une action d'un joueur et renvoie le nouvel état.
 * Lève une `GameError` si l'action est invalide.
 */
export function applyAction(
  state: GameState,
  playerId: string,
  action: GameAction,
  rng: Rng,
): GameState {
  const playerIndex = validateAction(state, playerId, action);

  switch (action.type) {
    case 'REVEAL_INITIAL':
      return applyInitialReveal(state, playerIndex, action.cardIndex);
    case 'DRAW_FROM_PILE':
      return applyDrawFromPile(state, rng);
    case 'TAKE_FROM_DISCARD':
      return applyTakeFromDiscard(state);
    case 'REPLACE_CARD':
      return finalizeTurn(applyReplaceCard(state, action.cardIndex));
    case 'DISCARD_DRAWN':
      return applyDiscardDrawn(state);
    case 'FLIP_CARD':
      return finalizeTurn(applyFlipCard(state, action.cardIndex));
  }
}
