/**
 * Actions qu'un joueur peut soumettre au serveur pendant une partie.
 * Le serveur valide systématiquement chaque action avant de l'appliquer.
 */

/** Révéler une carte cachée pendant la phase de révélation initiale. */
export interface RevealInitialAction {
  type: 'REVEAL_INITIAL';
  cardIndex: number;
}

/** Piocher la carte du dessus de la pioche. */
export interface DrawFromPileAction {
  type: 'DRAW_FROM_PILE';
}

/** Prendre la carte du dessus de la défausse. */
export interface TakeFromDiscardAction {
  type: 'TAKE_FROM_DISCARD';
}

/** Remplacer une carte de sa grille par la carte en main. */
export interface ReplaceCardAction {
  type: 'REPLACE_CARD';
  cardIndex: number;
}

/** Défausser la carte piochée (uniquement après une pioche). */
export interface DiscardDrawnAction {
  type: 'DISCARD_DRAWN';
}

/** Révéler une carte cachée (après avoir défaussé la carte piochée). */
export interface FlipCardAction {
  type: 'FLIP_CARD';
  cardIndex: number;
}

/** Union de toutes les actions de jeu possibles. */
export type GameAction =
  | RevealInitialAction
  | DrawFromPileAction
  | TakeFromDiscardAction
  | ReplaceCardAction
  | DiscardDrawnAction
  | FlipCardAction;

/** Type littéral de toutes les actions. */
export type GameActionType = GameAction['type'];
