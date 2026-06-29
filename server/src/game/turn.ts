import type { CardValue, GameState } from '@shared/types/game.js';
import { flipCell, replaceCell } from './board.js';
import { shuffle } from './deck.js';
import type { Rng } from './rng.js';

/**
 * Garantit qu'au moins une carte est disponible dans la pioche.
 * Si la pioche est vide, la défausse (hors carte du dessus) est remélangée.
 */
function ensureDrawableDeck(state: GameState, rng: Rng): GameState {
  if (state.deck.length > 0 || state.discard.length <= 1) {
    return state;
  }
  const discard = [...state.discard];
  const top = discard.pop() as CardValue;
  const reshuffled = shuffle(discard, rng);
  return { ...state, deck: reshuffled, discard: [top] };
}

/** Pioche la carte du dessus de la pioche et la met en main. */
export function applyDrawFromPile(state: GameState, rng: Rng): GameState {
  const prepared = ensureDrawableDeck(state, rng);
  const deck = [...prepared.deck];
  const drawn = deck.pop();
  if (drawn === undefined) {
    return prepared;
  }
  return { ...prepared, deck, drawnCard: drawn, turnPhase: 'resolveDraw' };
}

/** Prend la carte du dessus de la défausse et la met en main. */
export function applyTakeFromDiscard(state: GameState): GameState {
  const discard = [...state.discard];
  const taken = discard.pop();
  if (taken === undefined) {
    return state;
  }
  return { ...state, discard, drawnCard: taken, turnPhase: 'resolveTake' };
}

/** Remplace une carte de la grille du joueur courant par la carte en main. */
export function applyReplaceCard(state: GameState, cardIndex: number): GameState {
  if (state.drawnCard === null) {
    return state;
  }
  const players = [...state.players];
  const current = players[state.currentPlayerIndex];
  if (current === undefined) {
    return state;
  }
  const { board, previous } = replaceCell(current.board, cardIndex, state.drawnCard);
  players[state.currentPlayerIndex] = { ...current, board };
  return {
    ...state,
    players,
    discard: [...state.discard, previous],
    drawnCard: null,
    turnPhase: 'chooseSource',
  };
}

/** Défausse la carte piochée ; le joueur devra ensuite révéler une carte. */
export function applyDiscardDrawn(state: GameState): GameState {
  if (state.drawnCard === null) {
    return state;
  }
  return {
    ...state,
    discard: [...state.discard, state.drawnCard],
    drawnCard: null,
    turnPhase: 'flip',
  };
}

/** Révèle une carte cachée de la grille du joueur courant. */
export function applyFlipCard(state: GameState, cardIndex: number): GameState {
  const players = [...state.players];
  const current = players[state.currentPlayerIndex];
  if (current === undefined) {
    return state;
  }
  players[state.currentPlayerIndex] = { ...current, board: flipCell(current.board, cardIndex) };
  return { ...state, players, turnPhase: 'chooseSource' };
}
