/**
 * Types liés aux salles et au lobby.
 */

import type { GamePhase } from './game.js';

export type RoomStatus = 'lobby' | 'in-game';

/** Représentation d'un joueur dans une salle (hors partie). */
export interface RoomPlayer {
  id: string;
  name: string;
  isHost: boolean;
  connected: boolean;
}

/** Résumé d'une salle envoyé aux clients. */
export interface RoomSummary {
  code: string;
  status: RoomStatus;
  hostId: string;
  minPlayers: number;
  maxPlayers: number;
  players: RoomPlayer[];
}

/** Score cumulé affiché dans la liste publique des parties en cours. */
export interface PublicRoomStanding {
  name: string;
  totalScore: number;
}

/** Vue publique d'une salle pour la liste sur la page d'accueil (sans données sensibles). */
export interface PublicRoomListItem {
  code: string;
  status: RoomStatus;
  hostName: string;
  playerCount: number;
  connectedCount: number;
  minPlayers: number;
  maxPlayers: number;
  round?: number;
  phase?: GamePhase;
  currentPlayerName?: string | null;
  standings?: PublicRoomStanding[];
}
