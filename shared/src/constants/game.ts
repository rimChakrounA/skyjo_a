/**
 * Constantes officielles du jeu Skyjo.
 * Aucune logique métier ici : uniquement des valeurs partagées entre client et serveur.
 */

/** Composition exacte du paquet officiel (150 cartes). */
export const DECK_COMPOSITION: ReadonlyArray<{ value: number; count: number }> = [
  { value: -2, count: 5 },
  { value: -1, count: 10 },
  { value: 0, count: 15 },
  { value: 1, count: 10 },
  { value: 2, count: 10 },
  { value: 3, count: 10 },
  { value: 4, count: 10 },
  { value: 5, count: 10 },
  { value: 6, count: 10 },
  { value: 7, count: 10 },
  { value: 8, count: 10 },
  { value: 9, count: 10 },
  { value: 10, count: 10 },
  { value: 11, count: 10 },
  { value: 12, count: 10 },
] as const;

/** Nombre total de cartes dans le paquet. */
export const DECK_SIZE = 150;

/** La grille d'un joueur est composée de 3 lignes et 4 colonnes. */
export const GRID_ROWS = 3;
export const GRID_COLS = 4;
export const BOARD_SIZE = GRID_ROWS * GRID_COLS;

/** Nombre de cartes révélées par chaque joueur au début d'une manche. */
export const INITIAL_REVEAL_COUNT = 2;

/** Bornes du nombre de joueurs par partie. */
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 8;

/** Seuil de points déclenchant la fin de la partie. */
export const END_SCORE = 100;

/** Longueur du code d'une salle. */
export const ROOM_CODE_LENGTH = 5;

/** Délai avant fermeture d'une salle en attente faute de joueurs suffisants (5 minutes). */
export const LOBBY_INSUFFICIENT_PLAYERS_TIMEOUT_MS = 5 * 60 * 1000;
