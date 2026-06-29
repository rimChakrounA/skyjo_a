/**
 * Types liés aux salles et au lobby.
 */

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
  maxPlayers: number;
  players: RoomPlayer[];
}
