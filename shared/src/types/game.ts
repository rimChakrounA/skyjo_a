/**
 * Types du domaine de jeu Skyjo.
 * Ces types décrivent l'état complet d'une partie tel que détenu par le serveur,
 * ainsi que la vue publique (filtrée) envoyée aux clients.
 */

/** Valeur d'une carte Skyjo (de -2 à 12). */
export type CardValue = number;

/** Phase globale d'une partie. */
export type GamePhase = 'initialReveal' | 'playing' | 'lastRound' | 'roundOver' | 'gameOver';

/**
 * Phase à l'intérieur du tour d'un joueur.
 * - `chooseSource` : le joueur doit piocher ou prendre la défausse.
 * - `resolveDraw` : une carte vient d'être piochée ; la remplacer ou la défausser.
 * - `resolveTake` : une carte vient d'être prise de la défausse ; elle doit remplacer une carte.
 * - `flip` : après avoir défaussé la carte piochée, le joueur doit révéler une carte cachée.
 */
export type TurnPhase = 'chooseSource' | 'resolveDraw' | 'resolveTake' | 'flip';

/** Une cellule de la grille telle que connue du serveur (valeur toujours présente). */
export interface BoardCell {
  value: CardValue;
  faceUp: boolean;
}

/** Grille d'un joueur : 12 cellules (index = ligne * GRID_COLS + colonne), `null` si retirée. */
export interface Board {
  cells: (BoardCell | null)[];
}

/** État d'un joueur dans une partie (vue serveur). */
export interface PlayerGameState {
  id: string;
  name: string;
  connected: boolean;
  board: Board;
  /** Score cumulé sur l'ensemble des manches jouées. */
  totalScore: number;
  /** Score de la manche en cours une fois calculé, sinon `null`. */
  roundScore: number | null;
}

/** État complet d'une partie (source de vérité côté serveur). */
export interface GameState {
  players: PlayerGameState[];
  /** Pioche : la carte du dessus est le dernier élément du tableau. */
  deck: CardValue[];
  /** Défausse : la carte du dessus est le dernier élément du tableau. */
  discard: CardValue[];
  currentPlayerIndex: number;
  phase: GamePhase;
  turnPhase: TurnPhase;
  /** Carte actuellement en main (piochée ou prise), en attente de placement. */
  drawnCard: CardValue | null;
  /** Joueur ayant déclenché la fin de la manche (toutes ses cartes révélées). */
  roundEnderId: string | null;
  /** Nombre de tours restants avant la fin de la manche (dernier tour de chaque adversaire). */
  pendingFinalTurns: number;
  /** Numéro de la manche en cours (commence à 1). */
  round: number;
  /** Vainqueur de la partie une fois celle-ci terminée, sinon `null`. */
  winnerId: string | null;
}

/** Cellule telle qu'envoyée au client : la valeur est masquée tant que la carte est cachée. */
export type PublicBoardCell = { faceUp: true; value: CardValue } | { faceUp: false } | null;

/** Vue publique d'un joueur. */
export interface PublicPlayer {
  id: string;
  name: string;
  connected: boolean;
  cells: PublicBoardCell[];
  totalScore: number;
  roundScore: number | null;
}

/** Vue publique de la partie, filtrée pour un joueur donné. */
export interface PublicGameState {
  players: PublicPlayer[];
  currentPlayerId: string | null;
  phase: GamePhase;
  turnPhase: TurnPhase;
  discardTop: CardValue | null;
  deckCount: number;
  /** Carte en main : visible uniquement par le joueur actif (sinon `null`). */
  drawnCard: CardValue | null;
  round: number;
  roundEnderId: string | null;
  winnerId: string | null;
}
